# Twitter

Yet another Twitter. Self-hosted, privacy-focused, and open-source federated social network.

## Disclaimer

This project is not affiliated with X, Inc. in any way.

## Principles

- **Web-first**: Next.js is used for the frontend and BFF.
- **Privacy-focused**: No tracking, no ads, no data selling.
- **Community-driven**: Open-source, federated, and self-hosted.

## Development

```bash
# setup development environment
docker compose up -d

# install dependencies
pnpm i

# configure environment variables
cp .env.example .env.local

# generate JWT secret
pnpx auth secret
```

## License

AGPL-3.0
