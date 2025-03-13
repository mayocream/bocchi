pub use sea_orm_migration::prelude::*;

mod m20250312_234447_user;
mod m20250313_011143_post;
mod m20250313_152347_like;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250312_234447_user::Migration),
            Box::new(m20250313_011143_post::Migration),
            Box::new(m20250313_152347_like::Migration),
        ]
    }
}
