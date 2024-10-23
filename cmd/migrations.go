package cmd

import (
	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/config"
	"github.com/mayocream/twitter/internal/database"

	"go.uber.org/fx"
	"github.com/spf13/cobra"
)

var migrationsCmd = &cobra.Command{
	Use:   "migrations",
	Short: "Run database migrations",
}

var migrationsApplyCmd = &cobra.Command{
	Use:   "apply",
	Short: "Apply database migrations",
	RunE: func(cmd *cobra.Command, args []string) error {
		app := fx.New(
			fx.Provide(
				config.NewConfig,
				database.NewClient,
			),
			fx.Invoke(func(database *ent.Client) error {
				return database.Schema.Create(cmd.Context())
			}),
		)

		if err := app.Start(cmd.Context()); err != nil {
			return err
		}

		return app.Stop(cmd.Context())
	},
}

func init() {
	migrationsCmd.AddCommand(migrationsApplyCmd)
}
