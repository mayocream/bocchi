use std::sync::Arc;

use sea_orm::Database;
use tonic::transport::Server;
use tonic_web::GrpcWebLayer;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

use crate::{
    api::{bocchi::{media_server::MediaServer, user_server::UserServer}, media::MediaService, user::UserService, AppState},
    config::Config,
    jwt::Jwt,
    storage::s3::S3,
};

pub async fn serve(config: Config) -> Result<(), Box<dyn std::error::Error>> {
    let state = Arc::new(AppState {
        config: config.clone(),
        database: Database::connect(&config.database_url).await?,
        jwt: Jwt::new(config.jwt_secret.clone()),
        s3: S3::new(config.clone()).await?,
    });

    Server::builder()
        // gRPC-web uses http1
        .accept_http1(true)
        .layer(TraceLayer::new_for_grpc())
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .layer(GrpcWebLayer::new())
        .add_service(UserServer::new(UserService::new(state.clone())))
        .add_service(MediaServer::new(MediaService::new(state.clone())))
        .serve(config.listen_address.parse()?)
        .await?;

    Ok(())
}
