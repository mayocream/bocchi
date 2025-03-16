use std::sync::Arc;

use bocchi::{hasher::Hasher, state::AppState, token::Token};
use migration::{Migrator, MigratorTrait};
use sea_orm::Database;

pub async fn setup() -> Arc<AppState> {
    let db = Database::connect("sqlite::memory:")
        .await
        .expect("Failed to connect to database");
    Migrator::up(&db, None)
        .await
        .expect("Failed to run migrations");

    Arc::new(AppState {
        db,
        mail: bocchi::mail::EmailProvider::Noop,
        token: Token::new("secret".into()),
        hasher: Hasher::new([0; 32]),
    })
}
