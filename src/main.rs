use std::sync::Arc;

use bocchi::{
    auth::AuthenticationService,
    bocchi::{authentication_server::AuthenticationServer, health_server::HealthServer},
    health::HealthSerivce,
    jwt::Jwt,
    mail::Mailgun,
    state::AppState,
    util::verifier::Verifier,
};
use clap::{Parser, Subcommand};
use migration::{Migrator, MigratorTrait};
use sea_orm::Database;
use tonic::transport::Server;
use tonic_web::GrpcWebLayer;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

#[derive(Parser)]
#[command(version, about, long_about = None, arg_required_else_help(true))]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    #[command(about = "Start the bocchi server")]
    Server {
        #[arg(
            long,
            env,
            help = "address to listen on",
            default_value = "0.0.0.0:3000"
        )]
        address: String,

        #[arg(long, env, help = "database connection string")]
        database_url: String,

        #[arg(long, env, help = "mailgun api key")]
        mailgun_api_key: String,

        #[arg(long, env, help = "domain")]
        domain: String,

        #[arg(long, env, help = "JWT secret")]
        jwt_secret: String,

        #[arg(long, env, help = "Verification key, 256-bit hex string")]
        verification_key: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv()?;
    tracing_subscriber::fmt::init();

    let cli = Cli::parse();
    match &cli.command {
        Some(Commands::Server {
            address,
            database_url,
            mailgun_api_key,
            domain,
            jwt_secret,
            verification_key,
        }) => {
            let db = Database::connect(database_url).await?;
            Migrator::up(&db, None).await?;

            println!("Starting server on {}", address);
            let addr = address.parse()?;

            // initialize utils
            let jwt = Jwt::new(jwt_secret.to_string());
            let mail = Mailgun::new(mailgun_api_key.to_owned(), domain.to_owned());
            let verification_key = hex::decode(verification_key)?;
            let verification_key: [u8; 32] = verification_key
                .try_into()
                .map_err(|_| "Invalid key length")?;
            let verifier = Verifier::new(verification_key);

            // initialize state
            let state = Arc::new(AppState {
                db,
                mail: bocchi::mail::EmailProvider::Mailgun(mail),
                jwt,
                verifier,
            });

            // initialize services
            let health = HealthSerivce::default();
            let auth = AuthenticationService::new(state.clone());
            Server::builder()
                .accept_http1(true)
                .layer(TraceLayer::new_for_http())
                .layer(TraceLayer::new_for_grpc())
                .layer(CorsLayer::permissive())
                .layer(GrpcWebLayer::new())
                .add_service(HealthServer::new(health))
                .add_service(AuthenticationServer::new(auth))
                .serve(addr)
                .await?;
        }
        None => {}
    }

    Ok(())
}
