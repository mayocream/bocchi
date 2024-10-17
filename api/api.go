package api

import (
	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/validator"

	"github.com/gofiber/fiber/v3"
)

type Api struct {
	App *fiber.App
	DB  *ent.Client
}

func NewApi(db *ent.Client) *Api {
	return &Api{
		App: fiber.New(fiber.Config{
			StructValidator: validator.NewValidator(),
		}),
		DB: db,
	}
}

func (api *Api) Register() {

}

func (api *Api) Run(port string) error {
	return api.App.Listen(port, fiber.ListenConfig{
		DisableStartupMessage: true,
	})
}
