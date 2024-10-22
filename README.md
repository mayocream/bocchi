# Twitter

Twitter, without restrictions. 昔のツイーターが欲しいから作ってみた

Twitter-like Social Network Service, implemented in Go and React.
Compatible with Mastodon API.

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
