pub use sea_orm_migration::prelude::*;

mod m20250320_171214_users;
mod m20250320_172103_posts;
mod m20250320_172403_comments;
mod m20250320_172421_follows;
mod m20250320_172431_likes;
mod m20250320_172445_reposts;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250320_171214_users::Migration),
            Box::new(m20250320_172103_posts::Migration),
            Box::new(m20250320_172403_comments::Migration),
            Box::new(m20250320_172421_follows::Migration),
            Box::new(m20250320_172431_likes::Migration),
            Box::new(m20250320_172445_reposts::Migration),
        ]
    }
}
