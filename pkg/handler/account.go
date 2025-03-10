package handler

import (
	"context"

	"connectrpc.com/connect"
	bocchi "github.com/mayocream/bocchi/pkg/connectrpc/bocchi/v1alpha"
	"github.com/mayocream/bocchi/pkg/connectrpc/bocchi/v1alpha/bocchiconnect"
	"github.com/mayocream/bocchi/pkg/repository"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

var _ bocchiconnect.AccountServiceHandler = (*AccountHandler)(nil)

type AccountHandler struct {
	repository *repository.Queries
}

func NewAccountHandler(repository *repository.Queries) *AccountHandler {
	return &AccountHandler{repository: repository}
}

// CreateAccount implements bocchiconnect.AccountServiceHandler.
func (h *AccountHandler) CreateAccount(ctx context.Context, req *connect.Request[bocchi.CreateAccountRequest]) (*connect.Response[bocchi.Account], error) {
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

	return &connect.Response[bocchi.Account]{
		Msg: &bocchi.Account{
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

// GetAccount implements bocchiconnect.AccountServiceHandler.
func (h *AccountHandler) GetAccount(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[bocchi.Account], error) {
	panic("unimplemented")
}

// UpdateAccount implements bocchiconnect.AccountServiceHandler.
func (h *AccountHandler) UpdateAccount(context.Context, *connect.Request[bocchi.UpdateAccountRequest]) (*connect.Response[bocchi.Account], error) {
	panic("unimplemented")
}
