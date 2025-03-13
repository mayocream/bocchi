use sea_orm_migration::{prelude::*, schema::*};

use crate::{m20250312_234447_user::User, m20250313_011143_post::Post};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Like::Table)
                    .if_not_exists()
                    .col(pk_auto(Like::Id))
                    .col(integer(Like::PostId))
                    .col(integer(Like::UserId))
                    .col(
                        timestamp_with_time_zone(Like::CreatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-like_post_id")
                            .from(Like::Table, Like::PostId)
                            .to(Post::Table, Post::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-like_user_id")
                            .from(Like::Table, Like::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .index(
                        Index::create()
                            .name("idx-like_post_id_user_id")
                            .table(Like::Table)
                            .col(Like::PostId)
                            .col(Like::UserId)
                            .unique(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Like::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Like {
    Table,
    Id,
    PostId,
    UserId,
    CreatedAt,
}
