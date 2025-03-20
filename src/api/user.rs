use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};
use sea_orm::{ActiveValue::Set, ColumnTrait, EntityTrait, QueryFilter};

use crate::{entities::user, jwt::Claims};

use super::{
    SharedAppState,
    bocchi::{self, login_request::Handle, user_server::User},
};

#[derive(Debug)]
pub struct UserService {
    state: SharedAppState,
}

impl UserService {
    pub fn new(state: SharedAppState) -> Self {
        Self { state }
    }
}

#[tonic::async_trait]
impl User for UserService {
    async fn register(
        &self,
        request: tonic::Request<bocchi::RegisterRequest>,
    ) -> Result<tonic::Response<bocchi::AccessToken>, tonic::Status> {
        let request = request.into_inner();
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = argon2
            .hash_password(request.password.as_bytes(), &salt)
            .map_err(|_| tonic::Status::internal("Failed to hash password"))?;

        let user = user::ActiveModel {
            username: Set(request.username),
            email: Set(request.email),
            password_hash: Set(password_hash.to_string()),
            ..Default::default()
        };
        let user = user::Entity::insert(user)
            .exec(&self.state.database)
            .await
            .map_err(|e| {
                if e.sql_err().is_some() {
                    tonic::Status::already_exists("User already exists")
                } else {
                    tonic::Status::internal(e.to_string())
                }
            })?;

        let response = bocchi::AccessToken {
            token: self
                .state
                .jwt
                .encode(Claims {
                    user_id: user.last_insert_id,
                    exp: (chrono::Utc::now() + chrono::Duration::days(365)).timestamp() as usize,
                })
                .map_err(|_| tonic::Status::internal("Failed to encode token"))?,
        };

        Ok(tonic::Response::new(response))
    }

    async fn login(
        &self,
        request: tonic::Request<bocchi::LoginRequest>,
    ) -> Result<tonic::Response<bocchi::AccessToken>, tonic::Status> {
        let request = request.into_inner();
        let user = user::Entity::find()
            .filter(match request.handle {
                Some(Handle::Username(username)) => user::Column::Username.eq(username),
                Some(Handle::Email(email)) => user::Column::Email.eq(email),
                None => return Err(tonic::Status::invalid_argument("No handle provided")),
            })
            .one(&self.state.database)
            .await
            .map_err(|e| tonic::Status::internal(e.to_string()))?
            .ok_or_else(|| tonic::Status::not_found("User not found"))?;

        let argon2 = Argon2::default();
        let password_hash = PasswordHash::new(&user.password_hash)
            .map_err(|_| tonic::Status::internal("Failed to parse password hash"))?;
        argon2
            .verify_password(request.password.as_bytes(), &password_hash)
            .map_err(|_| tonic::Status::unauthenticated("Invalid password"))?;

        let response = bocchi::AccessToken {
            token: self
                .state
                .jwt
                .encode(Claims {
                    user_id: user.id,
                    exp: (chrono::Utc::now() + chrono::Duration::days(365)).timestamp() as usize,
                })
                .map_err(|_| tonic::Status::internal("Failed to encode token"))?,
        };

        Ok(tonic::Response::new(response))
    }
}

#[cfg(test)]
mod tests {
    use migrations::MigratorTrait;
    use sea_orm::Database;

    use super::*;
    use crate::{api::AppState, jwt::Jwt};
    use std::sync::Arc;

    async fn setup() -> Arc<AppState> {
        let state = Arc::new(AppState {
            config: Default::default(),
            database: Database::connect("sqlite::memory:")
                .await
                .expect("Failed to connect to database"),
            jwt: Jwt::new("secret".to_string()),
        });
        migrations::Migrator::up(&state.database, None)
            .await
            .expect("Failed to run migrations");
        state
    }

    #[tokio::test]
    async fn test_register() {
        let state = setup().await;
        let service = UserService::new(state);

        let request = bocchi::RegisterRequest {
            username: "username".to_string(),
            email: "email".to_string(),
            password: "password".to_string(),
        };
        let response = service
            .register(tonic::Request::new(request))
            .await
            .expect("Failed to register");
        assert!(!response.get_ref().token.is_empty());

        // Inserting the same user should fail
        let request = bocchi::RegisterRequest {
            username: "username".to_string(),
            email: "email".to_string(),
            password: "password".to_string(),
        };
        let response = service
            .register(tonic::Request::new(request))
            .await
            .expect_err("Registering the same user should fail");
        assert_eq!(response.code(), tonic::Code::AlreadyExists);
    }

    #[tokio::test]
    async fn test_login() {
        let state = setup().await;
        let service = UserService::new(state.clone());

        let request = bocchi::RegisterRequest {
            username: "username".to_string(),
            email: "email".to_string(),
            password: "password".to_string(),
        };
        service
            .register(tonic::Request::new(request))
            .await
            .expect("Failed to register");

        let request = bocchi::LoginRequest {
            handle: Some(Handle::Username("username".to_string())),
            password: "password".to_string(),
        };
        let response = service
            .login(tonic::Request::new(request))
            .await
            .expect("Failed to login");
        assert!(!response.get_ref().token.is_empty());

        // Login with wrong password should fail
        let request = bocchi::LoginRequest {
            handle: Some(Handle::Username("username".to_string())),
            password: "wrong".to_string(),
        };
        let response = service
            .login(tonic::Request::new(request))
            .await
            .expect_err("Login with wrong password should fail");
        assert_eq!(response.code(), tonic::Code::Unauthenticated);
    }
}
