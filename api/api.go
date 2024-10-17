package api

import (
	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app fiber.App) {
	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
}
