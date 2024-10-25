package helper

import (
	"context"
	"testing"

	"github.com/mayocream/twitter/ent/enttest"
	"github.com/mayocream/twitter/internal/config"

	"github.com/stretchr/testify/assert"
	_ "github.com/mattn/go-sqlite3"
)

func SetupSuite(t *testing.T) {
	t.Helper()

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
