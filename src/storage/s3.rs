use aws_config::{BehaviorVersion, Region};
use aws_sdk_s3::{Client, config::Credentials};

use crate::config::Config;

use super::Blob;

#[derive(Debug, Clone)]
pub struct S3 {
    bucket: String,
    client: Client,
}

impl S3 {
    pub async fn new(config: &Config) -> Self {
        let shared_config = aws_config::load_defaults(BehaviorVersion::latest()).await;
        let config_builder = aws_sdk_s3::config::Builder::from(&shared_config)
            .region(Region::new(config.s3_region.clone()))
            .force_path_style(true)
            .endpoint_url(config.s3_endpoint.clone())
            .credentials_provider(Credentials::new(
                config.s3_access_key_id.clone(),
                config.s3_secret_access_key.clone(),
                None,
                None,
                "static",
            ));

        let client = Client::from_conf(config_builder.build());
        S3 {
            client,
            bucket: config.s3_bucket.clone(),
        }
    }

    pub async fn put(&self, key: &str, blob: Blob) -> Result<(), aws_sdk_s3::Error> {
        self.client
            .put_object()
            .bucket(&self.bucket)
            .key(key)
            .content_type(&blob.mime)
            .body(blob.content.into())
            .send()
            .await?;

        Ok(())
    }
}
