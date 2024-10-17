package cmd

import "github.com/spf13/cobra"

var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "Start the Twitter server",
	RunE: func(cmd *cobra.Command, args []string) error {
		return nil
	},
}
