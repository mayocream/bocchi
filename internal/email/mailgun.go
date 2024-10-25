package email

import (
	"bytes"
	"context"
	_ "embed"
	"fmt"

	"github.com/mayocream/twitter/internal/config"

	"github.com/mailgun/mailgun-go/v4"
)

type Mailgun struct {
	config *config.Config
	client mailgun.Mailgun
}

func NewMailgun(config *config.Config) Email {
	return &Mailgun{
		config: config,
		client: mailgun.NewMailgun(config.EmailDomain, config.MailgunAPIKey),
	}
}

func (m *Mailgun) SendEmailVerification(ctx context.Context, name, email, token string) error {
	sender := fmt.Sprintf("%s@%s", "no-reply", m.config.EmailDomain)

	// Create a new buffer to store the rendered template
	var body bytes.Buffer

	// Create template data
	data := struct {
		SiteName         string
		UserName         string
		VerificationLink string
	}{
		SiteName:         m.config.SiteName,
		UserName:         name,
		VerificationLink: fmt.Sprintf("%s/email/verification?token=%s", m.config.BaseURL, token),
	}

	// Execute template with data
	if err := Tpl.Execute(&body, data); err != nil {
		return err
	}

	message := m.client.NewMessage(
		sender,
		fmt.Sprintf("[%s] Verify your email address", m.config.SiteName),
		"",
		email,
	)
	message.SetHtml(body.String())

	_, _, err := m.client.Send(ctx, message)
	return err
}
