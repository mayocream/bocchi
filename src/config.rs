use clap::Parser;

#[derive(Debug, Clone, Parser, Default)]
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

    #[arg(long, env, help = "Mailgun domain")]
    pub mailgun_domain: String,

    #[arg(long, env, help = "JWT secret")]
    pub jwt_secret: String,

    #[arg(long, env, help = "Hasher key")]
    pub hahser_key: String,

    #[arg(long, env, help = "S3 endpoint")]
    pub s3_endpoint: String,

    #[arg(long, env, help = "S3 bucket")]
    pub s3_bucket: String,

    #[arg(long, env, help = "S3 region")]
    pub s3_region: String,

    #[arg(long, env, help = "S3 access key ID")]
    pub s3_access_key_id: String,

    #[arg(long, env, help = "S3 secret access key")]
    pub s3_secret_access_key: String,

    #[arg(long, env, help = "S3 public URL")]
    pub s3_public_url: String,
}
