use clap::Parser;

#[derive(Debug, Parser, Clone, Default)]
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

    #[arg(long, env, help = "The secret key for signing JWT tokens")]
    pub jwt_secret: String,

    #[arg(long, env, help = "S3 Endpoint")]
    pub s3_endpoint: String,

    #[arg(long, env, help = "S3 Region", default_value = "us-east-1")]
    pub s3_region: String,

    #[arg(long, env, help = "S3 Bucket")]
    pub s3_bucket: String,

    #[arg(long, env, help = "S3 Access Key")]
    pub s3_access_key_id: String,

    #[arg(long, env, help = "S3 Secret Key")]
    pub s3_secret_access_key: String,

    #[arg(long, env, help = "The public URL of s3")]
    pub s3_public_url: String,

    #[arg(
        long,
        env,
        help = "Whether to use path style URLs",
        default_value_t = false
    )]
    pub s3_force_path_style: bool,
}
