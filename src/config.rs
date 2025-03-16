use clap::Parser;

#[derive(Debug, Clone, Parser)]
pub struct Config {
    #[arg(
        long,
        env,
        help = "Address to listen on",
        default_value = "0.0.0.0:3000"
    )]
    pub address: String,

    #[arg(long, env, help = "Database connection string")]
    pub database_url: String,

    #[arg(long, env, help = "Mailgun api key")]
    pub mailgun_api_key: String,

    #[arg(long, env, help = "Domain")]
    pub domain: String,

    #[arg(long, env, help = "JWT secret")]
    pub jwt_secret: String,

    #[arg(long, env, help = "Hasher key")]
    pub hahser_key: String,
}
