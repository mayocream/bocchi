package api

import (
	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/ent/user"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Token    string `json:"token" validate:"required"`
	Email    string `json:"email" validate:"email"`
	Name     string `json:"name" validate:"required,min=3,max=50"`
	Username string `json:"username" validate:"required,min=3,max=30,regexp=^[a-zA-Z0-9_]+$"`
	Password string `json:"password" validate:"required,min=6,max=72"`
}

// UserRegister registers a new user.
func (h *Handler) UserRegister(c fiber.Ctx) error {
	var req RegisterRequest
	if err := c.Bind().JSON(&req); err != nil {
		return err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Errorf("failed to hash password: %v", err)
		return err
	}

	user, err := h.DB.User.
		Create().
		SetName(req.Name).
		SetUsername(req.Username).
		SetPassword(string(hash)).
		Save(c.Context())
	if err != nil {
		log.Errorf("failed to create user: %v", err)
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(user)
}

type LoginRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required,min=6,max=72"`
}

func (h *Handler) UserLogin(c fiber.Ctx) error {
	var req LoginRequest
	if err := c.Bind().JSON(&req); err != nil {
		return fiber.ErrBadRequest
	}

	user, err := h.DB.User.Query().Where(user.Username(req.Username)).Only(c.Context())
	if err != nil {
		if ent.IsNotFound(err) {
			return fiber.ErrUnauthorized
		} else {
			log.Errorf("failed to query user: %v", err)
			return err
		}
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		log.Infof("user %s failed to login: %v", user.Username, err)
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
