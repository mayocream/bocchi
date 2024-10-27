package schema

import (
	"time"

	"entgo.io/ent"
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
		field.String("name").Optional(),
		field.String("email").Unique().Optional(),
		field.String("username").Unique(),
		field.String("password").Optional(),
		field.String("avatar").Optional(),
		field.String("bio").Optional(),
		field.String("location").Optional(),
		field.String("website").Optional(),
		field.String("banner").Optional(),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("tweets", Tweet.Type),
		edge.To("retweets", Tweet.Type),
		edge.To("likes", Tweet.Type),
		edge.To("followers", User.Type),
		edge.From("following", User.Type).Ref("followers"),
		edge.To("notifications", Notification.Type),
		edge.To("sent_messages", DirectMessage.Type),
		edge.To("received_messages", DirectMessage.Type),
	}
}
