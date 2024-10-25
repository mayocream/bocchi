package api

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/config"
	"github.com/mayocream/twitter/internal/email"
	"github.com/mayocream/twitter/internal/turnstile"
	"github.com/mayocream/twitter/internal/validator"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"golang.org/x/crypto/bcrypt"
)

type AccountHandlerTestSuite struct {
	suite.Suite
	app       *fiber.App
	handler   *AccountHandler
	db        *ent.Client
	turnstile *turnstile.Turnstile
	email     email.Email
}

func (s *AccountHandlerTestSuite) SetupTest() {
	var err error
	s.app = fiber.New(fiber.Config{
		StructValidator: validator.NewValidator(),
	})

	// Initialize test database (using SQLite for tests)
	s.db, err = ent.Open("sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	s.Require().NoError(err)

	// Run the auto migration tool
	err = s.db.Schema.Create(context.Background())
	s.Require().NoError(err)

	cfg, err := config.NewConfig()
	s.Require().NoError(err)

	s.turnstile = turnstile.NewTurnstile(cfg)
	email := email.NewMock()
	s.email = email

	email.On("SendEmailVerification", mock.Anything, mock.Anything, mock.Anything, mock.Anything).Return(nil)

	s.handler = NewAccountHandler(s.db, cfg, s.turnstile, s.email)

	// Register routes
	for _, route := range s.handler.Routes() {
		s.app.Add([]string{route.Method}, route.Path, route.Handler)
	}
}

func (s *AccountHandlerTestSuite) TearDownTest() {
	s.db.Close()
}

func (s *AccountHandlerTestSuite) TestRegister_Success() {
	// Arrange
	reqBody := map[string]interface{}{
		"token":    "valid-token",
		"email":    "test@example.com",
		"username": "testuser",
		"password": "password123",
	}

	// Act
	resp, err := s.app.Test(makeTestRequest(http.MethodPost, "/auth/register", reqBody))

	// Assert
	s.Require().NoError(err)
	s.Equal(http.StatusCreated, resp.StatusCode)

	var respBody map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&respBody)
	s.Require().NoError(err)

	s.Equal("testuser", respBody["username"])
	s.NotEmpty(respBody["id"])
}

func (s *AccountHandlerTestSuite) TestRegister_InvalidInput() {
	testCases := []struct {
		name     string
		reqBody  map[string]interface{}
		expected int
	}{
		{
			name: "missing token",
			reqBody: map[string]interface{}{
				"email":    "test@example.com",
				"username": "testuser",
				"password": "password123",
			},
			expected: http.StatusBadRequest,
		},
		{
			name: "invalid email",
			reqBody: map[string]interface{}{
				"token":    "valid-token",
				"email":    "invalid-email",
				"username": "testuser",
				"password": "password123",
			},
			expected: http.StatusBadRequest,
		},
		{
			name: "username too short",
			reqBody: map[string]interface{}{
				"token":    "valid-token",
				"email":    "test@example.com",
				"username": "te",
				"password": "password123",
			},
			expected: http.StatusBadRequest,
		},
	}

	for _, tc := range testCases {
		s.Run(tc.name, func() {
			resp, err := s.app.Test(makeTestRequest(http.MethodPost, "/auth/register", tc.reqBody))
			s.Require().NoError(err)
			s.Equal(tc.expected, resp.StatusCode, tc.name)
		})
	}
}

func (s *AccountHandlerTestSuite) TestLogin_Success() {
	// Arrange
	password := "password123"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	s.Require().NoError(err)

	// Create test user
	user, err := s.db.User.Create().
		SetUsername("testuser").
		SetPassword(string(hashedPassword)).
		SetName("Test User").
		SetEmail("test@example.com").
		Save(context.Background())
	s.Require().NoError(err)

	reqBody := map[string]interface{}{
		"token":    "valid-token",
		"username": "testuser",
		"password": password,
	}

	// Act
	resp, err := s.app.Test(makeTestRequest(http.MethodPost, "/auth/login", reqBody))

	// Assert
	s.Require().NoError(err)
	s.Equal(http.StatusOK, resp.StatusCode, resp)

	var respBody map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&respBody)
	s.Require().NoError(err)

	s.NotEmpty(respBody["token"])

	// Verify the JWT token
	token, err := jwt.Parse(respBody["token"].(string), func(token *jwt.Token) (interface{}, error) {
		return s.handler.Config.JWTSecretPub, nil
	})
	s.Require().NoError(err)
	s.True(token.Valid)

	claims := token.Claims.(jwt.MapClaims)
	s.Equal(float64(user.ID), claims["id"])
	s.Equal(user.Username, claims["username"])
}

func (s *AccountHandlerTestSuite) TestEmailVerification_Success() {
	// Arrange
	user, err := s.db.User.Create().
		SetUsername("testuser").
		SetPassword("hashedpassword").
		SetName("Test User").
		Save(context.Background())
	s.Require().NoError(err)

	// Create a valid JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodEdDSA, jwt.MapClaims{
		"id":    user.ID,
		"email": "newemail@example.com",
		"exp":   time.Now().Add(time.Hour).Unix(),
	})
	tokenString, err := token.SignedString(s.handler.Config.JWTSecretKey)
	s.Require().NoError(err)

	reqBody := map[string]interface{}{
		"token": tokenString,
	}

	// Act
	resp, err := s.app.Test(makeTestRequest(http.MethodPost, "/auth/email/verification", reqBody))

	// Assert
	s.Require().NoError(err)
	s.Equal(http.StatusOK, resp.StatusCode)

	// Verify user email was updated
	updatedUser, err := s.db.User.Get(context.Background(), user.ID)
	s.Require().NoError(err)
	s.Equal("newemail@example.com", updatedUser.Email)
}

// Helper function to create test requests
func makeTestRequest(method, path string, body interface{}) *http.Request {
	jsonBody, _ := json.Marshal(body)
	req := httptest.NewRequest(method, path, bytes.NewReader(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	return req
}

func TestAccountHandlerSuite(t *testing.T) {
	suite.Run(t, new(AccountHandlerTestSuite))
}
