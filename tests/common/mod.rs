use std::sync::Arc;

use bocchi::{
    api::{AppState, SharedAppState, bocchi::user_server::User},
    config::Config,
    jwt::Jwt,
    storage::s3::S3,
};
use migrations::{Migrator, MigratorTrait};
use sea_orm::Database;

pub async fn setup() -> SharedAppState {
    let s3 = S3::new(Config {
        s3_bucket: "test".to_string(),
        s3_region: "us-east-1".to_string(),
        s3_access_key_id: "minioadmin".to_string(),
        s3_secret_access_key: "minioadmin".to_string(),
        s3_endpoint: "http://localhost:9000".to_string(),
        s3_force_path_style: true,
        ..Default::default()
    })
    .await
    .unwrap();

    let state = Arc::new(AppState {
        config: Config {
            s3_public_url: "http://localhost:9000/test".to_string(),
            ..Default::default()
        },
        database: Database::connect("sqlite::memory:").await.unwrap(),
        jwt: Jwt::new("secret".to_string()),
        s3,
    });

    // Run migrations
    Migrator::up(&state.database, None).await.unwrap();

    state
}

pub async fn register(
    state: &SharedAppState,
    email: &str,
    username: &str,
    password: &str,
) -> String {
    let service = bocchi::api::user::UserService::new(state.clone());
    let request = bocchi::api::bocchi::RegisterRequest {
        email: email.to_string(),
        username: username.to_string(),
        password: password.to_string(),
    };
    let response = service
        .register(tonic::Request::new(request))
        .await
        .unwrap();
    response.into_inner().token
}
