package email

import (
	"bytes"
	"context"
	_ "embed"
	"fmt"
	"html/template"

	"github.com/mayocream/twitter/internal/config"

	"github.com/mailgun/mailgun-go/v4"
)

//go:embed template.html
var tpl string

var Tpl = template.Must(template.New("email").Parse(tpl))

type Email struct {
	config *config.Config
	client mailgun.Mailgun
}

func NewEmail(config *config.Config) *Email {
	return &Email{
		config: config,
		client: mailgun.NewMailgun(config.EmailDomain, config.MailgunAPIKey),
	}
}

func (e *Email) SendEmailVerification(ctx context.Context, name, email, token string) error {
	sender := fmt.Sprintf("%s@%s", "no-reply", e.config.EmailDomain)

	// Create a new buffer to store the rendered template
	var body bytes.Buffer

	// Create template data
	data := struct {
		SiteName         string
		UserName         string
		VerificationLink string
	}{
		SiteName:         e.config.SiteName,
		UserName:         name,
		VerificationLink: fmt.Sprintf("%s/email/verification?token=%s", e.config.BaseURL, token),
	}

	// Execute template with data
	if err := Tpl.Execute(&body, data); err != nil {
		return err
	}

	message := e.client.NewMessage(
		sender,
		fmt.Sprintf("[%s] Verify your email address", e.config.SiteName),
		"",
		email,
	)
	message.SetHtml(body.String())

	_, _, err := e.client.Send(ctx, message)
	return err
}
