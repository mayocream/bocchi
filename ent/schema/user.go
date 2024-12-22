package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.String("username").
			Unique(),
		field.String("email").
			Unique(),
		field.Bool("email_verified").
			Default(false),
		field.String("password"),
		field.String("avatar").
			Optional(),
		field.String("banner").
			Optional(),
		field.String("bio").
			Optional(),
		field.Time("created_at").
			Default(time.Now),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("tweets", Tweet.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.To("likes", Like.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
