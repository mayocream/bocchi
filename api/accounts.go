package api

import (
	"context"
	"errors"
	"fmt"
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

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrUserNotFound = errors.New("user not found")
)

// AccountHandler handles all account-related operations
type AccountHandler struct {
	db        *ent.Client
	config    *config.Config
	turnstile *turnstile.Turnstile
	email     email.Email
}

// NewAccountHandler creates a new instance of AccountHandler
func NewAccountHandler(
	db *ent.Client,
	config *config.Config,
	turnstile *turnstile.Turnstile,
	email email.Email,
) *AccountHandler {
	return &AccountHandler{
		db:        db,
		config:    config,
		turnstile: turnstile,
		email:     email,
	}
}

// Routes returns all routes handled by AccountHandler
func (h *AccountHandler) Routes() []Route {
	return []Route{
		{
			Method:  fiber.MethodPost,
			Path:    "/accounts",
			Handler: h.Register(),
		},
		{
			Method:  fiber.MethodPost,
			Path:    "/accounts/sessions",
			Handler: h.Session(),
		},
		{
			Method:    fiber.MethodPost,
			Path:      "/accounts/verifications/email",
			Handler:   h.EmailVerificationRequest(),
			Protected: true,
		},
		{
			Method:  fiber.MethodPut,
			Path:    "/accounts/verifications/email",
			Handler: h.EmailVerification(),
		},
		{
			Method:    fiber.MethodPut,
			Path:      "/accounts/profile",
			Handler:   h.EditProfile(),
			Protected: true,
		},
	}
}

// emailVerificationToken creates a JWT token for email verification
func (h *AccountHandler) emailVerificationToken(email string, userID int) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodEdDSA, jwt.MapClaims{
		"id":    userID,
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := t.SignedString(h.config.JWTSecretKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign JWT: %w", err)
	}

	return token, nil
}

// verifyEmailToken validates the email verification token
func (h *AccountHandler) verifyEmailToken(token string) (int, string, error) {
	claims := jwt.MapClaims{}
	t, err := jwt.ParseWithClaims(token, claims, func(t *jwt.Token) (interface{}, error) {
		return h.config.JWTSecretPub, nil
	})
	if err != nil {
		return 0, "", fmt.Errorf("failed to parse JWT: %w", err)
	}

	if !t.Valid {
		return 0, "", ErrInvalidToken
	}

	id, ok := claims["id"].(float64)
	if !ok {
		return 0, "", fmt.Errorf("invalid id claim")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return 0, "", fmt.Errorf("invalid email claim")
	}

	exp, ok := claims["exp"].(float64)
	if !ok || time.Unix(int64(exp), 0).Before(time.Now()) {
		return 0, "", fmt.Errorf("token expired")
	}

	return int(id), email, nil
}

// EmailVerificationRequest handles the request for email verification
func (h *AccountHandler) EmailVerificationRequest() fiber.Handler {
	type Request struct {
		Email string `json:"email" validate:"required,email"`
	}

	return func(c fiber.Ctx) error {
		var req Request
		if err := c.Bind().Body(&req); err != nil {
			log.Errorf("failed to bind request: %v", err)
			return fiber.ErrBadRequest
		}

		user, ok := c.Locals("user").(*ent.User)
		if !ok {
			return fiber.ErrUnauthorized
		}

		token, err := h.emailVerificationToken(req.Email, user.ID)
		if err != nil {
			log.Errorf("failed to create verification token: %v", err)
			return fiber.ErrInternalServerError
		}

		if err := h.email.SendEmailVerification(context.Background(), user.Username, req.Email, token); err != nil {
			log.Errorf("failed to send verification email: %v", err)
			return fiber.ErrInternalServerError
		}

		return c.JSON(fiber.Map{"message": "Verification email sent"})
	}
}

// EmailVerification handles email verification
func (h *AccountHandler) EmailVerification() fiber.Handler {
	type Request struct {
		Token string `json:"token" validate:"required"`
	}

	return func(c fiber.Ctx) error {
		var req Request
		if err := c.Bind().Body(&req); err != nil {
			return fiber.ErrBadRequest
		}

		userID, email, err := h.verifyEmailToken(req.Token)
		if err != nil {
			log.Errorf("failed to verify token: %v", err)
			return fiber.ErrBadRequest
		}

		user, err := h.db.User.Get(context.Background(), userID)
		if err != nil {
			if ent.IsNotFound(err) {
				return fiber.ErrNotFound
			}
			return fiber.ErrInternalServerError
		}

		if err := user.Update().SetEmail(email).Exec(context.Background()); err != nil {
			log.Errorf("failed to update user email: %v", err)
			return fiber.ErrInternalServerError
		}

		return c.JSON(fiber.Map{"message": "Email verified successfully"})
	}
}

