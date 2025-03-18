use bocchi::{config::Config, server::serve};
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(version, about, long_about = None, arg_required_else_help(true))]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    #[command(about = "Run the server")]
    Serve(Config),
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    _ = dotenvy::dotenv();
    let cli = Cli::parse();

    tracing_subscriber::fmt::init();

    match cli.command {
        Some(Commands::Serve(config)) => serve(config).await?,
        None => unreachable!(),
    }

    Ok(())
}
