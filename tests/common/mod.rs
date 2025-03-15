use std::sync::Arc;

use bocchi::{jwt::Jwt, state::AppState, util::verifier::Verifier};
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
        jwt: Jwt::new("secret".into()),
        verifier: Verifier::new([0; 32]),
    })
}
