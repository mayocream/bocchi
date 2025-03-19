FROM rust:1.85 AS builder
WORKDIR /usr/src/bocchi
RUN apt-get update && apt-get install -y protobuf-compiler
ENV SQLX_OFFLINE=true
COPY . .
RUN cargo install --path .

FROM debian:bookworm-slim
COPY --from=builder /usr/local/cargo/bin/bocchi /usr/local/bin/bocchi
RUN apt-get update && apt-get install -y ca-certificates openssl
CMD ["bocchi", "serve"]
