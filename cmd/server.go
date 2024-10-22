package cmd

import (
	"context"

	"github.com/mayocream/twitter/api"
	"github.com/mayocream/twitter/internal/config"
	"github.com/mayocream/twitter/internal/database"
	"github.com/mayocream/twitter/internal/validator"

	"github.com/gofiber/fiber/v3"
	"github.com/spf13/cobra"
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
				api.NewApi,
			),
			fx.Invoke(api.RegisterRoutes),
			fx.Invoke(
				func(lc fx.Lifecycle, app *fiber.App) {
					lc.Append(fx.Hook{
						OnStart: func(context.Context) error {
							go app.Listen(port)
							return nil
						},
						OnStop: func(context.Context) error {
							return app.Shutdown()
						},
					})
				}),
		).Run()
	},
}

func init() {
	serverCmd.Flags().StringVarP(&port, "port", "p", ":8080", "address to listen on")
}
