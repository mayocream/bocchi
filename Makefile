protobuf:
	protoc -I=./proto bocchi.proto \
		--js_out=import_style=commonjs:./lib \
		--grpc-web_out=import_style=typescript,mode=grpcwebtext:./lib
