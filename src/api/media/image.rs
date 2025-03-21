use crate::{
    api::{Auth, bocchi},
    storage::Blob,
};

use super::MediaService;

pub async fn upload_image(
    service: &MediaService,
    request: tonic::Request<bocchi::UploadImageRequest>,
) -> Result<tonic::Response<bocchi::UploadImageResponse>, tonic::Status> {
    let user_id = service.state.extract_user_id(&request)?;
    let request = request.into_inner();

    let hash = blake3::hash(&request.image).to_hex();
    let blob = Blob::from(request.image);

    let key = format!("images/{}/{}", user_id, hash);

    match service.state.s3.put(&key, blob).await {
        Ok(_) => {
            let response = bocchi::UploadImageResponse {
                url: format!("{}/{}", service.state.config.s3_public_url, key),
            };
            Ok(tonic::Response::new(response))
        }
        Err(err) => {
            tracing::error!("Failed to upload image: {:?}", err);
            Err(tonic::Status::internal(err.to_string()))
        }
    }
}
