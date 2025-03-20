use sea_orm::{ColumnTrait, Condition, EntityTrait, QueryFilter, QuerySelect};

use super::UserService;
use crate::{api::bocchi, entities::user};

pub async fn search(
    service: &UserService,
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
        .all(&service.state.database)
        .await
        .map_err(|e| tonic::Status::internal(e.to_string()))?;

    let users = users.iter().map(|u| u.id).collect();

    let response = bocchi::SearchUserResponse {
        users,
        next_cursor: 0,
    };
    Ok(tonic::Response::new(response))
}
