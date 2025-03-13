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
                    .table(Mute::Table)
                    .if_not_exists()
                    .col(pk_auto(Mute::Id))
                    .col(integer(Mute::UserId))
                    .col(integer(Mute::MutedUserId))
                    .col(
                        timestamp_with_time_zone(Mute::CreatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_mute_user_id")
                    .from(Mute::Table, Mute::UserId)
                    .to(User::Table, User::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("fk_mute_muted_user_id")
                    .from(Mute::Table, Mute::MutedUserId)
                    .to(User::Table, User::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Mute::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Mute {
    Table,
    Id,
    UserId,
    MutedUserId,
    CreatedAt,
}
