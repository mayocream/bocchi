# Twitter

Yet another Twitter. Self-hosted, privacy-focused, and open-source federated social network.

## Disclaimer

This project is not affiliated with Twitter, Inc. in any way.

## Features

- [x] Sign up
- [ ] Timeline
- [ ] Tweet
- [ ] Retweet
- [ ] Like
- [ ] Follow
- [ ] Unfollow
- [ ] Notifications
- [ ] Search

## Development

Generate JWT Key Pair:

```bash
openssl genpkey -algorithm ED25519 -out ed25519.pem
openssl pkey -in ed25519.pem -pubout -out ed25519.pub
```

## License

AGPL-3.0
