package cmd

import (
	"github.com/mayocream/twitter/api"
	"github.com/mayocream/twitter/internal/config"
	"github.com/mayocream/twitter/internal/database"
	"github.com/mayocream/twitter/internal/turnstile"
	"github.com/mayocream/twitter/internal/validator"

	"github.com/gofiber/fiber/v3"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.uber.org/fx"
)

var port string
var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "Start the Twitter server",
	Run: func(cmd *cobra.Command, args []string) {
		fx.New(
			fx.Provide(
				config.NewConfig,
				database.NewClient,
				validator.NewValidator,
				turnstile.NewTurnstile,
			),
			api.Middlewares,
			api.Routes,
			fx.Provide(
				fx.Annotate(
					api.NewApi,
					fx.ParamTags("", "", "", `group:"routes"`, `group:"middlewares"`),
				),
			),
			fx.Invoke(func(app *fiber.App) {}),
		).Run()
	},
}

func init() {
	serverCmd.Flags().IntP("port", "p", 8080, "Port to run the server on")
	viper.BindPFlag("SERVER_PORT", serverCmd.Flags().Lookup("port"))
}
