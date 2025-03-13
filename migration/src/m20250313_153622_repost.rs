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
                    .table(Repost::Table)
                    .if_not_exists()
                    .col(pk_auto(Repost::Id))
                    .col(integer(Repost::PostId))
                    .col(integer(Repost::UserId))
                    .col(
                        timestamp_with_time_zone(Repost::CreatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_repost_post_id")
                    .from(Repost::Table, Repost::PostId)
                    .to(Post::Table, Post::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_repost_user_id")
                    .from(Repost::Table, Repost::UserId)
                    .to(User::Table, User::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Repost::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Repost {
    Table,
    Id,
    PostId,
    UserId,
    CreatedAt,
}
