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

grpc-web:
	protoc -I=./proto bocchi.proto \
	--js_out=import_style=commonjs:./lib \
	--grpc-web_out=import_style=typescript,mode=grpcwebtext:./lib
