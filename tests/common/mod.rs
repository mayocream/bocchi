use std::sync::Arc;

use bocchi::{config::Config, hasher::Hasher, state::AppState, storage::s3::S3, token::Token};
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
        config: bocchi::config::Config::default(),
        db,
        mail: bocchi::mail::EmailProvider::Noop,
        token: Token::new("secret".into()),
        hasher: Hasher::new([0; 32]),
        s3: S3::new(&Config {
            s3_access_key_id: "minio".into(),
            s3_secret_access_key: "secret_key".into(),
            s3_region: "us-east-1".into(),
            s3_bucket: "bocchi".into(),
            s3_endpoint: "http://localhost:9000".into(),
            s3_public_url: "http://localhost:9000".into(),
            ..Default::default()
        })
        .await,
    })
}
