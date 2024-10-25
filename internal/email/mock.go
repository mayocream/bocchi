package email

import (
	"context"

	"github.com/stretchr/testify/mock"
)

type Mock struct {
	mock.Mock
}

func NewMock() *Mock {
	return &Mock{}
}

func (m *Mock) SendEmailVerification(ctx context.Context, name, email, token string) error {
	args := m.Called(name, email, token)
	return args.Error(0)
}
