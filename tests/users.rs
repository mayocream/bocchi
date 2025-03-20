use ::bocchi::api::{
    bocchi::{login_request::Handle, user_server::User},
    user::UserService,
};
use bocchi::api::bocchi;
use common::{register, setup};

mod common;

#[tokio::test]
async fn test_register() {
    let state = setup().await;
    let service = UserService::new(state.clone());
    let request = bocchi::RegisterRequest {
        email: "test@example.com".to_string(),
        username: "test".to_string(),
        password: "test".to_string(),
    };
    let response = service
        .register(tonic::Request::new(request.clone()))
        .await
        .unwrap();
    assert!(!response.into_inner().token.is_empty());

    // already exists
    let response = service
        .register(tonic::Request::new(request.clone()))
        .await
        .unwrap_err();
    assert_eq!(response.code(), tonic::Code::AlreadyExists);
}

#[tokio::test]
async fn test_login() {
    let state = setup().await;
    let service = UserService::new(state.clone());
    _ = register(&state, "test@test.com", "test", "test").await;

    let request = bocchi::LoginRequest {
        handle: Some(Handle::Email("test@test.com".to_string())),
        password: "test".to_string(),
    };
    let response = service.login(tonic::Request::new(request)).await.unwrap();
    assert!(!response.into_inner().token.is_empty());

    let request = bocchi::LoginRequest {
        handle: Some(Handle::Username("test".to_string())),
        password: "test".to_string(),
    };
    let response = service.login(tonic::Request::new(request)).await.unwrap();
    assert!(!response.into_inner().token.is_empty());
}

#[tokio::test]
async fn test_profile() {
    let state = setup().await;
    let service = UserService::new(state.clone());
    let token = register(&state, "test@test.com", "test", "test").await;
    let mut request = tonic::Request::new(bocchi::GetProfileRequest { id: 1 });
    request
        .metadata_mut()
        .insert("authorization", token.parse().unwrap());
    let response = service.get_profile(request).await.unwrap();
    assert_eq!(response.into_inner().username, "test");
}

#[tokio::test]
async fn test_update_profile() {
    let state = setup().await;
    let service = UserService::new(state.clone());
    let token = register(&state, "test@test.com", "test", "test").await;
    let mut request = tonic::Request::new(bocchi::UpdateProfileRequest {
        name: "x".to_string(),
        bio: "bio".to_string(),
        avatar_url: "avatar".to_string(),
        cover_url: "cover".to_string(),
    });
    request
        .metadata_mut()
        .insert("authorization", token.parse().unwrap());
    _ = service.update_profile(request).await.unwrap();

    let mut request = tonic::Request::new(bocchi::GetProfileRequest { id: 1 });
    request
        .metadata_mut()
        .insert("authorization", token.parse().unwrap());
    let response = service.get_profile(request).await.unwrap();
    let profile = response.into_inner();
    assert_eq!(profile.name, "x");
    assert_eq!(profile.bio, "bio");
    assert_eq!(profile.avatar_url, "avatar");
    assert_eq!(profile.cover_url, "cover");
}
