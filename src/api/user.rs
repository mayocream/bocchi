use crate::{
    proto::bocchi::{User, user_service_server::UserService},
    repositories::user,
    traits::{auth::Auth, datetime::TimestampConversion},
};

use super::SharedAppState;

#[derive(Debug)]
pub struct UserApi {
    state: SharedAppState,
}

impl UserApi {
    pub fn new(state: SharedAppState) -> Self {
        Self { state }
    }
}

#[tonic::async_trait]
impl UserService for UserApi {
    async fn get_user(
        &self,
        request: tonic::Request<crate::proto::bocchi::GetUserRequest>,
    ) -> Result<tonic::Response<crate::proto::bocchi::User>, tonic::Status> {
        let request = request.into_inner();
        let user = user::find_by_id(&self.state.db, request.id)
            .await
            .map_err(|_| tonic::Status::internal("Failed to get user"))?;

        let response = User {
            id: user.id,
            username: user.username,
            email: "".to_string(), // We don't want to expose the email
            created_at: Some(user.created_at.to_timestamp()),
            updated_at: Some(user.updated_at.to_timestamp()),
            uid: user.uid,
            email_verified: user.email_verified,
            name: user.name.unwrap_or_default(),
            bio: user.bio.unwrap_or_default(),
            avatar_url: user.avatar_url.unwrap_or_default(),
            cover_url: user.cover_url.unwrap_or_default(),
        };

        Ok(tonic::Response::new(response))
    }

    async fn create_user(
        &self,
        request: tonic::Request<crate::proto::bocchi::CreateUserRequest>,
    ) -> Result<tonic::Response<crate::proto::bocchi::User>, tonic::Status> {
        let uid = request.get_uid()?;
        // This api is called when user logged in with Firebase Auth and the user is not found in the database
        let request = request.into_inner();
        if uid != request.uid {
            return Err(tonic::Status::unauthenticated("Unauthorized"));
        }
        let user = sqlx::query!(
            "INSERT INTO users (uid, username, email, email_verified, name, bio, avatar_url, cover_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            request.uid,
            request.username,
            request.email,
            request.email_verified,
            request.name,
            request.bio,
            request.avatar_url,
            request.cover_url,
        ).fetch_one(&self.state.db).await.map_err(|_| tonic::Status::internal("Failed to create user"))?;

        let response = User {
            id: user.id,
            username: user.username,
            email: "".to_string(), // We don't want to expose the email
            created_at: Some(user.created_at.to_timestamp()),
            updated_at: Some(user.updated_at.to_timestamp()),
            uid: user.uid,
            email_verified: user.email_verified,
            name: user.name.unwrap_or_default(),
            bio: user.bio.unwrap_or_default(),
            avatar_url: user.avatar_url.unwrap_or_default(),
            cover_url: user.cover_url.unwrap_or_default(),
        };

        Ok(tonic::Response::new(response))
    }

    async fn update_user(
        &self,
        request: tonic::Request<crate::proto::bocchi::UpdateUserRequest>,
    ) -> Result<tonic::Response<crate::proto::bocchi::User>, tonic::Status> {
        let uid = request.get_uid()?;
        // This api is called when user logged in with Firebase Auth and the user is not found in the database
        let request = request.into_inner();
        let user = sqlx::query!(
            "UPDATE users SET name = $1, bio = $2, avatar_url = $3, cover_url = $4 WHERE uid = $5 RETURNING *",
            request.name,
            request.bio,
            request.avatar_url,
            request.cover_url,
            uid,
        ).fetch_one(&self.state.db).await.map_err(|_| tonic::Status::internal("Failed to update user"))?;

        let response = User {
            id: user.id,
            username: user.username,
            email: "".to_string(), // We don't want to expose the email
            created_at: Some(user.created_at.to_timestamp()),
            updated_at: Some(user.updated_at.to_timestamp()),
            uid: user.uid,
            email_verified: user.email_verified,
            name: user.name.unwrap_or_default(),
            bio: user.bio.unwrap_or_default(),
            avatar_url: user.avatar_url.unwrap_or_default(),
            cover_url: user.cover_url.unwrap_or_default(),
        };

        Ok(tonic::Response::new(response))
    }

    async fn delete_user(
        &self,
        request: tonic::Request<crate::proto::bocchi::DeleteUserRequest>,
    ) -> Result<tonic::Response<()>, tonic::Status> {
        let uid = request.get_uid()?;
        sqlx::query!("DELETE FROM users WHERE uid = $1", uid)
            .fetch_one(&self.state.db)
            .await
            .map_err(|_| tonic::Status::internal("Failed to delete user"))?;

        Ok(tonic::Response::new(()))
    }
}
