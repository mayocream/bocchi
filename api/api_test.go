package api

import (
	"context"
	"testing"

	"github.com/mayocream/twitter/internal/config"
	"github.com/mayocream/twitter/internal/database"
	"github.com/mayocream/twitter/internal/email"
	"github.com/mayocream/twitter/internal/turnstile"
	"github.com/mayocream/twitter/internal/validator"

	"github.com/gofiber/fiber/v3"
	"go.uber.org/fx"
)

func TestNewApi(t *testing.T) {
	app := fx.New(
		fx.Provide(
			config.NewConfig,
			database.NewClient,
			validator.NewValidator,
			turnstile.NewTurnstile,
			email.NewMailgun,
		),
		Middlewares,
		Routes,
		fx.Provide(
			fx.Annotate(
				NewApi,
				fx.ParamTags("", "", "", `group:"routes"`, `group:"middlewares"`),
			),
		),
		fx.Invoke(func(app *fiber.App) {}),
	)

	if err := app.Start(context.Background()); err != nil {
		t.Fatal(err)
	}

	defer app.Stop(context.Background())
}
