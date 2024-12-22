package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Like holds the schema definition for the Like entity.
type Like struct {
	ent.Schema
}

// Fields of the Like.
func (Like) Fields() []ent.Field {
	return []ent.Field{
		field.Int("tweet_id"),
		field.Int("user_id"),
		field.Time("created_at").
			Default(time.Now),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Like.
func (Like) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("tweet", Tweet.Type).
			Ref("likes").
			Unique().
			Required().
			Field("tweet_id"),
		edge.From("user", User.Type).
			Ref("likes").
			Unique().
			Required().
			Field("user_id"),
	}
}
