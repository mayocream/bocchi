use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(User::Table)
                    .if_not_exists()
                    .col(pk_auto(User::Id))
                    .col(string_uniq(User::Username))
                    .col(string_uniq(User::Email))
                    .col(boolean(User::EmailVerified).default(false))
                    .col(string(User::PasswordHash))
                    .col(string_null(User::Name))
                    .col(text_null(User::Bio))
                    .col(string_null(User::AvatarUrl))
                    .col(string_null(User::CoverUrl))
                    .col(
                        timestamp_with_time_zone(User::CreatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        timestamp_with_time_zone(User::UpdatedAt)
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(User::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum User {
    Table,
    Id,
    Username,
    Email,
    EmailVerified,
    PasswordHash,
    Name,
    Bio,
    AvatarUrl,
    CoverUrl,
    CreatedAt,
    UpdatedAt,
}
