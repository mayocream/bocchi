package api

import (
	"time"

	"github.com/mayocream/twitter/ent"
	"github.com/mayocream/twitter/internal/email"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
	"github.com/golang-jwt/jwt/v5"
)

// TODO: email verification
type EmailVerificationRequest struct {
	Email string `json:"email" validate:"required,email"`
}

func (h *Handler) EmailVerificationRequest(c fiber.Ctx) error {
	user := c.Locals("user").(*ent.User)

	var req EmailVerificationRequest
	if err := c.Bind().JSON(&req); err != nil {
		return err
	}

	// create a JWT for email verification
	t := jwt.NewWithClaims(jwt.SigningMethodEdDSA, jwt.MapClaims{
		"iss": "twitter",
		"sub": req.Email,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
		"aud": user.ID,
	})
	s, err := t.SignedString(h.Config.JWTSecretKey)
	if err != nil {
		log.Errorf("failed to sign JWT: %v", err)
		return err
	}

	// send the email
	if err := email.SendEmail(user.Name, user.Email, "Verify your email", s); err != nil {
		log.Errorf("failed to send email: %v", err)
		return err
	}

	return c.SendStatus(fiber.StatusNoContent)
}
