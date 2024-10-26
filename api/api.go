package api

import (
	"context"
	"errors"
	"fmt"

	"github.com/mayocream/twitter/internal/config"
	"github.com/mayocream/twitter/internal/validator"

	"github.com/gofiber/fiber/v3"
	"go.uber.org/fx"
)

func errorHandler(c fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	var e *fiber.Error
	if errors.As(err, &e) {
		code = e.Code
	}
	return c.Status(code).AutoFormat(err.Error())
}

func NewApi(
	lc fx.Lifecycle,
	config *config.Config,
	validator *validator.Validator,
	handlers []Handler,
	middlewares []fiber.Handler,
) *fiber.App {
	app := fiber.New(fiber.Config{
		StructValidator: validator,
		ErrorHandler:    errorHandler,
	})

	// Register middleware
	for _, middleware := range middlewares {
		app.Use(middleware)
	}

	// Register unauthenticated routes
	for _, handler := range handlers {
		for _, route := range handler.Routes() {
			if !route.Protected {
				app.Add([]string{route.Method}, route.Path, route.Handler)
			}
		}
	}

	// Register authentication middleware
	app.Use(Authentication(config))

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
