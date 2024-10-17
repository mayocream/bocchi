// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/mayocream/twitter/ent/directmessage"
	"github.com/mayocream/twitter/ent/predicate"
	"github.com/mayocream/twitter/ent/user"
)

// DirectMessageUpdate is the builder for updating DirectMessage entities.
type DirectMessageUpdate struct {
	config
	hooks    []Hook
	mutation *DirectMessageMutation
}

// Where appends a list predicates to the DirectMessageUpdate builder.
func (dmu *DirectMessageUpdate) Where(ps ...predicate.DirectMessage) *DirectMessageUpdate {
	dmu.mutation.Where(ps...)
	return dmu
}

// SetContent sets the "content" field.
func (dmu *DirectMessageUpdate) SetContent(s string) *DirectMessageUpdate {
	dmu.mutation.SetContent(s)
	return dmu
}

// SetNillableContent sets the "content" field if the given value is not nil.
func (dmu *DirectMessageUpdate) SetNillableContent(s *string) *DirectMessageUpdate {
	if s != nil {
		dmu.SetContent(*s)
	}
	return dmu
}

// SetSentAt sets the "sent_at" field.
func (dmu *DirectMessageUpdate) SetSentAt(t time.Time) *DirectMessageUpdate {
	dmu.mutation.SetSentAt(t)
	return dmu
}

// SetNillableSentAt sets the "sent_at" field if the given value is not nil.
func (dmu *DirectMessageUpdate) SetNillableSentAt(t *time.Time) *DirectMessageUpdate {
	if t != nil {
		dmu.SetSentAt(*t)
	}
	return dmu
}

// SetReadAt sets the "read_at" field.
func (dmu *DirectMessageUpdate) SetReadAt(t time.Time) *DirectMessageUpdate {
	dmu.mutation.SetReadAt(t)
	return dmu
}

// SetNillableReadAt sets the "read_at" field if the given value is not nil.
func (dmu *DirectMessageUpdate) SetNillableReadAt(t *time.Time) *DirectMessageUpdate {
	if t != nil {
		dmu.SetReadAt(*t)
	}
	return dmu
}

// ClearReadAt clears the value of the "read_at" field.
func (dmu *DirectMessageUpdate) ClearReadAt() *DirectMessageUpdate {
	dmu.mutation.ClearReadAt()
	return dmu
}

// SetSenderID sets the "sender" edge to the User entity by ID.
func (dmu *DirectMessageUpdate) SetSenderID(id int) *DirectMessageUpdate {
	dmu.mutation.SetSenderID(id)
	return dmu
}

// SetSender sets the "sender" edge to the User entity.
func (dmu *DirectMessageUpdate) SetSender(u *User) *DirectMessageUpdate {
	return dmu.SetSenderID(u.ID)
}

// SetReceiverID sets the "receiver" edge to the User entity by ID.
func (dmu *DirectMessageUpdate) SetReceiverID(id int) *DirectMessageUpdate {
	dmu.mutation.SetReceiverID(id)
	return dmu
}

// SetReceiver sets the "receiver" edge to the User entity.
func (dmu *DirectMessageUpdate) SetReceiver(u *User) *DirectMessageUpdate {
	return dmu.SetReceiverID(u.ID)
}

// Mutation returns the DirectMessageMutation object of the builder.
func (dmu *DirectMessageUpdate) Mutation() *DirectMessageMutation {
	return dmu.mutation
}

// ClearSender clears the "sender" edge to the User entity.
func (dmu *DirectMessageUpdate) ClearSender() *DirectMessageUpdate {
	dmu.mutation.ClearSender()
	return dmu
}

