package api

import (
	"context"
	"time"

	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/ent/predicate"
	"github.com/mayocream/twitter/ent/user"
	"github.com/mayocream/twitter/internal/config"
	"github.com/mayocream/twitter/internal/email"
	"github.com/mayocream/twitter/internal/turnstile"
	"github.com/mayocream/twitter/internal/validator"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AccountHandler struct {
	DB        *ent.Client
	Config    *config.Config
	Turnstile *turnstile.Turnstile
	Email     email.Email
}

func NewAccountHandler(
	db *ent.Client,
	config *config.Config,
	turnstile *turnstile.Turnstile,
	email email.Email,
) *AccountHandler {
	return &AccountHandler{
		DB:        db,
		Config:    config,
		Turnstile: turnstile,
		Email:     email,
	}
}

func (h *AccountHandler) Routes() []Route {
	return []Route{
		{
			Method:  fiber.MethodPost,
			Path:    "/auth/register",
			Handler: h.Register(),
		},
		{
			Method:  fiber.MethodPost,
			Path:    "/auth/login",
			Handler: h.Login(),
		},
		{
			Method:  fiber.MethodPost,
			Path:    "/auth/email/verification",
			Handler: h.EmailVerification(),
		},
	}
}

func (h *AccountHandler) EmailVerification() fiber.Handler {
	type Request struct {
		Token string `json:"token" validate:"required"`
	}

	return func(c fiber.Ctx) error {
		var req Request
		if err := c.Bind().JSON(&req); err != nil {
			return fiber.ErrBadRequest
		}

		claims := jwt.MapClaims{}
		t, err := jwt.ParseWithClaims(req.Token, claims, func(t *jwt.Token) (interface{}, error) {
			return h.Config.JWTSecretPub, nil
		})
		if err != nil {
			log.Errorf("failed to parse JWT: %v", err)
			return fiber.ErrBadRequest
		}

		if !t.Valid {
			log.Errorf("invalid JWT")
			return fiber.ErrBadRequest
		}

		id, ok := claims["id"].(float64)
		if !ok {
			log.Errorf("failed to get id from claims")
			return fiber.ErrBadRequest
		}

		email, ok := claims["email"].(string)
		if !ok {
			log.Errorf("failed to get email from claims")
			return fiber.ErrBadRequest
		}

		user, err := h.DB.User.Get(context.Background(), int(id))
		if err != nil {
			log.Errorf("failed to get user: %v", err)
			return err
		}

		if err := user.Update().SetEmail(email).Exec(context.Background()); err != nil {
			log.Errorf("failed to update user: %v", err)
			return err
		}

		return c.JSON(fiber.Map{"message": "Email verified"})
	}
}

// Register registers a new user.
func (h *AccountHandler) Register() fiber.Handler {
	type Request struct {
		Token    string `json:"token" validate:"required"`
		Email    string `json:"email" validate:"required,email"`
		Username string `json:"username" validate:"required,username,min=3,max=30"`
		Password string `json:"password" validate:"required,min=6,max=72"`
	}

	return func(c fiber.Ctx) error {
		var req Request
		if err := c.Bind().JSON(&req); err != nil {
			log.Errorf("failed to bind request: %v", err)
			return fiber.ErrBadRequest
		}

		// turnstile verification
		if err := h.Turnstile.Verify(req.Token); err != nil {
			log.Errorf("failed to verify turnstile: %v", err)
			return fiber.ErrBadRequest
		}

		// check if the username is blocked
		if validator.IsUsernameBlocked(req.Username) {
			return fiber.ErrBadRequest
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Errorf("failed to hash password: %v", err)
			return err
		}

		user, err := h.DB.User.
			Create().
			SetUsername(req.Username).
			SetName("我輩は猫である").
			SetPassword(string(hash)).
			Save(context.Background())
		if err != nil {
			log.Errorf("failed to create user: %v", err)
			return err
		}

		// send verification email
		t := jwt.NewWithClaims(jwt.SigningMethodEdDSA, jwt.MapClaims{
			"id":    user.ID,
			"email": req.Email,
			"exp":   time.Now().Add(time.Hour * 24).Unix(),
		})
		token, err := t.SignedString(h.Config.JWTSecretKey)
		if err != nil {
			log.Errorf("failed to sign JWT: %v", err)
			return err
		}

		if err := h.Email.SendEmailVerification(context.Background(), user.Username, req.Email, token); err != nil {
			log.Errorf("failed to send email: %v", err)
		}

		return c.Status(fiber.StatusCreated).JSON(user)
	}
}

func (h *AccountHandler) Login() fiber.Handler {
	type Request struct {
		Token    string `json:"token" validate:"required"`
		Username string `json:"username" validate:"omitempty,username,required_without=Email"`
		Email    string `json:"email" validate:"omitempty,email,required_without=Username"`
		Password string `json:"password" validate:"required,min=6,max=72"`
	}

	return func(c fiber.Ctx) error {
		var req Request
		if err := c.Bind().JSON(&req); err != nil {
			log.Debugf("failed to bind request: %v", err)
			return fiber.ErrBadRequest
		}

		// turnstile verification
		if err := h.Turnstile.Verify(req.Token); err != nil {
			log.Errorf("failed to verify turnstile: %v", err)
			return fiber.ErrBadRequest
		}

		if req.Username == "" && req.Email == "" {
			log.Errorf("username or email is required")
			return fiber.ErrBadRequest
		}

		var query predicate.User
		if req.Username != "" {
			query = user.Username(req.Username)
		} else if req.Email != "" {
			query = user.Email(req.Email)
		}

		user, err := h.DB.User.Query().Where(query).Only(context.Background())
		if err != nil {
			if ent.IsNotFound(err) {
				return fiber.ErrUnauthorized
			} else {
				log.Errorf("failed to query user: %v", err)
				return err
			}
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			log.Errorf("user %s failed to login: %v", user.Username, err)
			return fiber.ErrUnauthorized
		}

		t := jwt.NewWithClaims(jwt.SigningMethodEdDSA, jwt.MapClaims{
			"id":       user.ID,
			"email":    user.Email,
			"name":     user.Name,
			"username": user.Username,
		})
		s, err := t.SignedString(h.Config.JWTSecretKey)
		if err != nil {
			log.Errorf("failed to sign JWT: %v", err)
			return err
		}

		return c.JSON(fiber.Map{"token": s})
	}
}
