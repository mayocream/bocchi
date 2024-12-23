package cmd

import (
	"net/http"

	"github.com/spf13/cobra"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"github.com/mayocream/twitter2/gen/twitter/v1/twitterv1connect"
	"github.com/mayocream/twitter2/internal/services"
)

var serverCmd = &cobra.Command{
	Use:  "server",
	Short: "Start the Twitter server",
	Run: func(cmd *cobra.Command, args []string) {
		service := &services.TwitterService{}
		mux := http.NewServeMux()
		path, handler := twitterv1connect.NewTwitterServiceHandler(service)
		mux.Handle(path, handler)
		http.ListenAndServe(":8080", h2c.NewHandler(mux, &http2.Server{}))
	},
}
