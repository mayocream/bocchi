use aws_config::{BehaviorVersion, Region};
use aws_sdk_s3::{Client, config::Credentials, operation::head_object::HeadObjectError};

use crate::config::Config;

use super::Blob;

#[derive(Debug)]
pub struct S3 {
    client: Client,
    bucket: String,
}

impl S3 {
    pub async fn new(config: Config) -> Result<Self, aws_sdk_s3::Error> {
        let shared_config = aws_config::load_defaults(BehaviorVersion::latest()).await;
        #[allow(unused_mut)]
        let mut config_builder = aws_sdk_s3::config::Builder::from(&shared_config)
            .endpoint_url(config.s3_endpoint)
            .region(Region::new(config.s3_region))
            .credentials_provider(Credentials::new(
                config.s3_access_key_id,
                config.s3_secret_access_key,
                None,
                None,
                "s3",
            ));

        #[cfg(test)]
        {
            config_builder = config_builder.force_path_style(true);
        }

        let client = aws_sdk_s3::Client::from_conf(config_builder.build());

        #[cfg(test)]
        {
            _ = client
                .create_bucket()
                .bucket(&config.s3_bucket)
                .send()
                .await;
        }

        Ok(Self {
            client,
            bucket: config.s3_bucket,
        })
    }

    pub async fn exists(&self, key: &str) -> Result<bool, aws_sdk_s3::Error> {
        match self
            .client
            .head_object()
            .bucket(&self.bucket)
            .key(key)
            .send()
            .await
        {
            Ok(_) => Ok(true),
            Err(err) => match err.as_service_error() {
                Some(HeadObjectError::NotFound(_)) => Ok(false),
                _ => Err(err.into()),
            },
        }
    }

    pub async fn put(&self, key: &str, blob: Blob) -> Result<(), aws_sdk_s3::Error> {
        self.client
            .put_object()
            .bucket(&self.bucket)
            .key(key)
            .body(blob.content.into())
            .content_type(blob.mime)
            .send()
            .await?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_exists() {
        let s3 = S3::new(Config {
            s3_endpoint: "http://localhost:9000".to_string(),
            s3_region: "us-east-1".to_string(),
            s3_access_key_id: "minioadmin".to_string(),
            s3_secret_access_key: "minioadmin".to_string(),
            s3_bucket: "test".to_string(),
            ..Default::default()
        })
        .await
        .unwrap();

        assert_eq!(s3.exists("not_exist").await.unwrap(), false);
    }

    #[tokio::test]
    async fn test_put() {
        let s3 = S3::new(Config {
            s3_endpoint: "http://localhost:9000".to_string(),
            s3_region: "us-east-1".to_string(),
            s3_access_key_id: "minioadmin".to_string(),
            s3_secret_access_key: "minioadmin".to_string(),
            s3_bucket: "test".to_string(),
            ..Default::default()
        })
        .await
        .unwrap();

        s3.put(
            "test",
            Blob::new("text/plain".to_string(), b"test".to_vec()),
        )
        .await
        .unwrap();
    }
}
