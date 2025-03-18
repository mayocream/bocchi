use clap::Parser;

#[derive(Debug, Parser, Clone)]
pub struct Config {
    #[arg(long, env, default_value = "")]
    pub database_url: String,

    #[arg(short, long, env, default_value = "0.0.0.0:3000")]
    pub listen_addr: String,
}
