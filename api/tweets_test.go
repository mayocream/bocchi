package api

import (
	"context"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/testutil"
	"github.com/mayocream/twitter/internal/validator"

	"github.com/gofiber/fiber/v3"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
)

type TweetHandlerTestSuite struct {
	suite.Suite
	app     *fiber.App
	handler *TweetHandler
	db      *ent.Client
}

func (s *TweetHandlerTestSuite) SetupTest() {
	var err error
	s.app = fiber.New(fiber.Config{
		StructValidator: validator.NewValidator(),
	})

	// Initialize test database (using SQLite for tests)
	s.db = testutil.InMemoryDatabase()

	s.handler = NewTweetHandler(s.db)

	// fixtures
	user, err := s.db.User.Create().
		SetName("Alice").
		SetUsername("alice").
		Save(context.Background())
	s.Require().NoError(err)

	s.app.Use(func(c fiber.Ctx) error {
		c.Locals("user", user)
		return c.Next()
	})

	// Register routes
	for _, route := range s.handler.Routes() {
		s.app.Add([]string{route.Method}, route.Path, route.Handler)
	}
}

func (s *TweetHandlerTestSuite) TearDownTest() {
	s.db.Close()
}

func (s *TweetHandlerTestSuite) TestTweet() {
	// Arrange
	reqBody := map[string]interface{}{
		"content": "Hello, world!",
	}

	// Act
	resp, err := s.app.Test(testutil.MakeTestRequest(http.MethodPost, "/tweets", reqBody))

	// Assert
	s.Require().NoError(err)
	s.Equal(http.StatusCreated, resp.StatusCode)

	var respBody map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&respBody)
	s.Require().NoError(err)

	s.NotEmpty(respBody["id"])
}

func TestTweetHandlerSuite(t *testing.T) {
	suite.Run(t, new(TweetHandlerTestSuite))
}
