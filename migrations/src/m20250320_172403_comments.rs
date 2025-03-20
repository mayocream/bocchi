use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20250320_171214_users::User, m20250320_172103_posts::Post};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Comment::Table)
                    .if_not_exists()
                    .col(pk_auto(Comment::Id))
                    .col(integer(Comment::UserId))
                    .col(integer(Comment::PostId))
                    .col(string(Comment::Content))
                    .col(
                        timestamp_with_time_zone(Comment::CreatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        timestamp_with_time_zone(Comment::UpdatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-comment_user_id")
                            .from(Comment::Table, Comment::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-comment_post_id")
                            .from(Comment::Table, Comment::PostId)
                            .to(Post::Table, Post::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Comment::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Comment {
    Table,
    Id,
    UserId,
    PostId,
    Content,
    CreatedAt,
    UpdatedAt,
}
