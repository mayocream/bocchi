package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Retweet holds the schema definition for the Retweet entity.
type Retweet struct {
	ent.Schema
}

// Fields of the Retweet.
func (Retweet) Fields() []ent.Field {
	return []ent.Field{
		field.Int("tweet_id"),
		field.Int("user_id"),
		field.Time("created_at"),
	}
}

// Edges of the Retweet.
func (Retweet) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("tweet", Tweet.Type).
			Ref("retweets"),
		edge.From("user", User.Type).
			Ref("retweets"),
	}
}
