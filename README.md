# Bocchi

The social network written in Rust and React Native.

## Development

### Prerequisites

- Rust 1.85
- Node.js 23
- Pnpm
- Docker
- Make
- Protoc

#### WSL

Please refer to [Running a local Expo development environment in Windows Subsystem for Linux (WSL)](https://github.com/expo/fyi/blob/main/wsl.md) for setting up WSL.

### Database

First, install `sea-orm-cli`:

```bash
cargo install sea-orm-cli
```

Then, run the following command to create the database:

```bash
docker-compose up -d
```

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Finally, run the following command to create the tables:

```bash
make migrate
```

### Grpc Server

To start the gRPC server, run the following command:

```bash
cargo run server
```

#### Connectivity

To check the connectivity of the gRPC server, run the following command:

```bash
grpcurl -import-path ./proto -proto bocchi.proto -plaintext localhost:3000 bocchi.Health/Check
```
