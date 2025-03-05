package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	PostgresURL  string `mapstructure:"POSTGRES_URL"`
	JWTSecretKey string `mapstructure:"JWT_SECRET_KEY"`
	ServerAddr   string `mapstructure:"SERVER_ADDR"`
}

func NewConfig() (*Config, error) {
	viper.AutomaticEnv()
	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		fmt.Println("No .env file found, reading from environment")
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}
