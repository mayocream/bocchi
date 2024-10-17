package app

import (
	"github.com/mayocream/twitter/ent"

	"github.com/gofiber/fiber/v3"
)

type App struct {
	app *fiber.App
	db *ent.Client
}
