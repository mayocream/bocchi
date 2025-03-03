migration:
	goose create -dir migrations $(name) sql

migrate:
	goose -dir migrations postgres "postgres://postgres:postgres@localhost:5432/postgres" up
