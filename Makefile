generate-entities:
	sea-orm-cli generate entity -o src/entities

reset:
	sea-orm-cli migrate -d migrations reset
	sea-orm-cli migrate -d migrations up

generate: generate-entities
