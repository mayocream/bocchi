use tonic::{Request, Status};

use crate::jwt::Jwt;

pub fn extract_user_id_from_request<T>(jwt: &Jwt, request: &Request<T>) -> Result<usize, Status> {
    let metadata = request.metadata();
    let token = metadata
        .get("authorization")
        .ok_or_else(|| Status::unauthenticated("Missing authorization header"))?
        .to_str()
        .map_err(|_| Status::unauthenticated("Failed to decode authorization header"))?
        .trim_start_matches("Bearer ")
        .to_string();

    let user_id = jwt
        .verify_token(&token)
        .map_err(|_| Status::unauthenticated("Failed to decode token"))?;

    Ok(user_id)
}
