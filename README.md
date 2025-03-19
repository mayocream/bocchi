# Bocchi

The social network written in Rust and TypeScript.

## Architecture

The Bocchi project uses Firebase Auth for authentication, because it provides a simple way to authenticate users and manage their sessions. This allows us to focus on the core business logic of the application, rather than worrying about the details of user management.

The project uses a microservices architecture, with each service responsible for a specific part of the application. This allows us to scale each part of the application independently, and to use the best tool for the job in each case.

Next.js is used for the API layer, as it allows us to deloy serverless functions easily, it works closely with the edge network, agressively caches data, and reduces the cost of running the application.

Rust is used for heavy tasks, such as post tagging, ML model inference, and background processing. This allows us to take advantage of Rust's performance and safety guarantees.

## Development

### Prerequisites

- Rust 1.85.0
- Node.js 23
- Pnpm

#### WSL

Please refer to [Running a local Expo development environment in Windows Subsystem for Linux (WSL)](https://github.com/expo/fyi/blob/main/wsl.md) for setting up WSL.
