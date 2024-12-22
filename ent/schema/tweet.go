package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Tweet holds the schema definition for the Tweet entity.
type Tweet struct {
	ent.Schema
}

// Fields of the Tweet.
func (Tweet) Fields() []ent.Field {
	return []ent.Field{
		field.String("content"),
		field.Int("author_id"),
		field.Int("parent_id").
			Optional(),
		field.Time("created_at").
			Default(time.Now),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Tweet.
func (Tweet) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("parent", Tweet.Type).
			Unique().
			Field("parent_id").
			Annotations(entsql.OnDelete(entsql.Cascade)),
		edge.From("author", User.Type).
			Ref("tweets").
			Required().
			Unique().
			Field("author_id"),
		edge.To("likes", Like.Type).
			Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
