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
                    .table(Quote::Table)
                    .if_not_exists()
                    .col(pk_auto(Quote::Id))
                    .col(integer(Quote::PostId))
                    .col(integer(Quote::UserId))
                    .col(text(Quote::Content))
                    .col(
                        timestamp_with_time_zone(Quote::CreatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        timestamp_with_time_zone(Quote::UpdatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_quote_post_id")
                    .from(Quote::Table, Quote::PostId)
                    .to(Post::Table, Post::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_quote_user_id")
                    .from(Quote::Table, Quote::UserId)
                    .to(User::Table, User::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Quote::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Quote {
    Table,
    Id,
    PostId,
    UserId,
    Content,
    CreatedAt,
    UpdatedAt,
}
