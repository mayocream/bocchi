package schema

import (
	"time"

	"entgo.io/ent"
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
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

// Edges of the Tweet.
func (Tweet) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("author", User.Type).Ref("tweets").Unique().Required(),
		edge.From("liked_by", User.Type).Ref("likes"),
		edge.From("retweeted_by", User.Type).Ref("retweets"),
		edge.To("replies", Tweet.Type).From("parent_tweet").Unique(),
		edge.To("hashtags", Hashtag.Type),
	}
}
