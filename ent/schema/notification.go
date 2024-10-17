package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Notification holds the schema definition for the Notification entity.
type Notification struct {
	ent.Schema
}

// Fields of the Notification.
func (Notification) Fields() []ent.Field {
	return []ent.Field{
		field.Enum("type").Values("like", "follow", "mention", "retweet"),
		field.Time("created_at").Default(time.Now),
		field.Time("read_at").Optional(),
	}
}

// Edges of the Notification.
func (Notification) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).Ref("notifications").Unique(),
		edge.To("related_tweet", Tweet.Type).Unique(),
		edge.To("related_user", User.Type).Unique(),
	}
}
