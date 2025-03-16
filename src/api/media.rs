use tonic::{Request, Response, Status};

use crate::{
    bocchi::{UploadImageRequest, UploadImageResponse, media_server::Media},
    state::SharedAppState,
    storage::{Blob, detect_mime},
    util::request::extract_user_id_from_request,
};

#[derive(Debug)]
pub struct MediaService {
    state: SharedAppState,
}

impl MediaService {
    pub fn new(state: SharedAppState) -> Self {
        Self { state }
    }
}

#[tonic::async_trait]
impl Media for MediaService {
    #[tracing::instrument]
    async fn upload_image(
        &self,
        request: Request<UploadImageRequest>,
    ) -> Result<Response<UploadImageResponse>, Status> {
        let user_id = extract_user_id_from_request(&self.state.token, &request)?;
        let request = request.into_inner();
        let image = request.image;
        let mime =
            detect_mime(&image).map_err(|_| Status::internal("Failed to detect mime type"))?;
        let blob = Blob::new(mime, image);
        let hash = blake3::hash(&blob.content).to_string();
        let media_url = format!("{}/{}", user_id, hash);
        self.state
            .s3
            .put(&media_url, blob)
            .await
            .map_err(|_| Status::internal("Failed to upload image"))?;

        Ok(Response::new(UploadImageResponse { url: media_url }))
    }
}
