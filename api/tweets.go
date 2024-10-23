package api

import (
	"github.com/mayocream/twitter/ent"

	"github.com/gofiber/fiber/v3"
)

type TweetHandler struct {
	DB *ent.Client
}

func NewTweetHandler(db *ent.Client) *TweetHandler {
	return &TweetHandler{
		DB: db,
	}
}

func (h *TweetHandler) Routes() []Route {
	return []Route{
		{
			Method:    fiber.MethodPost,
			Path:      "/tweets",
			Handler:   h.Tweet(),
			Protected: false,
		},
	}
}

func (h *TweetHandler) Tweet() fiber.Handler {
	type Request struct {
		Content string `json:"content" validate:"required,max=140"`
	}

	return func(c fiber.Ctx) error {
		var req Request
		if err := c.Bind().JSON(&req); err != nil {
			return err
		}

		user := c.Locals("user").(*ent.User)

		_, err := h.DB.Tweet.Create().
			SetAuthor(user).
			SetContent(req.Content).
			Save(c.Context())
		if err != nil {
			return err
		}

		return c.SendStatus(fiber.StatusCreated)
	}
}
