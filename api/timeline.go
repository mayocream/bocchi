package api

import (
	"github.com/gofiber/fiber/v3"
	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/ent/tweet"
)

type TimelineHandler struct {
	DB *ent.Client
}

func NewTimelineHandler(db *ent.Client) *TimelineHandler {
	return &TimelineHandler{
		DB: db,
	}
}

func (h *TimelineHandler) Routes() []Route {
	return []Route{
		{
			Method:  fiber.MethodGet,
			Path:    "/timeline",
			Handler: h.Timeline(),
		},
	}
}

// TODO: pagination
func (h *TimelineHandler) Timeline() fiber.Handler {
	return func(c fiber.Ctx) error {
		tweets, err := h.DB.Tweet.Query().
			Order(ent.Desc(tweet.FieldID)).
			Limit(100).
			All(c.Context())
		if err != nil {
			return err
		}

		return c.JSON(tweets)
	}
}