// Register handles user registration
func (h *AccountHandler) Register() fiber.Handler {
	type Request struct {
		Token    string `json:"token" validate:"required"`
		Email    string `json:"email" validate:"required,email"`
		Username string `json:"username" validate:"required,username,min=3,max=30"`
		Password string `json:"password" validate:"required,max=72"`
	}

	return func(c fiber.Ctx) error {
		var req Request
		if err := c.Bind().Body(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		}

		if err := h.turnstile.Verify(req.Token); err != nil {
			log.Errorf("turnstile verification failed: %v", err)
			return fiber.NewError(fiber.StatusBadRequest, "Invalid token")
		}

		if validator.IsUsernameBlocked(req.Username) {
			return fiber.NewError(fiber.StatusBadRequest, "Username not allowed")
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Errorf("password hashing failed: %v", err)
			return fiber.ErrInternalServerError
		}

		user, err := h.db.User.
			Create().
			SetUsername(req.Username).
			SetName(req.Username). // Default name is username
			SetPassword(string(hash)).
			Save(context.Background())
		if err != nil {
			log.Errorf("user creation failed: %v", err)
			return fiber.ErrInternalServerError
		}

		token, err := h.emailVerificationToken(req.Email, user.ID)
		if err != nil {
			log.Errorf("email verification token creation failed: %v", err)
			return fiber.ErrInternalServerError
		}

		if err := h.email.SendEmailVerification(context.Background(), user.Username, req.Email, token); err != nil {
			log.Errorf("verification email sending failed: %v", err)
			// Don't return error here as user is already created
		}

		return c.Status(fiber.StatusCreated).JSON(user)
	}
}

// Session handles user login
func (h *AccountHandler) Session() fiber.Handler {
	type Request struct {
		Token    string `json:"token" validate:"required"`
		Username string `json:"username" validate:"omitempty,username,required_without=Email"`
		Email    string `json:"email" validate:"omitempty,email,required_without=Username"`
		Password string `json:"password" validate:"required,min=6,max=72"`
	}

	return func(c fiber.Ctx) error {
		var req Request
		if err := c.Bind().Body(&req); err != nil {
			return fiber.ErrBadRequest
		}

		if err := h.turnstile.Verify(req.Token); err != nil {
			log.Errorf("turnstile verification failed: %v", err)
			return fiber.ErrBadRequest
		}

		var query predicate.User
		if req.Username != "" {
			query = user.Username(req.Username)
		} else {
			query = user.Email(req.Email)
		}

		user, err := h.db.User.Query().Where(query).Only(context.Background())
		if err != nil {
			if ent.IsNotFound(err) {
				return fiber.ErrUnauthorized
			}
			return fiber.ErrInternalServerError
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
			return fiber.ErrUnauthorized
		}

		token := jwt.NewWithClaims(jwt.SigningMethodEdDSA, jwt.MapClaims{
			"id":       user.ID,
			"email":    user.Email,
			"name":     user.Name,
			"username": user.Username,
			"exp":      time.Now().Add(time.Hour * 24 * 30).Unix(), // 30 days
		})

		signedToken, err := token.SignedString(h.config.JWTSecretKey)
		if err != nil {
			log.Errorf("JWT signing failed: %v", err)
			return fiber.ErrInternalServerError
		}

		return c.JSON(fiber.Map{"token": signedToken})
	}
}

// EditProfile handles profile updates
func (h *AccountHandler) EditProfile() fiber.Handler {
	type Request struct {
		Name     string `json:"name" validate:"min=3,max=30"`
		Avatar   string `json:"avatar" validate:"url"`
		Bio      string `json:"bio" validate:"min=3,max=160"`
		Website  string `json:"website" validate:"url"`
		Location string `json:"location" validate:"min=3,max=30"`
		Banner   string `json:"banner" validate:"url"`
	}

	return func(c fiber.Ctx) error {
		var req Request
		if err := c.Bind().Body(&req); err != nil {
			return fiber.ErrBadRequest
		}

		user, ok := c.Locals("user").(*ent.User)
		if !ok {
			return fiber.ErrUnauthorized
		}

		updatedUser, err := user.Update().
			SetName(req.Name).
			SetAvatar(req.Avatar).
			SetMetadata(map[string]interface{}{
				"bio":      req.Bio,
				"website":  req.Website,
				"location": req.Location,
				"banner":   req.Banner,
			}).Save(context.Background())
		if err != nil {
			log.Errorf("failed to update user profile: %v", err)
			return fiber.ErrInternalServerError
		}

		return c.JSON(updatedUser)
	}
}
