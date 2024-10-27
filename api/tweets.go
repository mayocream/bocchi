package api

import (
	"context"
	"strconv"

	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/ent/tweet"

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
			Path:    "/tweets/:id",
			Handler: h.GetTweet(),
		},
		{
			Method:  fiber.MethodGet,
			Path:    "/tweets",
			Handler: h.ListTweets(),
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
	type Response struct {
		*ent.Tweet
		Likes    int `json:"likes"`
		Retweets int `json:"retweets"`
		Replies  int `json:"replies"`
	}

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

		likes, err := tweet.QueryLikedBy().Count(context.Background())
		if err != nil {
			log.Errorf("failed to count likes: %v", err)
			return fiber.ErrInternalServerError
		}

		retweets, err := tweet.QueryRetweetedBy().Count(context.Background())
		if err != nil {
			log.Errorf("failed to count retweets: %v", err)
			return fiber.ErrInternalServerError
		}

		replies, err := tweet.QueryReplies().Count(context.Background())
		if err != nil {
			log.Errorf("failed to count replies: %v", err)
			return fiber.ErrInternalServerError
		}

		return c.AutoFormat(Response{
			Tweet:    tweet,
			Likes:    likes,
			Retweets: retweets,
			Replies:  replies,
		})
	}
}

func (h *TweetHandler) ListTweets() fiber.Handler {
	type Request struct {
		Offset int `query:"offset"`
	}

	return func(c fiber.Ctx) error {
		var req Request
		if err := c.Bind().Query(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		}

		tweets, err := h.DB.Tweet.Query().
			WithAuthor().
			Limit(100).
			Offset(req.Offset).
			Order(ent.Desc(tweet.FieldID)).
			All(context.Background())
		if err != nil {
			log.Errorf("failed to list tweets: %v", err)
			return fiber.ErrInternalServerError
		}

		return c.AutoFormat(tweets)
	}
}
