use argon2::{
    Argon2,
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString, rand_core::OsRng},
};
use sea_orm::{ActiveValue::Set, ColumnTrait, Condition, EntityTrait, QueryFilter, QuerySelect};

use crate::{
    entities::{follow, user},
    jwt::Claims,
};

use super::{
    Auth, SharedAppState,
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

    async fn get_profile(
        &self,
        request: tonic::Request<bocchi::GetProfileRequest>,
    ) -> Result<tonic::Response<bocchi::GetProfileResponse>, tonic::Status> {
        let request = request.into_inner();
        let user = user::Entity::find_by_id(request.id)
            .one(&self.state.database)
            .await
            .map_err(|e| tonic::Status::internal(e.to_string()))?
            .ok_or_else(|| tonic::Status::not_found("User not found"))?;

        let response = bocchi::GetProfileResponse {
            id: user.id,
            username: user.username,
            name: user.name.unwrap_or_default(),
            bio: user.bio.unwrap_or_default(),
            avatar_url: user.avatar_url.unwrap_or_default(),
            cover_url: user.cover_url.unwrap_or_default(),
        };

        Ok(tonic::Response::new(response))
    }

    async fn update_profile(
        &self,
        request: tonic::Request<bocchi::UpdateProfileRequest>,
    ) -> Result<tonic::Response<()>, tonic::Status> {
        let user_id = self.state.extract_user_id(&request)?;
        let request = request.into_inner();
        let user = user::Entity::find_by_id(user_id)
            .one(&self.state.database)
            .await
            .map_err(|e| tonic::Status::internal(e.to_string()))?
            .ok_or_else(|| tonic::Status::not_found("User not found"))?;

        let user = user::ActiveModel {
            name: Set(Some(request.name)),
            bio: Set(Some(request.bio)),
            avatar_url: Set(Some(request.avatar_url)),
            cover_url: Set(Some(request.cover_url)),
            ..user.into()
        };
        user::Entity::update(user)
            .exec(&self.state.database)
            .await
            .map_err(|e| tonic::Status::internal(e.to_string()))?;

        Ok(tonic::Response::new(()))
    }

    async fn follow(
        &self,
        request: tonic::Request<bocchi::FollowRequest>,
    ) -> Result<tonic::Response<()>, tonic::Status> {
        let user_id = self.state.extract_user_id(&request)?;
        let request = request.into_inner();

        let follow = follow::ActiveModel {
            follower_id: Set(user_id),
            followed_id: Set(request.user_id),
            ..Default::default()
        };
        follow::Entity::insert(follow)
            .exec(&self.state.database)
            .await
            .map_err(|e| {
                if e.sql_err().is_some() {
                    tonic::Status::already_exists("Already following")
                } else {
                    tonic::Status::internal(e.to_string())
                }
            })?;

        Ok(tonic::Response::new(()))
    }

    async fn unfollow(
        &self,
        request: tonic::Request<bocchi::UnfollowRequest>,
    ) -> Result<tonic::Response<()>, tonic::Status> {
        let user_id = self.state.extract_user_id(&request)?;
        let request = request.into_inner();

        let follow = follow::ActiveModel {
            follower_id: Set(user_id),
            followed_id: Set(request.user_id),
            ..Default::default()
        };
        follow::Entity::delete(follow)
            .exec(&self.state.database)
            .await
            .map_err(|e| tonic::Status::internal(e.to_string()))?;

        Ok(tonic::Response::new(()))
    }

    async fn get_followers(
        &self,
        request: tonic::Request<bocchi::GetFollowersRequest>,
    ) -> Result<tonic::Response<bocchi::GetFollowersResponse>, tonic::Status> {
        let request = request.into_inner();
        let follows = follow::Entity::find()
            .filter(follow::Column::FollowedId.eq(request.user_id))
            .cursor_by(follow::Column::Id)
            .after(request.cursor.clone())
            .first(50)
            .all(&self.state.database)
            .await
            .map_err(|e| tonic::Status::internal(e.to_string()))?;

        let followers = follows.iter().map(|f| f.follower_id).collect();

        let response = bocchi::GetFollowersResponse {
            followers,
            next_cursor: follows.last().map(|f| f.id).unwrap_or_default(),
        };

        Ok(tonic::Response::new(response))
    }

    async fn get_following(
        &self,
        request: tonic::Request<bocchi::GetFollowingRequest>,
    ) -> Result<tonic::Response<bocchi::GetFollowingResponse>, tonic::Status> {
        let request = request.into_inner();
        let follows = follow::Entity::find()
            .filter(follow::Column::FollowerId.eq(request.user_id))
            .cursor_by(follow::Column::Id)
            .after(request.cursor.clone())
            .first(50)
            .all(&self.state.database)
            .await
            .map_err(|e| tonic::Status::internal(e.to_string()))?;

        let following = follows.iter().map(|f| f.followed_id).collect();
        let response = bocchi::GetFollowingResponse {
            following,
            next_cursor: follows.last().map(|f| f.id).unwrap_or_default(),
        };
        Ok(tonic::Response::new(response))
    }

    async fn search(
        &self,
        request: tonic::Request<bocchi::SearchUserRequest>,
    ) -> Result<tonic::Response<bocchi::SearchUserResponse>, tonic::Status> {
        let request = request.into_inner();
        let users = user::Entity::find()
            .filter(
                Condition::any()
                    .add(user::Column::Username.contains(request.query.clone()))
                    .add(user::Column::Name.contains(request.query)),
            )
            .limit(50)
            .all(&self.state.database)
            .await
            .map_err(|e| tonic::Status::internal(e.to_string()))?;

        let users = users.iter().map(|u| u.id).collect();

        let response = bocchi::SearchUserResponse {
            users,
            next_cursor: 0,
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

    async fn setup(feed: bool) -> Arc<AppState> {
        let state = Arc::new(AppState {
            database: Database::connect("sqlite::memory:")
                .await
                .expect("Failed to connect to database"),
            jwt: Jwt::new("secret".to_string()),
        });
        migrations::Migrator::up(&state.database, None)
            .await
            .expect("Failed to run migrations");

        if feed {
            // register a user
            let request = bocchi::RegisterRequest {
                username: "username".to_string(),
                email: "test@example.com".to_string(),
                password: "password".to_string(),
            };
            let service = UserService::new(state.clone());
            service
                .register(tonic::Request::new(request))
                .await
                .expect("Failed to register");
        }

        state
    }

    #[tokio::test]
    async fn test_register() {
        let state = setup(false).await;
        let service = UserService::new(state);

        let request = bocchi::RegisterRequest {
            username: "username".to_string(),
            email: "test@example.com".to_string(),
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
            email: "test@example.com".to_string(),
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
        let state = setup(false).await;
        let service = UserService::new(state.clone());

        let request = bocchi::RegisterRequest {
            username: "username".to_string(),
            email: "test@example.com".to_string(),
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

    #[tokio::test]
    async fn test_get_profile() {
        let state = setup(true).await;
        let service = UserService::new(state.clone());

        let request = bocchi::GetProfileRequest { id: 1 };
        let response = service
            .get_profile(tonic::Request::new(request))
            .await
            .expect("Failed to get profile");
        assert_eq!(response.get_ref().id, 1);

        // Get profile of non-existing user should fail
        let request = bocchi::GetProfileRequest { id: 2 };
        let response = service
            .get_profile(tonic::Request::new(request))
            .await
            .expect_err("Getting profile of non-existing user should fail");
        assert_eq!(response.code(), tonic::Code::NotFound);
    }

    #[tokio::test]
    async fn test_update_profile() {
        let state = setup(true).await;
        let service = UserService::new(state.clone());

        let request = bocchi::UpdateProfileRequest {
            name: "Name".to_string(),
            bio: "Bio".to_string(),
            avatar_url: "avatar_url".to_string(),
            cover_url: "cover_url".to_string(),
        };
        let response = service
            .update_profile(tonic::Request::new(request))
            .await
            .expect_err("Updating profile without token should fail");
        assert_eq!(response.code(), tonic::Code::Unauthenticated);

        let token = state
            .jwt
            .encode(Claims {
                user_id: 1,
                exp: (chrono::Utc::now() + chrono::Duration::days(365)).timestamp() as usize,
            })
            .expect("Failed to encode token");
        let request = bocchi::UpdateProfileRequest {
            name: "Name".to_string(),
            bio: "Bio".to_string(),
            avatar_url: "avatar_url".to_string(),
            cover_url: "cover_url".to_string(),
        };
        let mut request = tonic::Request::new(request);
        request.metadata_mut().insert(
            "authorization",
            token.parse().expect("Failed to parse token"),
        );
        service
            .update_profile(request)
            .await
            .expect("Failed to update profile");

        let request = bocchi::GetProfileRequest { id: 1 };
        let response = service
            .get_profile(tonic::Request::new(request))
            .await
            .expect("Failed to get profile");
        let response = response.get_ref();
        assert_eq!(response.name, "Name");
        assert_eq!(response.bio, "Bio");
        assert_eq!(response.avatar_url, "avatar_url");
        assert_eq!(response.cover_url, "cover_url");
    }

    #[tokio::test]
    async fn test_follow() {
        let state = setup(true).await;
        let service = UserService::new(state.clone());

        let token = state
            .jwt
            .encode(Claims {
                user_id: 1,
                exp: (chrono::Utc::now() + chrono::Duration::days(365)).timestamp() as usize,
            })
            .expect("Failed to encode token");
        let request = bocchi::FollowRequest { user_id: 1 };
        let mut request = tonic::Request::new(request);
        request.metadata_mut().insert(
            "authorization",
            token.parse().expect("Failed to parse token"),
        );
        service.follow(request).await.expect("Failed to follow");

        let request = bocchi::GetFollowersRequest {
            user_id: 1,
            cursor: 0,
        };
        let response = service
            .get_followers(tonic::Request::new(request))
            .await
            .expect("Failed to get followers");
        let response = response.get_ref();
        assert_eq!(response.followers, vec![1]);
    }
}
