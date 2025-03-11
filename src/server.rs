use tonic::transport::Server;

use crate::{bocchi::health_server::HealthServer, health::HealthSerivce};

pub async fn serve(addr: String) -> Result<(), Box<dyn std::error::Error>> {
    let addr = addr.parse()?;
    let health = HealthSerivce::default();
    Server::builder()
        .add_service(HealthServer::new(health))
        .serve(addr)
        .await?;

    Ok(())
}
