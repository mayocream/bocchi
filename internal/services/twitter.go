package services

import (
	"context"

	"connectrpc.com/connect"
	twitterv1 "github.com/mayocream/twitter/gen/twitter/v1"
)

type TwitterService struct{}

func (s *TwitterService) Ping(
	ctx context.Context,
	req *connect.Request[twitterv1.PingRequest],
) (*connect.Response[twitterv1.PingResponse], error) {
	res := connect.NewResponse(&twitterv1.PingResponse{})
	return res, nil
}
