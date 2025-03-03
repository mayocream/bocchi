# Revival of the Twitter

## Development

### Prerequisites

- Go 1.24
- Node.js 23
- Pnpm
- Docker
- Make

### Setup

Sqlc and goose are required for the project. Install them with the following commands:

```bash
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
go install github.com/pressly/goose/v3/cmd/goose@latest
```

### Database

To start the database, run the following command:

```bash
docker-compose up -d
make migrate
```
