use bocchi::api::auth::AuthenticationService;
use bocchi::bocchi::authentication_server::Authentication;
use bocchi::bocchi::login_request::Handle;
use bocchi::bocchi::{LoginRequest, RegisterRequest, VerifyEmailRequest};
use common::setup;
use entity::user::Entity;
use sea_orm::EntityTrait;
use tonic::Request;

mod common;

#[tokio::test]
async fn test_register_unique() {
    let state = setup().await;
    let service = AuthenticationService::new(state);
    let request = Request::new(RegisterRequest {
        username: "test1".to_string(),
        email: "test1@example.com".to_string(),
        password: "password".to_string(),
    });

    let response = service.register(request).await.expect("Failed to register");
    assert_eq!(response.into_inner(), ());

    // register with the same username should fail
    let request = Request::new(RegisterRequest {
        username: "test1".to_string(),
        email: "test1@example.com".to_string(),
        password: "password".to_string(),
    });
    let response = service
        .register(request)
        .await
        .expect_err("Should fail to register");
    assert_eq!(response.code(), tonic::Code::AlreadyExists);

    // register with the same email should fail
    let request = Request::new(RegisterRequest {
        username: "test2".to_string(),
        email: "test1@example.com".to_string(),
        password: "password".to_string(),
    });
    let response = service
        .register(request)
        .await
        .expect_err("Should fail to register");
    assert_eq!(response.code(), tonic::Code::AlreadyExists);
}

#[tokio::test]
async fn test_register_validation_mail() {
    let state = setup().await;
    let service = AuthenticationService::new(state);
    let request = Request::new(RegisterRequest {
        username: "test".to_string(),
        email: "invalid".to_string(),
        password: "password".to_string(),
    });

    let response = service
        .register(request)
        .await
        .expect_err("Should fail to register");
    assert_eq!(response.code(), tonic::Code::InvalidArgument);
}

#[tokio::test]
async fn test_register_validation_username() {
    let state = setup().await;
    let service = AuthenticationService::new(state);
    let request = Request::new(RegisterRequest {
        username: "t".to_string(),
        email: "invalid".to_string(),
        password: "password".to_string(),
    });

    let response = service
        .register(request)
        .await
        .expect_err("Should fail to register");
    assert_eq!(response.code(), tonic::Code::InvalidArgument);
}

#[tokio::test]
async fn test_login() {
    let state = setup().await;
    let service = AuthenticationService::new(state);
    let request = Request::new(RegisterRequest {
        username: "test".to_string(),
        email: "test@example.com".to_string(),
        password: "password".to_string(),
    });
    let response = service.register(request).await.expect("Failed to register");
    assert_eq!(response.into_inner(), ());

    let request = Request::new(LoginRequest {
        handle: Some(Handle::Username("test".to_string())),
        password: "password".to_string(),
    });
    let response = service.login(request).await.expect("Failed to login");
    assert!(!response.into_inner().access_token.is_empty());

    // login with wrong password should fail
    let request = Request::new(LoginRequest {
        handle: Some(Handle::Username("test".to_string())),
        password: "wrong".to_string(),
    });
    let response = service
        .login(request)
        .await
        .expect_err("Should fail to login");
    assert_eq!(response.code(), tonic::Code::InvalidArgument);

    // login with email should work
    let request = Request::new(LoginRequest {
        handle: Some(Handle::Email("test@example.com".to_string())),
        password: "password".to_string(),
    });
    let response = service.login(request).await.expect("Failed to login");
    assert!(!response.into_inner().access_token.is_empty());
}

#[tokio::test]
async fn test_login_validation() {
    let state = setup().await;
    let service = AuthenticationService::new(state);
    let request = Request::new(LoginRequest {
        handle: None,
        password: "password".to_string(),
    });

    let response = service
        .login(request)
        .await
        .expect_err("Should fail to login");
    assert_eq!(response.code(), tonic::Code::InvalidArgument);
}

#[tokio::test]
async fn test_login_not_found() {
    let state = setup().await;
    let service = AuthenticationService::new(state);
    let request = Request::new(LoginRequest {
        handle: Some(Handle::Username("test".to_string())),
        password: "password".to_string(),
    });

    let response = service
        .login(request)
        .await
        .expect_err("Should fail to login");
    assert_eq!(response.code(), tonic::Code::NotFound);
}

#[tokio::test]
async fn test_send_verification_email() {
    let state = setup().await;
    let service = AuthenticationService::new(state);
    let request = Request::new(RegisterRequest {
        username: "test".to_string(),
        email: "test@example.com".to_string(),
        password: "password".to_string(),
    });
    let response = service.register(request).await.expect("Failed to register");
    assert_eq!(response.into_inner(), ());

    let request = Request::new(LoginRequest {
        handle: Some(Handle::Username("test".to_string())),
        password: "password".to_string(),
    });
    let response = service.login(request).await.expect("Failed to login");
    let access_token = response.into_inner().access_token;
    assert!(!access_token.is_empty());

    let mut request = Request::new(());
    request
        .metadata_mut()
        .insert("authorization", access_token.parse().unwrap());
    let response = service
        .send_verification_email(request)
        .await
        .expect("Failed to send verification email");
    assert_eq!(response.into_inner(), ());

    // without token should fail
    let request = Request::new(());
    let response = service
        .send_verification_email(request)
        .await
        .expect_err("Should fail to send verification email");
    assert_eq!(response.code(), tonic::Code::Unauthenticated);
}

#[tokio::test]
async fn test_verify_email() {
    let state = setup().await;
    let service = AuthenticationService::new(state.clone());
    let request = Request::new(RegisterRequest {
        username: "test".to_string(),
        email: "test@example.com".to_string(),
        password: "password".to_string(),
    });
    let response = service.register(request).await.expect("Failed to register");
    assert_eq!(response.into_inner(), ());

    let request = Request::new(LoginRequest {
        handle: Some(Handle::Username("test".to_string())),
        password: "password".to_string(),
    });
    let response = service.login(request).await.expect("Failed to login");
    let access_token = response.into_inner().access_token;
    assert!(!access_token.is_empty());

    let mut request = Request::new(());
    request
        .metadata_mut()
        .insert("authorization", access_token.parse().unwrap());
    let response = service
        .send_verification_email(request)
        .await
        .expect("Failed to send verification email");
    assert_eq!(response.into_inner(), ());

    // invalid code should fail
    let mut request = Request::new(VerifyEmailRequest { code: 123456 });
    request
        .metadata_mut()
        .insert("authorization", access_token.parse().unwrap());
    let response = service
        .verify_email(request)
        .await
        .expect_err("Should fail to verify email");
    assert_eq!(response.code(), tonic::Code::InvalidArgument);

    // calculate the code
    let code = state.hasher.generate_time_based_verification_code(1.to_string().as_str());
    let mut request = Request::new(VerifyEmailRequest { code });
    request
        .metadata_mut()
        .insert("authorization", access_token.parse().unwrap());
    let response = service
        .verify_email(request)
        .await
        .expect("Failed to verify email");
    assert_eq!(response.into_inner(), ());

    // let's see if the user is verified
    let db = state.db.clone();
    let user = Entity::find_by_id(1).one(&db).await.unwrap().unwrap();
    assert_eq!(user.email_verified, true);
}
