package cmd

import (
	"net/http"

	"github.com/mayocream/bocchi/pkg/config"
	"github.com/mayocream/bocchi/pkg/connectrpc/bocchi/v1alpha/bocchiconnect"
	"github.com/mayocream/bocchi/pkg/handler"
	"github.com/mayocream/bocchi/pkg/postgres"
	"github.com/spf13/cobra"
	"go.uber.org/fx"
)

var serverCmd = &cobra.Command{
	Use: "server",
	Run: func(cmd *cobra.Command, args []string) {
		fx.New(
			fx.Provide(
				config.NewConfig,
				postgres.NewPostgres,
				handler.NewAccountHandler,
			),
			fx.Invoke(
				serve,
			),
		).Run()
	},
}

func serve(
	config *config.Config,
	accountHandler *handler.AccountHandler,
) error {
	mux := http.NewServeMux()
	path, handler := bocchiconnect.NewAccountServiceHandler(accountHandler)
	mux.Handle(path, handler)
	if err := http.ListenAndServe(config.ServerAddr, mux); err != nil {
		return err
	}

	return nil
}
