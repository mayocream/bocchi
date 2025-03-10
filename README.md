# Bocchi

The social network.

## Development

### Prerequisites

- Go 1.24
- Node.js 23
- Pnpm
- Docker
- Make

### Setup

Sqlc, goose and buf are required for the project. Install them with the following commands:

```bash
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
go install github.com/pressly/goose/v3/cmd/goose@latest
go install github.com/bufbuild/buf/cmd/buf@latest
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest
```

### Database

To start the database, run the following command:

```bash
docker-compose up -d
make migrate
```

### Configuration

Create a `.env` file in the root of the project with the following content:

```bash
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/postgres
JWT_SECRET=put_your_secret_here
SERVER_ADDR=:8080
```
