use entity::user;
use sea_orm::{ActiveValue::Set, EntityTrait, IntoActiveModel};

use crate::{
    bocchi::{Profile, UpdateProfileRequest, account_server::Account},
    state::SharedAppState,
    util::request::extract_user_id_from_request,
};

#[derive(Debug)]
pub struct AccountService {
    state: SharedAppState,
}

impl AccountService {
    pub fn new(state: SharedAppState) -> Self {
        AccountService { state }
    }
}

#[tonic::async_trait]
impl Account for AccountService {
    async fn get_profile(
        &self,
        request: tonic::Request<()>,
    ) -> Result<tonic::Response<Profile>, tonic::Status> {
        let user_id = extract_user_id_from_request(&self.state.token, &request)?;
        let user = user::Entity::find_by_id(user_id as i32)
            .one(&self.state.db)
            .await
            .map_err(|_| tonic::Status::internal("Failed to fetch user"))?
            .ok_or_else(|| tonic::Status::not_found("User not found"))?;
        let profile = Profile {
            username: user.username,
            name: user.name.unwrap_or_default(),
            bio: user.bio.unwrap_or_default(),
            avatar_url: user.avatar_url.unwrap_or_default(),
            banner_url: user.banner_url.unwrap_or_default(),
        };
        Ok(tonic::Response::new(profile))
    }

    async fn update_profile(
        &self,
        request: tonic::Request<UpdateProfileRequest>,
    ) -> Result<tonic::Response<()>, tonic::Status> {
        let user_id = extract_user_id_from_request(&self.state.token, &request)?;
        let profile = request.into_inner();
        let user = user::Entity::find_by_id(user_id as i32)
            .one(&self.state.db)
            .await
            .map_err(|_| tonic::Status::internal("Failed to fetch user"))?
            .ok_or_else(|| tonic::Status::not_found("User not found"))?;

        let mut user = user.into_active_model();
        user.name = Set(Some(profile.name));
        user.bio = Set(Some(profile.bio));
        user.avatar_url = Set(Some(profile.avatar_url));
        user.banner_url = Set(Some(profile.banner_url));

        user::Entity::update(user)
            .exec(&self.state.db)
            .await
            .map_err(|_| tonic::Status::internal("Failed to update user"))?;

        Ok(tonic::Response::new(()))
    }
}
