# Bocchi

The social network wriiten in Rust and React Native.

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
