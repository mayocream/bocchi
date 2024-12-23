package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var RootCmd = &cobra.Command{
	Use:   "twitter",
	Short: "Twitter CLI",
}

func init() {
	RootCmd.AddCommand(serverCmd)
}

func Execute() {
	err := RootCmd.Execute()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
