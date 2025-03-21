use sea_orm::{ColumnTrait, Condition, EntityTrait, QueryFilter, QueryOrder};

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
        .cursor_by(user::Column::Id)
        .order_by_desc(user::Column::Id)
        .before(request.cursor)
        .last(10)
        .all(&service.state.database)
        .await
        .map_err(|e| tonic::Status::internal(e.to_string()))?;

    let user_ids = users.iter().map(|u| u.id).collect();
    let response = bocchi::SearchUserResponse { users: user_ids };
    Ok(tonic::Response::new(response))
}
