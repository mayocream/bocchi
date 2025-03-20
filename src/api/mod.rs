use std::sync::Arc;

use sea_orm::DatabaseConnection;

use crate::jwt::Jwt;

mod bocchi {
    tonic::include_proto!("bocchi");
}

mod user;

#[derive(Debug, Clone)]
pub struct AppState {
    database: DatabaseConnection,
    jwt: Jwt,
}

type SharedAppState = Arc<AppState>;

trait Auth<T> {
    fn extract_user_id(&self, request: &tonic::Request<T>) -> Result<i32, tonic::Status>;
}

impl<T> Auth<T> for SharedAppState {
    fn extract_user_id(&self, request: &tonic::Request<T>) -> Result<i32, tonic::Status> {
        let token = request
            .metadata()
            .get("authorization")
            .ok_or_else(|| tonic::Status::unauthenticated("Authorization header not found"))?
            .to_str()
            .map_err(|_| tonic::Status::unauthenticated("Invalid authorization header"))?
            .replace("Bearer ", "");
        let claims = self
            .jwt
            .decode(&token)
            .map_err(|_| tonic::Status::unauthenticated("Invalid token"))?;
        Ok(claims.user_id)
    }
}
