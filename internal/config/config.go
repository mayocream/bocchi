package config

import (
	"crypto/ed25519"
	"crypto/x509"
	"encoding/pem"

	"github.com/joho/godotenv"
	"github.com/pkg/errors"
	"github.com/spf13/viper"
)

type Config struct {
	DatabaseURL  string
	JWTSecretKey ed25519.PrivateKey
	BaseURL      string
	APIBaseURL   string
	SiteName     string
}

func NewConfig() (*Config, error) {
	godotenv.Overload(".env", ".env.local")
	viper.AutomaticEnv()

	block, _ := pem.Decode([]byte(viper.GetString("JWT_SECRET_KEY")))
	jwtSecretKey, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return nil, errors.Wrap(err, "failed to parse JWT secret key")
	}

	return &Config{
		DatabaseURL:  viper.GetString("DATABASE_URL"),
		BaseURL:      viper.GetString("NEXT_PUBLIC_BASE_URL"),
		APIBaseURL:   viper.GetString("NEXT_PUBLIC_API_BASE_URL"),
		SiteName:     viper.GetString("SITE_NAME"),
		JWTSecretKey: jwtSecretKey.(ed25519.PrivateKey),
	}, nil
}
