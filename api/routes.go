package api

import (
	"github.com/gofiber/fiber/v3"
	"go.uber.org/fx"
)

type Route struct {
	Method    string
	Path      string
	Handler   fiber.Handler
	Protected bool
}

type Handler interface {
	Routes() []Route
}

func AsRoute(f any) any {
	return fx.Annotate(
		f,
		fx.As(new(Handler)),
		fx.ResultTags(`group:"routes"`),
	)
}

var Routes = fx.Module("routes",
	fx.Provide(
		AsRoute(NewAccountHandler),
		AsRoute(NewTimelineHandler),
	),
)
