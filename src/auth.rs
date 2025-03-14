use argon2::{
    Argon2, PasswordHash,
    password_hash::{PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};
use entity::user;
use sea_orm::{ActiveValue::Set, DatabaseConnection, EntityTrait, QueryFilter, entity::*};
use serde::Deserialize;
use tonic::{Request, Response, Status};
use validator::Validate;

use crate::{
    bocchi::{
        LoginRequest, LoginResponse, RegisterRequest, VerifyEmailRequest,
        authentication_server::Authentication, login_request::Handle,
    },
    jwt::Jwt,
    mailgun::Mailgun,
    util::{username::validate_username, verifier::Verifier},
};

#[derive(Debug)]
pub struct AuthenticationSerivce {
    db: DatabaseConnection,
    mailgun: Mailgun,
    jwt: Jwt,
    verifier: Verifier,
}

impl AuthenticationSerivce {
    pub fn new(db: DatabaseConnection, mailgun: Mailgun, jwt: Jwt, verifier: Verifier) -> Self {
        Self {
            db,
            mailgun,
            jwt,
            verifier,
        }
    }
}

#[derive(Debug, Validate, Deserialize)]
struct RegisterRequestValidator<'a> {
    #[validate(length(min = 3, max = 20), custom(function = "validate_username"))]
    username: &'a str,
    #[validate(email)]
    email: &'a str,
    #[validate(length(min = 8, max = 255))]
    password: &'a str,
}

#[tonic::async_trait]
impl Authentication for AuthenticationSerivce {
    #[tracing::instrument]
    async fn login(
        &self,
        request: Request<LoginRequest>,
    ) -> Result<Response<LoginResponse>, Status> {
        let request = request.into_inner();
        let handle = request
            .handle
            .ok_or_else(|| Status::invalid_argument("Handle is missing"))?;
        let user = user::Entity::find()
            .filter(match handle {
                Handle::Username(username) => user::Column::Username.eq(username),
                Handle::Email(email) => user::Column::Email.eq(email),
            })
            .one(&self.db)
            .await
            .map_err(|_| Status::internal("Failed to query user"))?
            .ok_or_else(|| Status::not_found("User not found"))?;

        let password_hash = PasswordHash::new(&user.password_hash)
            .map_err(|_| Status::internal("Failed to parse password hash"))?;
        Argon2::default()
            .verify_password(request.password.as_bytes(), &password_hash)
            .map_err(|e| Status::invalid_argument(e.to_string()))?;

        let token = self
            .jwt
            .generate_token(user.id as usize)
            .map_err(|_| Status::internal("Failed to generate token"))?;
        Ok(Response::new(LoginResponse {
            access_token: token,
        }))
    }

    #[tracing::instrument]
    async fn register(&self, request: Request<RegisterRequest>) -> Result<Response<()>, Status> {
        let request = request.into_inner();
        let validator = RegisterRequestValidator {
            username: &request.username,
            email: &request.email,
            password: &request.password,
        };
        validator
            .validate()
            .map_err(|e| Status::invalid_argument(e.to_string()))?;

        let salt = SaltString::generate(&mut OsRng);
        let password_hash = Argon2::default()
            .hash_password(request.password.as_bytes(), &salt)
            .map_err(|_| Status::internal("Failed to hash password"))?;

        let data = user::ActiveModel {
            username: Set(request.username),
            email: Set(request.email),
            password_hash: Set(password_hash.to_string()),
            ..Default::default()
        };
        user::Entity::insert(data)
            .exec(&self.db)
            .await
            .map_err(|_| Status::internal("Failed to insert user into database"))?;

        Ok(Response::new(()))
    }

    #[tracing::instrument]
    async fn send_verification_email(&self, request: Request<()>) -> Result<Response<()>, Status> {
        let token = request
            .metadata()
            .get("authorization")
            .ok_or_else(|| Status::unauthenticated("Authorization header is missing"))?
            .to_str()
            .map_err(|_| Status::unauthenticated("Invalid authorization header"))?;
        let user_id = self
            .jwt
            .verify_token(token)
            .map_err(|_| Status::unauthenticated("Invalid token"))?;
        let user = user::Entity::find()
            .filter(user::Column::Id.eq(user_id as i32))
            .one(&self.db)
            .await
            .map_err(|_| Status::internal("Failed to query user"))?
            .ok_or_else(|| Status::not_found("User not found"))?;

        let verification_token = self.verifier.generate(user.id.to_string().as_str());

        self.mailgun
            .send_verification_email(user.email.as_str(), verification_token.to_string().as_str())
            .await
            .map_err(|_| Status::internal("Failed to send verification email"))?;

        Ok(Response::new(()))
    }

    #[tracing::instrument]
    async fn verify_email(
        &self,
        request: Request<VerifyEmailRequest>,
    ) -> Result<Response<()>, Status> {
        let token = request
            .metadata()
            .get("authorization")
            .ok_or_else(|| Status::unauthenticated("Authorization header is missing"))?
            .to_str()
            .map_err(|_| Status::unauthenticated("Invalid authorization header"))?;
        let user_id = self
            .jwt
            .verify_token(token)
            .map_err(|_| Status::unauthenticated("Invalid token"))?;
        let user = user::Entity::find()
            .filter(user::Column::Id.eq(user_id as i32))
            .one(&self.db)
            .await
            .map_err(|_| Status::internal("Failed to query user"))?
            .ok_or_else(|| Status::not_found("User not found"))?;

        let request = request.into_inner();
        if !self
            .verifier
            .verify(user.id.to_string().as_str(), request.code)
        {
            return Err(Status::invalid_argument("Invalid verification token"));
        }

        let user = user::ActiveModel {
            email_verified: Set(true),
            ..Default::default()
        };

        user::Entity::update(user)
            .filter(user::Column::Id.eq(user_id as i32))
            .exec(&self.db)
            .await
            .map_err(|_| Status::internal("Failed to update user"))?;

        Ok(Response::new(()))
    }
}
