use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};

pub struct Jwt {
    secret: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    user_id: i32,
    exp: usize,
}

impl Jwt {
    pub fn new(secret: String) -> Self {
        Self { secret }
    }

    pub fn encode(&self, claims: Claims) -> Result<String, jsonwebtoken::errors::Error> {
        let header = Header::default();
        let token = encode(
            &header,
            &claims,
            &EncodingKey::from_secret(self.secret.as_ref()),
        )?;
        Ok(token)
    }

    pub fn decode(&self, token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_ref()),
            &Validation::default(),
        )?;
        Ok(token_data.claims)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_jwt() {
        let jwt = Jwt::new("secret".to_string());
        let claims: Claims = Claims {
            user_id: 1,
            exp: (chrono::Utc::now() + chrono::Duration::days(1)).timestamp() as usize,
        };
        let token = jwt.encode(claims).unwrap();
        let decoded_claims = jwt.decode(&token).unwrap();
        assert_eq!(decoded_claims.user_id, 1);
    }

    #[test]
    fn test_jwt_invalid() {
        let jwt = Jwt::new("secret".to_string());
        let claims: Claims = Claims {
            user_id: 1,
            exp: (chrono::Utc::now() - chrono::Duration::days(1)).timestamp() as usize,
        };
        let token = jwt.encode(claims).unwrap();
        let decoded_claims = jwt.decode(&token);
        assert!(decoded_claims.is_err());
    }
}
