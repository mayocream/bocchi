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
                    .table(Follow::Table)
                    .if_not_exists()
                    .col(pk_auto(Follow::Id))
                    .col(integer(Follow::UserId))
                    .col(integer(Follow::FollowedUserId))
                    .col(
                        timestamp_with_time_zone(Follow::CreatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(Follow::Table, Follow::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(Follow::Table, Follow::FollowedUserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .index(
                        Index::create()
                            .table(Follow::Table)
                            .col(Follow::UserId)
                            .col(Follow::FollowedUserId)
                            .unique(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Follow::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Follow {
    Table,
    Id,
    UserId,
    FollowedUserId,
    CreatedAt,
}
