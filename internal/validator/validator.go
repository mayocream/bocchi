package validator

import (
	"regexp"

	"github.com/go-playground/validator/v10"
)

type Validator struct {
	v *validator.Validate
}

func (v *Validator) Validate(i interface{}) error {
	return v.v.Struct(i)
}

func NewValidator() *Validator {
	v := validator.New(validator.WithRequiredStructEnabled())
	v.RegisterValidation("username", validateUsername)
	return &Validator{
		v: v,
	}
}

func validateUsername(fl validator.FieldLevel) bool {
	username := fl.Field().String()
	match, _ := regexp.MatchString("^[a-zA-Z0-9_]+$", username)
	return match
}
