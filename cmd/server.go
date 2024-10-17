package cmd

import (
	"github.com/gofiber/fiber/v3"
	"github.com/spf13/cobra"
)

var port string
var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "Start the Twitter server",
	RunE: func(cmd *cobra.Command, args []string) error {
		app := fiber.New()
		return app.Listen(port)
	},
}

func init() {
	serverCmd.Flags().StringVarP(&port, "port", "p", ":8080", "address to listen on")
}
