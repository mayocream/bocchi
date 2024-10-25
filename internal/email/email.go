package email

import (
	"context"
	_ "embed"
	"html/template"
)

//go:embed template.html
var tpl string

var Tpl = template.Must(template.New("email").Parse(tpl))

type Email interface {
	SendEmailVerification(ctx context.Context, name, email, token string) error
}
