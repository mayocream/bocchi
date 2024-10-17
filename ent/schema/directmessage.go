package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// DirectMessage holds the schema definition for the DirectMessage entity.
type DirectMessage struct {
	ent.Schema
}

// Fields of the DirectMessage.
func (DirectMessage) Fields() []ent.Field {
	return []ent.Field{
		field.String("content"),
		field.Time("sent_at").Default(time.Now),
		field.Time("read_at").Optional(),
	}
}

// Edges of the DirectMessage.
func (DirectMessage) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("sender", User.Type).Ref("sent_messages").Unique().Required(),
		edge.From("receiver", User.Type).Ref("received_messages").Unique().Required(),
	}
}
