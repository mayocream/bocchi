migration:
	goose create -dir migrations $(name) sql

migrate:
	goose -dir migrations postgres "user=postgres dbname=postgres sslmode=disable" up
