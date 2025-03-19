use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use tonic::{Request, Status, service::Interceptor};

static FIREBASE_PUBLIC_KEYS_URL: &str =
    "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    aud: String,
    exp: usize,
    iat: usize,
    iss: String,
    auth_time: usize,
    sub: String,
}

#[derive(Clone)]
pub struct UserExtension {
    pub uid: String,
}

#[derive(Default, Clone)]
pub struct AuthInterceptor {
    public_keys: HashMap<String, String>,
}

impl AuthInterceptor {
    pub async fn initialize() -> Result<Self, Box<dyn std::error::Error>> {
        let public_keys = reqwest::get(FIREBASE_PUBLIC_KEYS_URL)
            .await?
            .json::<HashMap<String, String>>()
            .await?;

        Ok(Self { public_keys })
    }
}

#[tonic::async_trait]
impl Interceptor for AuthInterceptor {
    fn call(&mut self, mut request: Request<()>) -> Result<Request<()>, Status> {
        let metadata = request.metadata();
        let token = match metadata.get("authorization") {
            Some(token) => token
                .to_str()
                .map_err(|_| Status::unauthenticated("Invalid token"))?,
            None => return Ok(request), // Omits the token check if not provided since it's optional
        };
        let token = token.replace("Bearer ", "");

        let public_key = jsonwebtoken::DecodingKey::from_rsa_pem(
            self.public_keys
                .get("kid")
                .ok_or_else(|| Status::unauthenticated("Invalid token"))?
                .as_bytes(),
        )
        .map_err(|_| Status::unauthenticated("Invalid token"))?;

        let claims = jsonwebtoken::decode::<Claims>(
            &token,
            &public_key,
            &jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::RS256),
        )
        .map_err(|_| Status::unauthenticated("Invalid token"))?
        .claims;

        // TODO: check project id

        request
            .extensions_mut()
            .insert(UserExtension { uid: claims.sub });

        Ok(request)
    }
}
