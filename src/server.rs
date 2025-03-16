use std::sync::Arc;

use migration::{Migrator, MigratorTrait};
use sea_orm::Database;
use tonic::transport::Server;
use tonic_web::GrpcWebLayer;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing::info;

use crate::{
    api::{auth::AuthenticationService, health::HealthSerivce},
    bocchi,
    config::Config,
    hasher::Hasher,
    mail,
    state::AppState,
    token::Token,
};

pub async fn serve(config: &Config) -> Result<(), Box<dyn std::error::Error>> {
    let addr = config.address.parse().expect("invalid address");
    let db = Database::connect(&config.database_url)
        .await
        .expect("failed to connect to database");
    Migrator::up(&db, None)
        .await
        .expect("failed to run migrations");

    let state = Arc::new(AppState {
        db,
        mail: mail::EmailProvider::Mailgun(mail::Mailgun::new(
            config.mailgun_api_key.clone(),
            config.domain.clone(),
        )),
        token: Token::new(config.jwt_secret.clone()),
        hasher: Hasher::new(
            hex::decode(&config.hahser_key)?
                .try_into()
                .expect("hasher key must be 32 bytes"),
        ),
    });

    info!("Bocchi server listening on {}", addr);

    Server::builder()
        // Grpc-web requires http1
        .accept_http1(true)
        .layer(TraceLayer::new_for_grpc())
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .layer(GrpcWebLayer::new())
        .add_service(bocchi::health_server::HealthServer::new(
            HealthSerivce::default(),
        ))
        .add_service(bocchi::authentication_server::AuthenticationServer::new(
            AuthenticationService::new(state.clone()),
        ))
        .serve(addr)
        .await?;

    Ok(())
}
