# Bocchi

The social network wriiten in Rust and React Native.

![Bocchi](./assets/images/bocchi.png)

## Development

### Prerequisites

- Rust 1.85
- Node.js 23
- Pnpm
- Docker
- Make

#### WSL

Please refer to [Running a local Expo development environment in Windows Subsystem for Linux (WSL)](https://github.com/expo/fyi/blob/main/wsl.md) for setting up WSL.

### Database

To start the database, run the following command:

```bash
docker-compose up -d
```

### Configuration

Create a `.env` file in the root of the project with the following content:

```bash
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/postgres
JWT_SECRET=put_your_secret_here
SERVER_ADDR=:8080
```
