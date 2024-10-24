// Code generated by ent, DO NOT EDIT.

package migrate

import (
	"entgo.io/ent/dialect/sql/schema"
	"entgo.io/ent/schema/field"
)

var (
	// DirectMessagesColumns holds the columns for the "direct_messages" table.
	DirectMessagesColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "content", Type: field.TypeString},
		{Name: "sent_at", Type: field.TypeTime},
		{Name: "read_at", Type: field.TypeTime, Nullable: true},
		{Name: "user_sent_messages", Type: field.TypeInt},
		{Name: "user_received_messages", Type: field.TypeInt},
	}
	// DirectMessagesTable holds the schema information for the "direct_messages" table.
	DirectMessagesTable = &schema.Table{
		Name:       "direct_messages",
		Columns:    DirectMessagesColumns,
		PrimaryKey: []*schema.Column{DirectMessagesColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "direct_messages_users_sent_messages",
				Columns:    []*schema.Column{DirectMessagesColumns[4]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.NoAction,
			},
			{
				Symbol:     "direct_messages_users_received_messages",
				Columns:    []*schema.Column{DirectMessagesColumns[5]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.NoAction,
			},
		},
	}
	// HashtagsColumns holds the columns for the "hashtags" table.
	HashtagsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "name", Type: field.TypeString, Unique: true},
	}
	// HashtagsTable holds the schema information for the "hashtags" table.
	HashtagsTable = &schema.Table{
		Name:       "hashtags",
		Columns:    HashtagsColumns,
		PrimaryKey: []*schema.Column{HashtagsColumns[0]},
	}
	// NotificationsColumns holds the columns for the "notifications" table.
	NotificationsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "type", Type: field.TypeEnum, Enums: []string{"like", "follow", "mention", "retweet"}},
		{Name: "created_at", Type: field.TypeTime},
		{Name: "read_at", Type: field.TypeTime, Nullable: true},
		{Name: "notification_related_tweet", Type: field.TypeInt, Nullable: true},
		{Name: "notification_related_user", Type: field.TypeInt, Nullable: true},
		{Name: "user_notifications", Type: field.TypeInt, Nullable: true},
	}
	// NotificationsTable holds the schema information for the "notifications" table.
	NotificationsTable = &schema.Table{
		Name:       "notifications",
		Columns:    NotificationsColumns,
		PrimaryKey: []*schema.Column{NotificationsColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "notifications_tweets_related_tweet",
				Columns:    []*schema.Column{NotificationsColumns[4]},
				RefColumns: []*schema.Column{TweetsColumns[0]},
				OnDelete:   schema.SetNull,
			},
			{
				Symbol:     "notifications_users_related_user",
				Columns:    []*schema.Column{NotificationsColumns[5]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.SetNull,
			},
			{
				Symbol:     "notifications_users_notifications",
				Columns:    []*schema.Column{NotificationsColumns[6]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.SetNull,
			},
		},
	}
	// TweetsColumns holds the columns for the "tweets" table.
	TweetsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "content", Type: field.TypeString},
		{Name: "created_at", Type: field.TypeTime},
		{Name: "updated_at", Type: field.TypeTime},
		{Name: "tweet_replies", Type: field.TypeInt, Nullable: true},
		{Name: "user_tweets", Type: field.TypeInt},
	}
	// TweetsTable holds the schema information for the "tweets" table.
	TweetsTable = &schema.Table{
		Name:       "tweets",
		Columns:    TweetsColumns,
		PrimaryKey: []*schema.Column{TweetsColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "tweets_tweets_replies",
				Columns:    []*schema.Column{TweetsColumns[4]},
				RefColumns: []*schema.Column{TweetsColumns[0]},
				OnDelete:   schema.SetNull,
			},
			{
				Symbol:     "tweets_users_tweets",
				Columns:    []*schema.Column{TweetsColumns[5]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.NoAction,
			},
		},
	}
	// UsersColumns holds the columns for the "users" table.
	UsersColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "name", Type: field.TypeString, Nullable: true},
		{Name: "email", Type: field.TypeString, Unique: true, Nullable: true},
		{Name: "username", Type: field.TypeString, Unique: true},
		{Name: "password", Type: field.TypeString, Nullable: true},
		{Name: "avatar", Type: field.TypeString, Nullable: true},
		{Name: "metadata", Type: field.TypeJSON},
		{Name: "created_at", Type: field.TypeTime},
		{Name: "updated_at", Type: field.TypeTime},
		{Name: "tweet_mentions", Type: field.TypeInt, Nullable: true},
	}
	// UsersTable holds the schema information for the "users" table.
	UsersTable = &schema.Table{
		Name:       "users",
		Columns:    UsersColumns,
		PrimaryKey: []*schema.Column{UsersColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "users_tweets_mentions",
				Columns:    []*schema.Column{UsersColumns[9]},
				RefColumns: []*schema.Column{TweetsColumns[0]},
				OnDelete:   schema.SetNull,
			},
		},
	}
	// TweetHashtagsColumns holds the columns for the "tweet_hashtags" table.
	TweetHashtagsColumns = []*schema.Column{
		{Name: "tweet_id", Type: field.TypeInt},
		{Name: "hashtag_id", Type: field.TypeInt},
	}
	// TweetHashtagsTable holds the schema information for the "tweet_hashtags" table.
	TweetHashtagsTable = &schema.Table{
		Name:       "tweet_hashtags",
		Columns:    TweetHashtagsColumns,
		PrimaryKey: []*schema.Column{TweetHashtagsColumns[0], TweetHashtagsColumns[1]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "tweet_hashtags_tweet_id",
				Columns:    []*schema.Column{TweetHashtagsColumns[0]},
				RefColumns: []*schema.Column{TweetsColumns[0]},
				OnDelete:   schema.Cascade,
			},
			{
				Symbol:     "tweet_hashtags_hashtag_id",
				Columns:    []*schema.Column{TweetHashtagsColumns[1]},
				RefColumns: []*schema.Column{HashtagsColumns[0]},
				OnDelete:   schema.Cascade,
			},
		},
	}
	// UserRetweetsColumns holds the columns for the "user_retweets" table.
	UserRetweetsColumns = []*schema.Column{
		{Name: "user_id", Type: field.TypeInt},
		{Name: "tweet_id", Type: field.TypeInt},
	}
	// UserRetweetsTable holds the schema information for the "user_retweets" table.
	UserRetweetsTable = &schema.Table{
		Name:       "user_retweets",
		Columns:    UserRetweetsColumns,
		PrimaryKey: []*schema.Column{UserRetweetsColumns[0], UserRetweetsColumns[1]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "user_retweets_user_id",
				Columns:    []*schema.Column{UserRetweetsColumns[0]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.Cascade,
			},
			{
				Symbol:     "user_retweets_tweet_id",
				Columns:    []*schema.Column{UserRetweetsColumns[1]},
				RefColumns: []*schema.Column{TweetsColumns[0]},
				OnDelete:   schema.Cascade,
			},
		},
	}
	// UserLikesColumns holds the columns for the "user_likes" table.
	UserLikesColumns = []*schema.Column{
		{Name: "user_id", Type: field.TypeInt},
		{Name: "tweet_id", Type: field.TypeInt},
	}
	// UserLikesTable holds the schema information for the "user_likes" table.
	UserLikesTable = &schema.Table{
		Name:       "user_likes",
		Columns:    UserLikesColumns,
		PrimaryKey: []*schema.Column{UserLikesColumns[0], UserLikesColumns[1]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "user_likes_user_id",
				Columns:    []*schema.Column{UserLikesColumns[0]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.Cascade,
			},
			{
				Symbol:     "user_likes_tweet_id",
				Columns:    []*schema.Column{UserLikesColumns[1]},
				RefColumns: []*schema.Column{TweetsColumns[0]},
				OnDelete:   schema.Cascade,
			},
		},
	}
	// UserFollowersColumns holds the columns for the "user_followers" table.
	UserFollowersColumns = []*schema.Column{
		{Name: "user_id", Type: field.TypeInt},
		{Name: "following_id", Type: field.TypeInt},
	}
	// UserFollowersTable holds the schema information for the "user_followers" table.
	UserFollowersTable = &schema.Table{
		Name:       "user_followers",
		Columns:    UserFollowersColumns,
		PrimaryKey: []*schema.Column{UserFollowersColumns[0], UserFollowersColumns[1]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "user_followers_user_id",
				Columns:    []*schema.Column{UserFollowersColumns[0]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.Cascade,
			},
			{
				Symbol:     "user_followers_following_id",
				Columns:    []*schema.Column{UserFollowersColumns[1]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.Cascade,
			},
		},
	}
	// Tables holds all the tables in the schema.
	Tables = []*schema.Table{
		DirectMessagesTable,
		HashtagsTable,
		NotificationsTable,
		TweetsTable,
		UsersTable,
		TweetHashtagsTable,
		UserRetweetsTable,
		UserLikesTable,
		UserFollowersTable,
	}
)

func init() {
	DirectMessagesTable.ForeignKeys[0].RefTable = UsersTable
	DirectMessagesTable.ForeignKeys[1].RefTable = UsersTable
	NotificationsTable.ForeignKeys[0].RefTable = TweetsTable
	NotificationsTable.ForeignKeys[1].RefTable = UsersTable
	NotificationsTable.ForeignKeys[2].RefTable = UsersTable
	TweetsTable.ForeignKeys[0].RefTable = TweetsTable
	TweetsTable.ForeignKeys[1].RefTable = UsersTable
	UsersTable.ForeignKeys[0].RefTable = TweetsTable
	TweetHashtagsTable.ForeignKeys[0].RefTable = TweetsTable
	TweetHashtagsTable.ForeignKeys[1].RefTable = HashtagsTable
	UserRetweetsTable.ForeignKeys[0].RefTable = UsersTable
	UserRetweetsTable.ForeignKeys[1].RefTable = TweetsTable
	UserLikesTable.ForeignKeys[0].RefTable = UsersTable
	UserLikesTable.ForeignKeys[1].RefTable = TweetsTable
	UserFollowersTable.ForeignKeys[0].RefTable = UsersTable
	UserFollowersTable.ForeignKeys[1].RefTable = UsersTable
}
