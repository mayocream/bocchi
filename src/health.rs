use tonic::{Request, Response, Status};

use crate::bocchi::health_server::Health;

#[derive(Default)]
pub struct HealthSerivce {}

#[tonic::async_trait]
impl Health for HealthSerivce {
    async fn check(&self, _request: Request<()>) -> Result<Response<()>, Status> {
        Ok(Response::new(()))
    }
}
