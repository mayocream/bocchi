use tonic::{Request, Status, service::Interceptor};

use crate::jwt::Jwt;

#[derive(Clone)]
pub struct AuthInterceptor {
    jwt: Jwt,
}

#[derive(Debug, Clone)]
pub struct UserExtension {
    pub user_id: i32,
}

impl AuthInterceptor {
    pub fn new(jwt: Jwt) -> Self {
        Self { jwt }
    }
}

impl Interceptor for AuthInterceptor {
    fn call(&mut self, mut req: Request<()>) -> Result<Request<()>, Status> {
        let token = match req.metadata().get("authorization") {
            None => return Ok(req),
            Some(t) => t
                .to_str()
                .map_err(|_| Status::unauthenticated("Invalid authorization header format"))?,
        };

        let user_id = self
            .jwt
            .verify_token(token)
            .map_err(|_| Status::unauthenticated("Authentication failed: invalid token"))?;

        req.extensions_mut().insert(UserExtension {
            user_id: user_id as i32,
        });

        Ok(req)
    }
}

#[cfg(test)]
mod tests {
    use tonic::{Request, transport::Server};

    use super::*;
    use crate::{
        bocchi::{health_client::HealthClient, health_server::HealthServer},
        health::HealthSerivce,
        jwt::Jwt,
    };

    #[tokio::test]
    async fn test_auth_interceptor() {
        let jwt = Jwt::new("secret".to_string());
        let auth = AuthInterceptor::new(jwt.clone());

        let access_token = jwt.generate_token(1).expect("Failed to generate token");

        let service = HealthServer::with_interceptor(HealthSerivce::default(), auth);
        let server_handle = tokio::spawn(async move {
            Server::builder()
                .add_service(service)
                .serve("[::1]:50051".parse().unwrap())
                .await
                .unwrap();
        });

        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;

        let mut client = HealthClient::connect("http://[::1]:50051").await.unwrap();
        let mut request = Request::new(());
        request
            .metadata_mut()
            .insert("authorization", access_token.parse().unwrap());

        let response = client.check(request).await.unwrap();
        assert_eq!(response.into_inner(), ());

        server_handle.abort();
    }
}
