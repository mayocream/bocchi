use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250312_234447_user::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Post::Table)
                    .if_not_exists()
                    .col(pk_auto(Post::Id))
                    .col(integer_null(Post::RepostId))
                    .col(integer_null(Post::ReplyId))
                    .col(string_null(Post::Content))
                    .col(integer(Post::OwnerId))
                    .col(
                        timestamp_with_time_zone(Post::CreatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        timestamp_with_time_zone(Post::UpdatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_post_owner_id")
                    .from(Post::Table, Post::OwnerId)
                    .to(User::Table, User::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_post_repost_id")
                    .from(Post::Table, Post::RepostId)
                    .to(Post::Table, Post::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_post_reply_id")
                    .from(Post::Table, Post::ReplyId)
                    .to(Post::Table, Post::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Post::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Post {
    Table,
    Id,
    RepostId,
    ReplyId,
    Content,
    OwnerId,
    CreatedAt,
    UpdatedAt,
}
