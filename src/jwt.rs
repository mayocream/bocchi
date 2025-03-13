use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};

#[derive(Debug)]
pub struct Jwt {
    secret: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    aud: String, // Optional. Audience
    exp: usize, // Required (validate_exp defaults to true in validation). Expiration time (as UTC timestamp)
    iat: usize, // Optional. Issued at (as UTC timestamp)
    iss: String, // Optional. Issuer
    nbf: usize, // Optional. Not Before (as UTC timestamp)
    sub: String, // Optional. Subject (whom token refers to)
}

impl Jwt {
    pub fn new(secret: String) -> Self {
        Self { secret }
    }

    #[tracing::instrument]
    fn encode(&self, claims: Claims) -> Result<String, jsonwebtoken::errors::Error> {
        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_ref()),
        )
    }

    #[tracing::instrument]
    fn decode(&self, token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_ref()),
            &Validation::default(),
        )
        .map(|data| data.claims)
    }

    #[tracing::instrument]
    pub fn generate_token(&self, user_id: usize) -> Result<String, jsonwebtoken::errors::Error> {
        self.encode(Claims {
            aud: "bocchi".to_string(),
            exp: (chrono::Utc::now() + chrono::Duration::days(365)).timestamp() as usize,
            iat: chrono::Utc::now().timestamp() as usize,
            iss: "bocchi".to_string(),
            nbf: chrono::Utc::now().timestamp() as usize,
            sub: user_id.to_string(),
        })
    }

    #[tracing::instrument]
    pub fn verify_token(&self, token: &str) -> Result<usize, jsonwebtoken::errors::Error> {
        self.decode(token).and_then(|claims| {
            claims
                .sub
                .parse::<usize>()
                .map_err(|_| jsonwebtoken::errors::ErrorKind::InvalidToken.into())
        })
    }
}
