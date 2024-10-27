// Code generated by ent, DO NOT EDIT.

package tweet

import (
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
)

const (
	// Label holds the string label denoting the tweet type in the database.
	Label = "tweet"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldContent holds the string denoting the content field in the database.
	FieldContent = "content"
	// FieldCreatedAt holds the string denoting the created_at field in the database.
	FieldCreatedAt = "created_at"
	// FieldUpdatedAt holds the string denoting the updated_at field in the database.
	FieldUpdatedAt = "updated_at"
	// EdgeAuthor holds the string denoting the author edge name in mutations.
	EdgeAuthor = "author"
	// EdgeLikedBy holds the string denoting the liked_by edge name in mutations.
	EdgeLikedBy = "liked_by"
	// EdgeRetweetedBy holds the string denoting the retweeted_by edge name in mutations.
	EdgeRetweetedBy = "retweeted_by"
	// EdgeParentTweet holds the string denoting the parent_tweet edge name in mutations.
	EdgeParentTweet = "parent_tweet"
	// EdgeReplies holds the string denoting the replies edge name in mutations.
	EdgeReplies = "replies"
	// EdgeHashtags holds the string denoting the hashtags edge name in mutations.
	EdgeHashtags = "hashtags"
	// Table holds the table name of the tweet in the database.
	Table = "tweets"
	// AuthorTable is the table that holds the author relation/edge.
	AuthorTable = "tweets"
	// AuthorInverseTable is the table name for the User entity.
	// It exists in this package in order to avoid circular dependency with the "user" package.
	AuthorInverseTable = "users"
	// AuthorColumn is the table column denoting the author relation/edge.
	AuthorColumn = "user_tweets"
	// LikedByTable is the table that holds the liked_by relation/edge. The primary key declared below.
	LikedByTable = "user_likes"
	// LikedByInverseTable is the table name for the User entity.
	// It exists in this package in order to avoid circular dependency with the "user" package.
	LikedByInverseTable = "users"
	// RetweetedByTable is the table that holds the retweeted_by relation/edge. The primary key declared below.
	RetweetedByTable = "user_retweets"
	// RetweetedByInverseTable is the table name for the User entity.
	// It exists in this package in order to avoid circular dependency with the "user" package.
	RetweetedByInverseTable = "users"
	// ParentTweetTable is the table that holds the parent_tweet relation/edge.
	ParentTweetTable = "tweets"
	// ParentTweetColumn is the table column denoting the parent_tweet relation/edge.
	ParentTweetColumn = "tweet_replies"
	// RepliesTable is the table that holds the replies relation/edge.
	RepliesTable = "tweets"
	// RepliesColumn is the table column denoting the replies relation/edge.
	RepliesColumn = "tweet_replies"
	// HashtagsTable is the table that holds the hashtags relation/edge. The primary key declared below.
	HashtagsTable = "tweet_hashtags"
	// HashtagsInverseTable is the table name for the Hashtag entity.
	// It exists in this package in order to avoid circular dependency with the "hashtag" package.
	HashtagsInverseTable = "hashtags"
)

// Columns holds all SQL columns for tweet fields.
var Columns = []string{
	FieldID,
	FieldContent,
	FieldCreatedAt,
	FieldUpdatedAt,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "tweets"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"tweet_replies",
	"user_tweets",
}

var (
	// LikedByPrimaryKey and LikedByColumn2 are the table columns denoting the
	// primary key for the liked_by relation (M2M).
	LikedByPrimaryKey = []string{"user_id", "tweet_id"}
	// RetweetedByPrimaryKey and RetweetedByColumn2 are the table columns denoting the
	// primary key for the retweeted_by relation (M2M).
	RetweetedByPrimaryKey = []string{"user_id", "tweet_id"}
	// HashtagsPrimaryKey and HashtagsColumn2 are the table columns denoting the
	// primary key for the hashtags relation (M2M).
	HashtagsPrimaryKey = []string{"tweet_id", "hashtag_id"}
)

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	for i := range ForeignKeys {
		if column == ForeignKeys[i] {
			return true
		}
	}
	return false
}

var (
	// DefaultCreatedAt holds the default value on creation for the "created_at" field.
	DefaultCreatedAt func() time.Time
	// DefaultUpdatedAt holds the default value on creation for the "updated_at" field.
	DefaultUpdatedAt func() time.Time
	// UpdateDefaultUpdatedAt holds the default value on update for the "updated_at" field.
	UpdateDefaultUpdatedAt func() time.Time
)

// OrderOption defines the ordering options for the Tweet queries.
type OrderOption func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByContent orders the results by the content field.
func ByContent(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldContent, opts...).ToFunc()
}

// ByCreatedAt orders the results by the created_at field.
func ByCreatedAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldCreatedAt, opts...).ToFunc()
}

// ByUpdatedAt orders the results by the updated_at field.
func ByUpdatedAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldUpdatedAt, opts...).ToFunc()
}

// ByAuthorField orders the results by author field.
func ByAuthorField(field string, opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newAuthorStep(), sql.OrderByField(field, opts...))
	}
}

// ByLikedByCount orders the results by liked_by count.
func ByLikedByCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newLikedByStep(), opts...)
	}
}

// ByLikedBy orders the results by liked_by terms.
func ByLikedBy(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newLikedByStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByRetweetedByCount orders the results by retweeted_by count.
func ByRetweetedByCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newRetweetedByStep(), opts...)
	}
}

// ByRetweetedBy orders the results by retweeted_by terms.
func ByRetweetedBy(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newRetweetedByStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByParentTweetField orders the results by parent_tweet field.
func ByParentTweetField(field string, opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newParentTweetStep(), sql.OrderByField(field, opts...))
	}
}

// ByRepliesCount orders the results by replies count.
func ByRepliesCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newRepliesStep(), opts...)
	}
}

// ByReplies orders the results by replies terms.
func ByReplies(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newRepliesStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByHashtagsCount orders the results by hashtags count.
func ByHashtagsCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newHashtagsStep(), opts...)
	}
}

// ByHashtags orders the results by hashtags terms.
func ByHashtags(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newHashtagsStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}
func newAuthorStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(AuthorInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, AuthorTable, AuthorColumn),
	)
}
func newLikedByStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(LikedByInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, true, LikedByTable, LikedByPrimaryKey...),
	)
}
func newRetweetedByStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(RetweetedByInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, true, RetweetedByTable, RetweetedByPrimaryKey...),
	)
}
func newParentTweetStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(Table, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, ParentTweetTable, ParentTweetColumn),
	)
}
func newRepliesStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(Table, FieldID),
		sqlgraph.Edge(sqlgraph.O2M, false, RepliesTable, RepliesColumn),
	)
}
func newHashtagsStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(HashtagsInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, false, HashtagsTable, HashtagsPrimaryKey...),
	)
}
