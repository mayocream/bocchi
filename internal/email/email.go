package email

import (
	"bytes"
	_ "embed"
	"fmt"
	"html/template"

	"github.com/mayocream/twitter/internal/config"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

//go:embed template.html
var tpl string

var Tpl = template.Must(template.New("email").Parse(tpl))

type Email struct {
	config *config.Config
	client *sendgrid.Client
}

func NewEmail(config *config.Config) *Email {
	return &Email{
		config: config,
		client: sendgrid.NewSendClient(config.SendgridAPIKey),
	}
}

func (e *Email) SendEmail(name, email, subject, token string) error {
	from := mail.NewEmail("Twitter", "no-reply@twitter.co.jp")
	to := mail.NewEmail(name, email)

	// Create a new buffer to store the rendered template
	var body bytes.Buffer

	// Create template data
	data := struct {
		SiteName         string
		UserName         string
		VerificationLink string
	}{
		SiteName:         "Twitter",
		UserName:         name,
		VerificationLink: fmt.Sprintf("%s/email/verification?token=%s", e.config.BaseURL, token),
	}

	// Execute template with data
	if err := Tpl.Execute(&body, data); err != nil {
		return err
	}

	message := mail.NewSingleEmail(from, subject, to, "", body.String())
	_, err := e.client.Send(message)
	return err
}
