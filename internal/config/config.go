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
	ServerPort         int
	DatabaseURL        string
	JWTSecretKey       ed25519.PrivateKey
	JWTSecretPub       ed25519.PublicKey
	BaseURL            string
	APIBaseURL         string
	SiteName           string
	TurnstileSecretKey string
	MailgunAPIKey      string
	EmailDomain        string
}

func NewConfig() (*Config, error) {
	godotenv.Overload(".env", ".env.local")
	viper.AutomaticEnv()

	// the JWT secret key is stored in a PEM-encoded environment variable
	// which can be mounted as a Kubernetes secret
	block, _ := pem.Decode([]byte(viper.GetString("JWT_SECRET_KEY")))
	jwtSecretKey, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return nil, errors.Wrap(err, "failed to parse JWT secret key")
	}

	return &Config{
		ServerPort:         viper.GetInt("SERVER_PORT"),
		DatabaseURL:        viper.GetString("DATABASE_URL"),
		BaseURL:            viper.GetString("NEXT_PUBLIC_BASE_URL"),
		APIBaseURL:         viper.GetString("NEXT_PUBLIC_API_BASE_URL"),
		SiteName:           viper.GetString("SITE_NAME"),
		MailgunAPIKey:      viper.GetString("MAILGUN_API_KEY"),
		EmailDomain:        viper.GetString("EMAIL_DOMAIN"),
		TurnstileSecretKey: viper.GetString("TURNSTILE_SECRET_KEY"),
		JWTSecretKey:       jwtSecretKey.(ed25519.PrivateKey),
		JWTSecretPub:       jwtSecretKey.(ed25519.PrivateKey).Public().(ed25519.PublicKey),
	}, nil
}
