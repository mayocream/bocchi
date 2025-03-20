use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250320_171214_users::User;

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
                    .col(integer(Follow::FollowerId))
                    .col(integer(Follow::FollowedId))
                    .col(
                        timestamp_with_time_zone(Follow::CreatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-follow_follower_id")
                            .from(Follow::Table, Follow::FollowerId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-follow_followed_id")
                            .from(Follow::Table, Follow::FollowedId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .index(
                        Index::create()
                            .name("idx-follow_follower_id_followed_id")
                            .table(Follow::Table)
                            .col(Follow::FollowerId)
                            .col(Follow::FollowedId)
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
    FollowerId,
    FollowedId,
    CreatedAt,
}
