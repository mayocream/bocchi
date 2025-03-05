package postgres

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/mayocream/twitter/pkg/config"
	"github.com/mayocream/twitter/pkg/repository"
	"go.uber.org/fx"
)

func NewPostgres(lc fx.Lifecycle, conf *config.Config) (*repository.Queries, error) {
	conn, err := pgx.Connect(context.Background(), conf.PostgresURL)
	if err != nil {
		return nil, err
	}

	lc.Append(fx.Hook{
		OnStop: func(ctx context.Context) error {
			return conn.Close(ctx)
		},
	})

	return repository.New(conn), nil
}
