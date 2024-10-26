package api

import (
	"context"
	"strconv"

	"github.com/mayocream/twitter/ent"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
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
			Protected: true,
		},
		{
			Method:  fiber.MethodGet,
			Path:    "/tweet/:id",
			Handler: h.GetTweet(),
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

		user, ok := c.Locals("user").(*ent.User)
		if !ok {
			return fiber.ErrUnauthorized
		}

		tweet, err := h.DB.Tweet.Create().
			SetAuthor(user).
			SetContent(req.Content).
			Save(context.Background())
		if err != nil {
			log.Errorf("failed to create tweet: %v", err)
			return fiber.ErrInternalServerError
		}

		return c.Status(fiber.StatusCreated).AutoFormat(tweet)
	}
}

func (h *TweetHandler) GetTweet() fiber.Handler {
	return func(c fiber.Ctx) error {
		idStr := c.Params("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			return fiber.ErrBadRequest
		}

		tweet, err := h.DB.Tweet.Get(context.Background(), id)
		if err != nil {
			return fiber.ErrNotFound
		}

		return c.AutoFormat(tweet)
	}
}
