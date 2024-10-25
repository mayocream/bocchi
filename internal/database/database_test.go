package database

import (
	"path/filepath"
	"testing"

	"github.com/joho/godotenv"
	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/config"

	"go.uber.org/fx"
	"go.uber.org/fx/fxtest"
)

// TestNewClient tests the successful creation of a database client
func TestNewClient(t *testing.T) {
	godotenv.Load(filepath.Join(config.Root, ".env.test"))
	app := fxtest.New(
		t,
		fx.Provide(
			config.NewConfig,
			NewClient,
		),
		fx.Invoke(func(client *ent.Client) {
			if client == nil {
				t.Fatal("client is nil")
			}
		}),
	)

	app.RequireStart().RequireStop()
}
