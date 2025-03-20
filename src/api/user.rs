use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};
use sea_orm::{ActiveValue::Set, ColumnTrait, EntityTrait, QueryFilter};

use crate::entities::{self, user};

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
        user::Entity::insert(user)
            .exec(&self.state.database)
            .await
            .map_err(|e| {
                if e.sql_err().is_some() {
                    tonic::Status::already_exists("User already exists")
                } else {
                    tonic::Status::internal("Failed to insert user")
                }
            })?;

        let response = bocchi::AccessToken {
            token: "TODO".to_string(),
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
                Some(Handle::Username(username)) => user::Column::Username.contains(username),
                Some(Handle::Email(email)) => user::Column::Email.contains(email),
                None => return Err(tonic::Status::invalid_argument("No handle provided")),
            })
            .one(&self.state.database)
            .await
            .map_err(|_| tonic::Status::internal("Failed to find user"))?
            .ok_or_else(|| tonic::Status::not_found("User not found"))?;

        let argon2 = Argon2::default();
        let password_hash = PasswordHash::new(&user.password_hash)
            .map_err(|_| tonic::Status::internal("Failed to parse password hash"))?;
        argon2
            .verify_password(request.password.as_bytes(), &password_hash)
            .map_err(|_| tonic::Status::unauthenticated("Invalid password"))?;

        let response = bocchi::AccessToken {
            token: "TODO".to_string(),
        };

        Ok(tonic::Response::new(response))
    }
}
