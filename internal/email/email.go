package email

import (
	"bytes"
	_ "embed"
	"html/template"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

//go:embed template.html
var tpl string

var Tpl = template.Must(template.New("email").Parse(tpl))

func SendEmail(name, email, subject, token string) error {
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
		VerificationLink: "http://localhost:8080/verify?token=" + token,
	}

	// Execute template with data
	if err := Tpl.Execute(&body, data); err != nil {
		return err
	}

	message := mail.NewSingleEmail(from, subject, to, "", body.String())
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))

	_, err := client.Send(message)
	return err
}
