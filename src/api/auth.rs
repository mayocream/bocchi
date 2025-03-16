use argon2::{
    Argon2, PasswordHash,
    password_hash::{PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};
use entity::user;
use sea_orm::{ActiveValue::Set, EntityTrait, QueryFilter, entity::*};
use serde::Deserialize;
use tonic::{Request, Response, Status};
use tracing::error;
use validator::Validate;

use crate::{
    bocchi::{
        LoginRequest, LoginResponse, RegisterRequest, VerifyEmailRequest,
        authentication_server::Authentication, login_request::Handle,
    },
    state::SharedAppState,
    util::{request::extract_user_id_from_request, username::validate_username},
};

#[derive(Debug)]
pub struct AuthenticationService {
    state: SharedAppState,
}

impl AuthenticationService {
    pub fn new(state: SharedAppState) -> Self {
        Self { state }
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
impl Authentication for AuthenticationService {
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
            .one(&self.state.db)
            .await
            .map_err(|_| Status::internal("Failed to query user"))?
            .ok_or_else(|| Status::not_found("User not found"))?;

        let password_hash = PasswordHash::new(&user.password_hash)
            .map_err(|_| Status::internal("Failed to parse password hash"))?;
        Argon2::default()
            .verify_password(request.password.as_bytes(), &password_hash)
            .map_err(|e| Status::invalid_argument(e.to_string()))?;

        let token = self
            .state
            .token
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
            .exec(&self.state.db)
            .await
            .map_err(|e| {
                if e.sql_err().is_some() {
                    Status::already_exists("User already exists")
                } else {
                    error!("Failed to insert user: {:?}", e);
                    Status::internal("Failed to insert user")
                }
            })?;

        Ok(Response::new(()))
    }

    #[tracing::instrument]
    async fn send_verification_email(&self, request: Request<()>) -> Result<Response<()>, Status> {
        let user_id = extract_user_id_from_request(&self.state.token, &request)?;
        let user = user::Entity::find()
            .filter(user::Column::Id.eq(user_id as i32))
            .one(&self.state.db)
            .await
            .map_err(|_| Status::internal("Failed to query user"))?
            .ok_or_else(|| Status::not_found("User not found"))?;

        let verification_token = self.state.hasher.generate_time_based_verification_code(user.id.to_string().as_str());

        self.state
            .mail
            .send_email(
                user.email.as_str(),
                "[Bocchi Social] Please verify your email address",
                format!(
                    "Please verify your email address by enter the following code: {}",
                    verification_token
                )
                .as_str(),
            )
            .await
            .map_err(|_| Status::internal("Failed to send verification email"))?;

        Ok(Response::new(()))
    }

    #[tracing::instrument]
    async fn verify_email(
        &self,
        request: Request<VerifyEmailRequest>,
    ) -> Result<Response<()>, Status> {
        let user_id = extract_user_id_from_request(&self.state.token, &request)?;
        let user = user::Entity::find()
            .filter(user::Column::Id.eq(user_id as i32))
            .one(&self.state.db)
            .await
            .map_err(|_| Status::internal("Failed to query user"))?
            .ok_or_else(|| Status::not_found("User not found"))?;

        let request = request.into_inner();
        if !self
            .state
            .hasher
            .check_verification_code(user.id.to_string().as_str(), request.code)
        {
            return Err(Status::invalid_argument("Invalid verification token"));
        }

        let mut user = user.into_active_model();
        user.email_verified = Set(true);

        user::Entity::update(user)
            .exec(&self.state.db)
            .await
            .map_err(|_| Status::internal("Failed to update user"))?;

        Ok(Response::new(()))
    }
}
