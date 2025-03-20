use std::sync::Arc;

use bocchi::{
    api::{AppState, SharedAppState, bocchi::user_server::User},
    jwt::Jwt,
};
use migrations::{Migrator, MigratorTrait};
use sea_orm::Database;

pub async fn setup() -> SharedAppState {
    let state = Arc::new(AppState {
        database: Database::connect("sqlite::memory:").await.unwrap(),
        jwt: Jwt::new("secret".to_string()),
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
