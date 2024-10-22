package api

import (
	"strings"

	"github.com/mayocream/twitter/ent"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
	"github.com/golang-jwt/jwt/v5"
)

type Token struct {
	ent.User
	jwt.RegisteredClaims
}

func (h *Handler) Authentication(c fiber.Ctx) error {
	token := c.Get("Authorization")
	token = strings.TrimPrefix(token, "Bearer ")
	if token == "" {
		return fiber.ErrUnauthorized
	}

	var t Token
	jwtToken, err := jwt.ParseWithClaims(token, &t, func(token *jwt.Token) (interface{}, error) {
		return h.Config.JWTSecretPub, nil
	})

	if err != nil || !jwtToken.Valid {
		log.Infof("Failed to parse token: %v", err)
		return fiber.ErrUnauthorized
	}

	c.Locals("user", &t.User)

	return c.Next()
}
