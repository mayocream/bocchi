package database

import (
	"database/sql"

	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/config"

	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
	_ "github.com/jackc/pgx/v5/stdlib"
	"go.uber.org/fx"
)

func NewClient(lc fx.Lifecycle, config *config.Config) (*ent.Client, error) {
	db, err := sql.Open("pgx", config.DatabaseURL)
	if err != nil {
		return nil, err
	}

	// Create an ent.Driver from `db`.
	drv := entsql.OpenDB(dialect.Postgres, db)
	client := ent.NewClient(ent.Driver(drv))
	lc.Append(
		fx.StopHook(func() error {
			return client.Close()
		}),
	)

	return client, nil
}
