use sea_orm::{ActiveValue::Set, ColumnTrait, EntityTrait, QueryFilter};

use crate::{
    api::{Auth, bocchi},
    entities::follow,
};

use super::UserService;

pub async fn follow(
    service: &UserService,
    request: tonic::Request<bocchi::FollowRequest>,
) -> Result<tonic::Response<()>, tonic::Status> {
    let user_id = service.state.extract_user_id(&request)?;
    let request = request.into_inner();

    let follow = follow::ActiveModel {
        follower_id: Set(user_id),
        followed_id: Set(request.user_id),
        ..Default::default()
    };
    follow::Entity::insert(follow)
        .exec(&service.state.database)
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

pub async fn unfollow(
    service: &UserService,
    request: tonic::Request<bocchi::UnfollowRequest>,
) -> Result<tonic::Response<()>, tonic::Status> {
    let user_id = service.state.extract_user_id(&request)?;
    let request = request.into_inner();

    let follow = follow::ActiveModel {
        follower_id: Set(user_id),
        followed_id: Set(request.user_id),
        ..Default::default()
    };
    follow::Entity::delete(follow)
        .exec(&service.state.database)
        .await
        .map_err(|e| tonic::Status::internal(e.to_string()))?;

    Ok(tonic::Response::new(()))
}

pub async fn get_followers(
    service: &UserService,
    request: tonic::Request<bocchi::GetFollowersRequest>,
) -> Result<tonic::Response<bocchi::GetFollowersResponse>, tonic::Status> {
    let request = request.into_inner();
    let follows = follow::Entity::find()
        .filter(follow::Column::FollowedId.eq(request.user_id))
        .cursor_by(follow::Column::Id)
        .after(request.cursor.clone())
        .first(50)
        .all(&service.state.database)
        .await
        .map_err(|e| tonic::Status::internal(e.to_string()))?;

    let followers = follows.iter().map(|f| f.follower_id).collect();

    let response = bocchi::GetFollowersResponse {
        followers,
        next_cursor: follows.last().map(|f| f.id).unwrap_or_default(),
    };

    Ok(tonic::Response::new(response))
}

pub async fn get_following(
    service: &UserService,
    request: tonic::Request<bocchi::GetFollowingRequest>,
) -> Result<tonic::Response<bocchi::GetFollowingResponse>, tonic::Status> {
    let request = request.into_inner();
    let follows = follow::Entity::find()
        .filter(follow::Column::FollowerId.eq(request.user_id))
        .cursor_by(follow::Column::Id)
        .after(request.cursor.clone())
        .first(50)
        .all(&service.state.database)
        .await
        .map_err(|e| tonic::Status::internal(e.to_string()))?;

    let following = follows.iter().map(|f| f.followed_id).collect();
    let response = bocchi::GetFollowingResponse {
        following,
        next_cursor: follows.last().map(|f| f.id).unwrap_or_default(),
    };
    Ok(tonic::Response::new(response))
}
