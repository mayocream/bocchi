use bocchi::{config::Config, server};
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(version, about, long_about = None, arg_required_else_help = true)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    Serve(Config),
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    _ = dotenvy::dotenv();

    tracing_subscriber::fmt::init();

    let cli = Cli::parse();
    match cli.command {
        Some(Commands::Serve(config)) => {
            server::serve(config).await?;
        }
        None => {}
    }
    Ok(())
}
