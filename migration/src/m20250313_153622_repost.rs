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
                    .foreign_key(
                        ForeignKey::create()
                            .from(Repost::Table, Repost::PostId)
                            .to(Post::Table, Post::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(Repost::Table, Repost::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .index(
                        Index::create()
                            .table(Repost::Table)
                            .col(Repost::PostId)
                            .col(Repost::UserId)
                            .unique(),
                    )
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
