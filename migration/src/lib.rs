pub use sea_orm_migration::prelude::*;

mod m20250312_234447_user;
mod m20250313_011143_post;
mod m20250313_152347_like;
mod m20250313_153622_repost;
mod m20250313_154116_quote;
mod m20250313_154535_media;
mod m20250313_155204_block;
mod m20250313_155215_mute;
mod m20250313_185546_follow;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250312_234447_user::Migration),
            Box::new(m20250313_011143_post::Migration),
            Box::new(m20250313_152347_like::Migration),
            Box::new(m20250313_153622_repost::Migration),
            Box::new(m20250313_154116_quote::Migration),
            Box::new(m20250313_154535_media::Migration),
            Box::new(m20250313_155204_block::Migration),
            Box::new(m20250313_155215_mute::Migration),
            Box::new(m20250313_185546_follow::Migration),
        ]
    }
}