// ClearReceiver clears the "receiver" edge to the User entity.
func (dmu *DirectMessageUpdate) ClearReceiver() *DirectMessageUpdate {
	dmu.mutation.ClearReceiver()
	return dmu
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (dmu *DirectMessageUpdate) Save(ctx context.Context) (int, error) {
	return withHooks(ctx, dmu.sqlSave, dmu.mutation, dmu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (dmu *DirectMessageUpdate) SaveX(ctx context.Context) int {
	affected, err := dmu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (dmu *DirectMessageUpdate) Exec(ctx context.Context) error {
	_, err := dmu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (dmu *DirectMessageUpdate) ExecX(ctx context.Context) {
	if err := dmu.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (dmu *DirectMessageUpdate) check() error {
	if dmu.mutation.SenderCleared() && len(dmu.mutation.SenderIDs()) > 0 {
		return errors.New(`ent: clearing a required unique edge "DirectMessage.sender"`)
	}
	if dmu.mutation.ReceiverCleared() && len(dmu.mutation.ReceiverIDs()) > 0 {
		return errors.New(`ent: clearing a required unique edge "DirectMessage.receiver"`)
	}
	return nil
}

func (dmu *DirectMessageUpdate) sqlSave(ctx context.Context) (n int, err error) {
	if err := dmu.check(); err != nil {
		return n, err
	}
	_spec := sqlgraph.NewUpdateSpec(directmessage.Table, directmessage.Columns, sqlgraph.NewFieldSpec(directmessage.FieldID, field.TypeInt))
	if ps := dmu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := dmu.mutation.Content(); ok {
		_spec.SetField(directmessage.FieldContent, field.TypeString, value)
	}
	if value, ok := dmu.mutation.SentAt(); ok {
		_spec.SetField(directmessage.FieldSentAt, field.TypeTime, value)
	}
	if value, ok := dmu.mutation.ReadAt(); ok {
		_spec.SetField(directmessage.FieldReadAt, field.TypeTime, value)
	}
	if dmu.mutation.ReadAtCleared() {
		_spec.ClearField(directmessage.FieldReadAt, field.TypeTime)
	}
	if dmu.mutation.SenderCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   directmessage.SenderTable,
			Columns: []string{directmessage.SenderColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := dmu.mutation.SenderIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   directmessage.SenderTable,
			Columns: []string{directmessage.SenderColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if dmu.mutation.ReceiverCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   directmessage.ReceiverTable,
			Columns: []string{directmessage.ReceiverColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := dmu.mutation.ReceiverIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   directmessage.ReceiverTable,
			Columns: []string{directmessage.ReceiverColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, dmu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{directmessage.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	dmu.mutation.done = true
	return n, nil
}

// DirectMessageUpdateOne is the builder for updating a single DirectMessage entity.
type DirectMessageUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *DirectMessageMutation
}

// SetContent sets the "content" field.
func (dmuo *DirectMessageUpdateOne) SetContent(s string) *DirectMessageUpdateOne {
	dmuo.mutation.SetContent(s)
	return dmuo
}

// SetNillableContent sets the "content" field if the given value is not nil.
func (dmuo *DirectMessageUpdateOne) SetNillableContent(s *string) *DirectMessageUpdateOne {
	if s != nil {
		dmuo.SetContent(*s)
	}
	return dmuo
}

// SetSentAt sets the "sent_at" field.
func (dmuo *DirectMessageUpdateOne) SetSentAt(t time.Time) *DirectMessageUpdateOne {
	dmuo.mutation.SetSentAt(t)
	return dmuo
}

// SetNillableSentAt sets the "sent_at" field if the given value is not nil.
func (dmuo *DirectMessageUpdateOne) SetNillableSentAt(t *time.Time) *DirectMessageUpdateOne {
	if t != nil {
		dmuo.SetSentAt(*t)
	}
	return dmuo
}

// SetReadAt sets the "read_at" field.
func (dmuo *DirectMessageUpdateOne) SetReadAt(t time.Time) *DirectMessageUpdateOne {
	dmuo.mutation.SetReadAt(t)
	return dmuo
}

// SetNillableReadAt sets the "read_at" field if the given value is not nil.
func (dmuo *DirectMessageUpdateOne) SetNillableReadAt(t *time.Time) *DirectMessageUpdateOne {
	if t != nil {
		dmuo.SetReadAt(*t)
	}
	return dmuo
}

// ClearReadAt clears the value of the "read_at" field.
func (dmuo *DirectMessageUpdateOne) ClearReadAt() *DirectMessageUpdateOne {
	dmuo.mutation.ClearReadAt()
	return dmuo
}

// SetSenderID sets the "sender" edge to the User entity by ID.
func (dmuo *DirectMessageUpdateOne) SetSenderID(id int) *DirectMessageUpdateOne {
	dmuo.mutation.SetSenderID(id)
	return dmuo
}

// SetSender sets the "sender" edge to the User entity.
func (dmuo *DirectMessageUpdateOne) SetSender(u *User) *DirectMessageUpdateOne {
	return dmuo.SetSenderID(u.ID)
}

// SetReceiverID sets the "receiver" edge to the User entity by ID.
func (dmuo *DirectMessageUpdateOne) SetReceiverID(id int) *DirectMessageUpdateOne {
	dmuo.mutation.SetReceiverID(id)
	return dmuo
}

// SetReceiver sets the "receiver" edge to the User entity.
func (dmuo *DirectMessageUpdateOne) SetReceiver(u *User) *DirectMessageUpdateOne {
	return dmuo.SetReceiverID(u.ID)
}

// Mutation returns the DirectMessageMutation object of the builder.
func (dmuo *DirectMessageUpdateOne) Mutation() *DirectMessageMutation {
	return dmuo.mutation
}

// ClearSender clears the "sender" edge to the User entity.
func (dmuo *DirectMessageUpdateOne) ClearSender() *DirectMessageUpdateOne {
	dmuo.mutation.ClearSender()
	return dmuo
}

// ClearReceiver clears the "receiver" edge to the User entity.
func (dmuo *DirectMessageUpdateOne) ClearReceiver() *DirectMessageUpdateOne {
	dmuo.mutation.ClearReceiver()
	return dmuo
}

// Where appends a list predicates to the DirectMessageUpdate builder.
func (dmuo *DirectMessageUpdateOne) Where(ps ...predicate.DirectMessage) *DirectMessageUpdateOne {
	dmuo.mutation.Where(ps...)
	return dmuo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (dmuo *DirectMessageUpdateOne) Select(field string, fields ...string) *DirectMessageUpdateOne {
	dmuo.fields = append([]string{field}, fields...)
	return dmuo
}

// Save executes the query and returns the updated DirectMessage entity.
func (dmuo *DirectMessageUpdateOne) Save(ctx context.Context) (*DirectMessage, error) {
	return withHooks(ctx, dmuo.sqlSave, dmuo.mutation, dmuo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (dmuo *DirectMessageUpdateOne) SaveX(ctx context.Context) *DirectMessage {
	node, err := dmuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (dmuo *DirectMessageUpdateOne) Exec(ctx context.Context) error {
	_, err := dmuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (dmuo *DirectMessageUpdateOne) ExecX(ctx context.Context) {
	if err := dmuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (dmuo *DirectMessageUpdateOne) check() error {
	if dmuo.mutation.SenderCleared() && len(dmuo.mutation.SenderIDs()) > 0 {
		return errors.New(`ent: clearing a required unique edge "DirectMessage.sender"`)
	}
	if dmuo.mutation.ReceiverCleared() && len(dmuo.mutation.ReceiverIDs()) > 0 {
		return errors.New(`ent: clearing a required unique edge "DirectMessage.receiver"`)
	}
	return nil
}

func (dmuo *DirectMessageUpdateOne) sqlSave(ctx context.Context) (_node *DirectMessage, err error) {
	if err := dmuo.check(); err != nil {
		return _node, err
	}
	_spec := sqlgraph.NewUpdateSpec(directmessage.Table, directmessage.Columns, sqlgraph.NewFieldSpec(directmessage.FieldID, field.TypeInt))
	id, ok := dmuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "DirectMessage.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := dmuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, directmessage.FieldID)
		for _, f := range fields {
			if !directmessage.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != directmessage.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := dmuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := dmuo.mutation.Content(); ok {
		_spec.SetField(directmessage.FieldContent, field.TypeString, value)
	}
	if value, ok := dmuo.mutation.SentAt(); ok {
		_spec.SetField(directmessage.FieldSentAt, field.TypeTime, value)
	}
	if value, ok := dmuo.mutation.ReadAt(); ok {
		_spec.SetField(directmessage.FieldReadAt, field.TypeTime, value)
	}
	if dmuo.mutation.ReadAtCleared() {
		_spec.ClearField(directmessage.FieldReadAt, field.TypeTime)
	}
	if dmuo.mutation.SenderCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   directmessage.SenderTable,
			Columns: []string{directmessage.SenderColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := dmuo.mutation.SenderIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   directmessage.SenderTable,
			Columns: []string{directmessage.SenderColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if dmuo.mutation.ReceiverCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   directmessage.ReceiverTable,
			Columns: []string{directmessage.ReceiverColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := dmuo.mutation.ReceiverIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   directmessage.ReceiverTable,
			Columns: []string{directmessage.ReceiverColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &DirectMessage{config: dmuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, dmuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{directmessage.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	dmuo.mutation.done = true
	return _node, nil
}
