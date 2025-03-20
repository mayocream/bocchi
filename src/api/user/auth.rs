use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};
use sea_orm::{ActiveValue::Set, ColumnTrait, EntityTrait, QueryFilter};

use crate::{
    api::bocchi::{self, login_request::Handle},
    entities::user,
    jwt::Claims,
};

use super::UserService;

pub async fn register(
    service: &UserService,
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
        .exec(&service.state.database)
        .await
        .map_err(|e| {
            if e.sql_err().is_some() {
                tonic::Status::already_exists("User already exists")
            } else {
                tonic::Status::internal(e.to_string())
            }
        })?;

    let response = bocchi::AccessToken {
        token: service
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

pub async fn login(
    service: &UserService,
    request: tonic::Request<bocchi::LoginRequest>,
) -> Result<tonic::Response<bocchi::AccessToken>, tonic::Status> {
    let request = request.into_inner();
    let user = user::Entity::find()
        .filter(match request.handle {
            Some(Handle::Username(username)) => user::Column::Username.eq(username),
            Some(Handle::Email(email)) => user::Column::Email.eq(email),
            None => return Err(tonic::Status::invalid_argument("No handle provided")),
        })
        .one(&service.state.database)
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
        token: service
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
