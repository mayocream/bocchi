package api

import (
	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/validator"

	"github.com/gofiber/fiber/v3"
)

func NewApi(db *ent.Client, validator *validator.Validator) *fiber.App {
	return fiber.New(fiber.Config{
		StructValidator: validator,
	})
}

func RegisterRoutes(app *fiber.App) {
	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
}
