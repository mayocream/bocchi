# Bocchi

The social network written in Rust and TypeScript.

## Development

### Prerequisites

- Rust 1.85.0
- Node.js 23
- Pnpm

#### WSL

Please refer to [Running a local Expo development environment in Windows Subsystem for Linux (WSL)](https://github.com/expo/fyi/blob/main/wsl.md) for setting up WSL.

## Deployment

### PostgreSQL

```bash
cargo install sea-orm-cli
sea-orm-cli migrate -d migrations up
```
