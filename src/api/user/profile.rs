use sea_orm::{ActiveValue::Set, EntityTrait};

use crate::{
    api::{Auth, bocchi},
    entities::user,
};

use super::UserService;

pub async fn get_profile(
    service: &UserService,
    request: tonic::Request<bocchi::GetProfileRequest>,
) -> Result<tonic::Response<bocchi::GetProfileResponse>, tonic::Status> {
    let request = request.into_inner();
    let user = user::Entity::find_by_id(request.id)
        .one(&service.state.database)
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

pub async fn update_profile(
    service: &UserService,
    request: tonic::Request<bocchi::UpdateProfileRequest>,
) -> Result<tonic::Response<()>, tonic::Status> {
    let user_id = service.state.extract_user_id(&request)?;
    let request = request.into_inner();
    let user = user::Entity::find_by_id(user_id)
        .one(&service.state.database)
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
        .exec(&service.state.database)
        .await
        .map_err(|e| tonic::Status::internal(e.to_string()))?;

    Ok(tonic::Response::new(()))
}
