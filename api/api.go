package api

import (
	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/config"
	"github.com/mayocream/twitter/internal/validator"

	"github.com/gofiber/fiber/v3"
)

type Handler struct {
	DB     *ent.Client
	Config *config.Config
}

func NewApi(db *ent.Client, validator *validator.Validator) *fiber.App {
	return fiber.New(fiber.Config{
		StructValidator: validator,
	})
}

func RegisterRoutes(app *fiber.App, db *ent.Client, config *config.Config) {
	h := &Handler{
		DB:     db,
		Config: config,
	}
	app.Post("/email/verification", h.EmailVerificationRequest)
	app.Post("/auth/register", h.UserRegister)
	app.Post("/auth/login", h.UserLogin)
}
