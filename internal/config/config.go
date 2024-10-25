package config

import (
	"crypto/ed25519"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/joho/godotenv"
	"github.com/pkg/errors"
	"github.com/spf13/viper"
)

// Root path determination
var (
	_, b, _, _ = runtime.Caller(0)
	Root       = filepath.Join(filepath.Dir(b), "../..")
)

// Config holds all configuration parameters
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

// loadEnvFiles loads the appropriate environment files based on the runtime context
func loadEnvFiles() error {
	// Load base .env file
	if err := godotenv.Load(filepath.Join(Root, ".env")); err != nil {
		return fmt.Errorf("error loading .env file: %w", err)
	}

	// Load environment-specific .env file
	envFile := ".env.local"
	if testing.Testing() {
		envFile = ".env.test"
	}

	// Overload environment-specific .env file
	godotenv.Overload(filepath.Join(Root, envFile))

	return nil
}

// parseJWTKey parses the JWT secret key from PEM format
func parseJWTKey(pemKey string) (ed25519.PrivateKey, ed25519.PublicKey, error) {
	if pemKey == "" {
		return nil, nil, errors.New("JWT secret key is required")
	}

	block, _ := pem.Decode([]byte(pemKey))
	if block == nil {
		return nil, nil, errors.New("failed to decode PEM block containing JWT secret key")
	}

	privateKey, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return nil, nil, errors.Wrap(err, "failed to parse JWT secret key")
	}

	edPrivateKey, ok := privateKey.(ed25519.PrivateKey)
	if !ok {
		return nil, nil, errors.New("JWT secret key is not an Ed25519 private key")
	}

	return edPrivateKey, edPrivateKey.Public().(ed25519.PublicKey), nil
}

// validateConfig performs basic validation of required configuration values
func validateConfig(cfg *Config) error {
	if cfg.DatabaseURL == "" {
		return errors.New("database URL is required")
	}
	if cfg.BaseURL == "" {
		return errors.New("base URL is required")
	}
	if cfg.APIBaseURL == "" {
		return errors.New("API base URL is required")
	}
	return nil
}

// NewConfig creates and returns a new Config instance
func NewConfig() (*Config, error) {
	// Load environment files
	if err := loadEnvFiles(); err != nil {
		return nil, err
	}

	// Configure viper
	viper.AutomaticEnv()

	// Parse JWT keys
	privateKey, publicKey, err := parseJWTKey(viper.GetString("JWT_SECRET_KEY"))
	if err != nil {
		return nil, err
	}

	// Create config instance
	cfg := &Config{
		ServerPort:         viper.GetInt("SERVER_PORT"),
		DatabaseURL:        viper.GetString("DATABASE_URL"),
		BaseURL:            viper.GetString("NEXT_PUBLIC_BASE_URL"),
		APIBaseURL:         viper.GetString("NEXT_PUBLIC_API_BASE_URL"),
		SiteName:           viper.GetString("SITE_NAME"),
		MailgunAPIKey:      viper.GetString("MAILGUN_API_KEY"),
		EmailDomain:        viper.GetString("EMAIL_DOMAIN"),
		TurnstileSecretKey: viper.GetString("TURNSTILE_SECRET_KEY"),
		JWTSecretKey:       privateKey,
		JWTSecretPub:       publicKey,
	}

	// Validate config
	if err := validateConfig(cfg); err != nil {
		return nil, fmt.Errorf("invalid configuration: %w", err)
	}

	return cfg, nil
}
