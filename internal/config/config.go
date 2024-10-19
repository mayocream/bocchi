package config

import "github.com/spf13/viper"

type Config struct {
	DatabaseURL string
	ServerPort  int
}

func NewConfig() *Config {
	return &Config{
		DatabaseURL: viper.GetString("DATABASE_URL"),
		ServerPort:  viper.GetInt("SERVER_PORT"),
	}
}
