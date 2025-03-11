use bocchi::server;
use clap::{Parser, Subcommand};

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
        #[arg(short, long, help = "Port number to listen on", default_value = "3000")]
        port: u16,

        #[arg(
            short,
            long,
            help = "IP address to listen on",
            default_value = "0.0.0.0"
        )]
        address: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();
    match &cli.command {
        Some(Commands::Server { port, address }) => {
            println!("Starting server on {}:{}", address, port);
            server::serve(format!("{}:{}", address, port)).await?;
        }
        None => {}
    }

    Ok(())
}
