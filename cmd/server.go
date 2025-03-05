package cmd

import (
	"net/http"

	"github.com/mayocream/twitter/pkg/config"
	"github.com/mayocream/twitter/pkg/connectrpc/twitter/v1alpha/twitterconnect"
	"github.com/mayocream/twitter/pkg/handler"
	"github.com/mayocream/twitter/pkg/postgres"
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
	path, handler := twitterconnect.NewAccountServiceHandler(accountHandler)
	mux.Handle(path, handler)
	if err := http.ListenAndServe(config.ServerAddr, mux); err != nil {
		return err
	}

	return nil
}
