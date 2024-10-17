package validator

import (
	"github.com/go-playground/validator/v10"
)

type Validator struct {
	v *validator.Validate
}

func (v *Validator) Validate(i interface{}) error {
	return v.v.Struct(i)
}

func NewValidator() *Validator {
	return &Validator{
		v: validator.New(),
	}
}
