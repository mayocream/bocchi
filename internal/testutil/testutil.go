package testutil

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/mayocream/twitter/ent/enttest"
	"github.com/mayocream/twitter/internal/config"

	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/assert"
)

func SetupSuite(t *testing.T) {
	t.Helper()

	godotenv.Load(filepath.Join(config.Root, ".env.test"))

	_, err := config.NewConfig()
	assert.Nil(t, err)

	// Setup database
	db := enttest.Open(t, "sqlite3", "file:ent?mode=memory&_fk=1")

	err = db.Schema.Create(context.Background())
	assert.Nil(t, err)

	t.Cleanup(func() {
		db.Close()
	})
}
