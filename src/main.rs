use bocchi::{bocchi::health_server::HealthServer, health::HealthSerivce};
use clap::{Parser, Subcommand};
use migration::{Migrator, MigratorTrait};
use sea_orm::Database;
use tonic::transport::Server;

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
        #[arg(long, env, help = "address to listen on", default_value = "[::1]:3000")]
        address: String,

        #[arg(long, env, help = "database connection string")]
        database_url: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv()?;
    let cli = Cli::parse();
    match &cli.command {
        Some(Commands::Server {
            address,
            database_url,
        }) => {
            let db = Database::connect(database_url).await?;
            Migrator::up(&db, None).await?;

            println!("Starting server on {}", address);
            let addr = address.parse()?;
            let health = HealthSerivce::default();
            Server::builder()
                .add_service(HealthServer::new(health))
                .serve(addr)
                .await?;
        }
        None => {}
    }

    Ok(())
}
