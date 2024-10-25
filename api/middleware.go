package api

import (
	"strings"

	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/config"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/fx"
)

func Authentication(config *config.Config) fiber.Handler {
	type Token struct {
		ent.User
		jwt.RegisteredClaims
	}

	return func(c fiber.Ctx) error {
		if c.Method() == "OPTIONS" {
			return c.Next()
		}

		token := c.Get("Authorization")
		token = strings.TrimPrefix(token, "Bearer ")
		if token == "" {
			return fiber.ErrUnauthorized
		}

		var t Token
		jwtToken, err := jwt.ParseWithClaims(token, &t, func(token *jwt.Token) (interface{}, error) {
			return config.JWTSecretPub, nil
		})

		if err != nil || !jwtToken.Valid {
			log.Infof("Failed to parse token: %v", err)
			return fiber.ErrUnauthorized
		}

		c.Locals("user", &t.User)

		return c.Next()
	}
}

func Cors(config *config.Config) fiber.Handler {
	return cors.New(cors.Config{
		AllowOrigins: []string{config.BaseURL},
		MaxAge:       86400,
	})
}

func Logger() fiber.Handler {
	return logger.New()
}

func AsMiddleware(f any) any {
	return fx.Annotate(
		f,
		fx.ResultTags(`group:"middlewares"`),
	)
}

var Middlewares = fx.Module("middlewares",
	fx.Provide(
		AsMiddleware(Cors),
		AsMiddleware(Logger),
	),
)
