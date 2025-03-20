use super::{
    SharedAppState,
    bocchi::{self, user_server::User},
};

mod auth;
mod follow;
mod profile;
mod search;

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
        auth::register(self, request).await
    }

    async fn login(
        &self,
        request: tonic::Request<bocchi::LoginRequest>,
    ) -> Result<tonic::Response<bocchi::AccessToken>, tonic::Status> {
        auth::login(self, request).await
    }

    async fn get_profile(
        &self,
        request: tonic::Request<bocchi::GetProfileRequest>,
    ) -> Result<tonic::Response<bocchi::GetProfileResponse>, tonic::Status> {
        profile::get_profile(self, request).await
    }

    async fn update_profile(
        &self,
        request: tonic::Request<bocchi::UpdateProfileRequest>,
    ) -> Result<tonic::Response<()>, tonic::Status> {
        profile::update_profile(self, request).await
    }

    async fn follow(
        &self,
        request: tonic::Request<bocchi::FollowRequest>,
    ) -> Result<tonic::Response<()>, tonic::Status> {
        follow::follow(self, request).await
    }

    async fn unfollow(
        &self,
        request: tonic::Request<bocchi::UnfollowRequest>,
    ) -> Result<tonic::Response<()>, tonic::Status> {
        follow::unfollow(self, request).await
    }

    async fn get_followers(
        &self,
        request: tonic::Request<bocchi::GetFollowersRequest>,
    ) -> Result<tonic::Response<bocchi::GetFollowersResponse>, tonic::Status> {
        follow::get_followers(self, request).await
    }

    async fn get_following(
        &self,
        request: tonic::Request<bocchi::GetFollowingRequest>,
    ) -> Result<tonic::Response<bocchi::GetFollowingResponse>, tonic::Status> {
        follow::get_following(self, request).await
    }

    async fn search(
        &self,
        request: tonic::Request<bocchi::SearchUserRequest>,
    ) -> Result<tonic::Response<bocchi::SearchUserResponse>, tonic::Status> {
        search::search(self, request).await
    }
}
