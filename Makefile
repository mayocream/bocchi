generate:
	sea generate entity -o entity/src -l

migrate:
	sea migrate up

reset:
	sea migrate reset

regenerate: reset migrate generate

ruin: down up

down:
	docker compose down --remove-orphans

up:
	docker compose up -d
