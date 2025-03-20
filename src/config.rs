use clap::Parser;

#[derive(Debug, Parser)]
pub struct Config {
    #[arg(long, env, help = "The URL of the database")]
    pub database_url: String,

    #[arg(
        short,
        long,
        env,
        help = "The address to bind the server to",
        default_value = "0.0.0.0:3000"
    )]
    pub listen_address: String,
}
