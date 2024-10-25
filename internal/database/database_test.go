package database

import (
	"testing"

	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/config"

	"go.uber.org/fx"
	"go.uber.org/fx/fxtest"
)

// TestNewClient tests the successful creation of a database client
func TestNewClient(t *testing.T) {
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
