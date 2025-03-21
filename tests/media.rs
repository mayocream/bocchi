use std::fs;

use ::bocchi::api::{
    bocchi::{self, media_server::Media},
    media::MediaService,
};

mod common;

#[tokio::test]
async fn test_upload_image() {
    let state = common::setup().await;
    let token = common::register(&state, "test@test.com", "test", "test").await;

    let service = MediaService::new(state.clone());
    let request = bocchi::UploadImageRequest {
        image: fs::read("tests/fixtures/test.png").unwrap(),
    };
    let mut request = tonic::Request::new(request);
    request
        .metadata_mut()
        .insert("authorization", token.parse().unwrap());

    let response = service.upload_image(request).await.unwrap();
    assert!(!response.into_inner().url.is_empty());
}
