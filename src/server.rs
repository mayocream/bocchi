use std::sync::Arc;

use tonic::transport::Server;
use tonic_web::GrpcWebLayer;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

use crate::{
    api::{AppState, user::UserApi},
    config::Config,
    interceptors::auth::AuthInterceptor,
    proto::bocchi::user_service_server::UserServiceServer,
};

pub async fn serve(config: Config) -> Result<(), Box<dyn std::error::Error>> {
    let state = Arc::new(AppState {
        config: config.clone(),
        db: sqlx::PgPool::connect(&config.database_url).await?,
    });

    Server::builder()
        .accept_http1(true)
        .layer(TraceLayer::new_for_grpc())
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .layer(GrpcWebLayer::new())
        .add_service(UserServiceServer::with_interceptor(
            UserApi::new(state.clone()),
            AuthInterceptor::default(),
        ))
        .serve(config.listen_addr.parse()?)
        .await?;

    Ok(())
}
