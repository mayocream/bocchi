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

#[cfg(test)]
mod tests {
    use super::*;
    use tonic::Request;

    #[tokio::test]
    async fn test_health_check() {
        let service = HealthSerivce::default();
        let request = Request::new(());
        let response = service.check(request).await.unwrap();
        assert_eq!(response.into_inner(), ());
    }
}
