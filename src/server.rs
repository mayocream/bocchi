use std::sync::Arc;

use sea_orm::Database;
use tonic::transport::Server;
use tonic_web::GrpcWebLayer;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

use crate::{
    api::{AppState, bocchi::user_server::UserServer, user::UserService},
    config::Config,
    jwt::Jwt,
};

pub async fn serve(config: Config) -> Result<(), Box<dyn std::error::Error>> {
    let state = Arc::new(AppState {
        database: Database::connect(&config.database_url).await?,
        jwt: Jwt::new(config.jwt_secret.clone()),
    });

    Server::builder()
        // gRPC-web uses http1
        .accept_http1(true)
        .layer(TraceLayer::new_for_grpc())
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .layer(GrpcWebLayer::new())
        .add_service(UserServer::new(UserService::new(state.clone())))
        .serve(config.listen_address.parse()?)
        .await?;

    Ok(())
}
