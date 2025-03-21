use super::{
    SharedAppState,
    bocchi::{self, media_server::Media},
};

mod image;

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
    async fn upload_image(
        &self,
        request: tonic::Request<bocchi::UploadImageRequest>,
    ) -> Result<tonic::Response<bocchi::UploadImageResponse>, tonic::Status> {
        image::upload_image(&self, request).await
    }
}
