package cmd

import "github.com/spf13/cobra"

var rootCmd = &cobra.Command{
	Use:   "twitter",
	Short: "Twitter is a CLI tool for Twitter",
}

func Execute() {
	rootCmd.Execute()
}
