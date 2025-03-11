use tonic::{Request, Response};

use crate::bocchi::health_server::Health;

#[derive(Default)]
pub struct HealthSerivce {}

#[tonic::async_trait]
impl Health for HealthSerivce {
    async fn check(&self, _request: Request<()>) -> Result<Response<()>, tonic::Status> {
        Ok(Response::new(()))
    }
}
