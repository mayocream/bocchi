package handler

import (
	"context"

	"connectrpc.com/connect"
	twitter "github.com/mayocream/twitter/pkg/connectrpc/twitter/v1alpha"
	"github.com/mayocream/twitter/pkg/connectrpc/twitter/v1alpha/twitterconnect"
	"github.com/mayocream/twitter/pkg/repository"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

var _ twitterconnect.AccountServiceHandler = (*AccountHandler)(nil)

type AccountHandler struct {
	repository *repository.Queries
}

func NewAccountHandler(repository *repository.Queries) *AccountHandler {
	return &AccountHandler{repository: repository}
}

// CreateAccount implements twitterconnect.AccountServiceHandler.
func (h *AccountHandler) CreateAccount(ctx context.Context, req *connect.Request[twitter.CreateAccountRequest]) (*connect.Response[twitter.Account], error) {
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(req.Msg.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	account, err := h.repository.CreateUser(ctx, repository.CreateUserParams{
		Username:     req.Msg.Username,
		PasswordHash: string(passwordHash),
	})
	if err != nil {
		return nil, err
	}

	return &connect.Response[twitter.Account]{
		Msg: &twitter.Account{
			Id:            account.ID,
			Username:      account.Username,
			Name:          account.Name.String,
			Bio:           account.Bio.String,
			AvatarUrl:     account.AvatarUrl.String,
			BannerUrl:     account.BannerUrl.String,
			EmailVerified: account.EmailVerified.Bool,
			CreatedAt:     timestamppb.New(account.CreatedAt.Time),
			UpdatedAt:     timestamppb.New(account.UpdatedAt.Time),
		},
	}, nil
}

// GetAccount implements twitterconnect.AccountServiceHandler.
func (h *AccountHandler) GetAccount(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[twitter.Account], error) {
	panic("unimplemented")
}

// UpdateAccount implements twitterconnect.AccountServiceHandler.
func (h *AccountHandler) UpdateAccount(context.Context, *connect.Request[twitter.UpdateAccountRequest]) (*connect.Response[twitter.Account], error) {
	panic("unimplemented")
}
