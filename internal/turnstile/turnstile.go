package turnstile

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/client"
	"github.com/mayocream/twitter/internal/config"
)

const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

type Turnstile struct {
	Config *config.Config
}

type TurnstileResponse struct {
	Success bool `json:"success"`
}

func NewTurnstile(config *config.Config) *Turnstile {
	return &Turnstile{
		Config: config,
	}
}

func (t *Turnstile) Verify(token string) error {
	result, err := client.Post(TURNSTILE_URL, client.Config{
		FormData: map[string]string{
			"secret":   t.Config.TurnstileSecretKey,
			"response": token,
		},
	})
	if err != nil {
		return err
	}

	if result.StatusCode() != fiber.StatusOK {
		return fiber.ErrForbidden
	}

	var response TurnstileResponse
	if err := result.JSON(&response); err != nil {
		return err
	}

	if !response.Success {
		return fiber.ErrForbidden
	}

	return nil
}
