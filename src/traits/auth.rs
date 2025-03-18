use sqlx::PgPool;
use tonic::Status;

use crate::repositories::user::{self, User};

#[allow(async_fn_in_trait)]
pub trait Auth {
    fn get_uid(&self) -> Result<String, Status>;
    async fn authenticate(&mut self, conn: &PgPool) -> Result<User, Status>;
}

impl<T> Auth for tonic::Request<T> {
    fn get_uid(&self) -> Result<String, Status> {
        let uid = self
            .extensions()
            .get::<crate::interceptors::auth::UserExtension>()
            .ok_or_else(|| Status::unauthenticated("Unauthorized"))?
            .uid
            .clone();

        Ok(uid)
    }

    async fn authenticate(&mut self, conn: &PgPool) -> Result<User, Status> {
        let uid = self.get_uid()?;
        let user = user::find_by_uid(conn, uid.as_str())
            .await
            .map_err(|_| Status::internal("Failed to fetch user"))?;

        Ok(user)
    }
}
