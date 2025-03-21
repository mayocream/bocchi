generate-entities:
	sea-orm-cli generate entity -o src/entities --with-prelude=none

reset:
	sea-orm-cli migrate -d migrations reset
	sea-orm-cli migrate -d migrations up

generate: generate-entities grpc-web

grpc-web:
	protoc -I=./proto bocchi.proto \
		--js_out=import_style=commonjs:./packages/expo/lib \
		--grpc-web_out=import_style=typescript,mode=grpcweb:./packages/expo/lib
