package api

import (
	"context"
	"fmt"

	"github.com/mayocream/twitter/internal/config"
	"github.com/mayocream/twitter/internal/validator"

	"go.uber.org/fx"
	"github.com/gofiber/fiber/v3"
)

func NewApi(
	lc fx.Lifecycle,
	config *config.Config,
	validator *validator.Validator,
	handlers []Handler,
	middlewares []fiber.Handler,
) *fiber.App {
	app := fiber.New(fiber.Config{
		StructValidator: validator,
	})

	// Register unauthenticated routes
	for _, handler := range handlers {
		for _, route := range handler.Routes() {
			if !route.Protected {
				app.Add([]string{route.Method}, route.Path, route.Handler)
			}
		}
	}

	// Register middleware
	for _, middleware := range middlewares {
		app.Use(middleware)
	}

	// Register authenticated routes
	for _, handler := range handlers {
		for _, route := range handler.Routes() {
			if route.Protected {
				app.Add([]string{route.Method}, route.Path, route.Handler)
			}
		}
	}

	lc.Append(fx.Hook{
		OnStart: func(context.Context) error {
			go app.Listen(fmt.Sprintf(":%d", config.ServerPort))
			return nil
		},
		OnStop: func(context.Context) error {
			return app.Shutdown()
		},
	})

	return app
}
