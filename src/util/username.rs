use std::sync::LazyLock;

use regex::Regex;
use validator::ValidationError;

static USERNAME_REGEX: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^[a-zA-Z0-9_]+$").expect("Failed to compile username regex"));

pub fn validate_username(username: &str) -> Result<(), ValidationError> {
    if username.len() < 3 {
        return Err(ValidationError::new("username is too short"));
    }

    if username.len() > 20 {
        return Err(ValidationError::new("username is too long"));
    }

    if !USERNAME_REGEX.is_match(username) {
        return Err(ValidationError::new("username contains invalid characters"));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_username() {
        assert!(validate_username("ferris").is_ok());
        assert!(validate_username("ferris42").is_ok());
        assert!(validate_username("ferris_42").is_ok());
        assert!(validate_username("ferris-42").is_err());
        assert!(validate_username("ferris!").is_err());
        assert!(validate_username("ferris@").is_err());
        assert!(validate_username("ferris#").is_err());
        assert!(validate_username("ferris$").is_err());
        assert!(validate_username("ferris%").is_err());
        assert!(validate_username("ferris^").is_err());
        assert!(validate_username("ferris&").is_err());
        assert!(validate_username("ferris*").is_err());
        assert!(validate_username("ferris(").is_err());
        assert!(validate_username("ferris)").is_err());
        assert!(validate_username("ferris+").is_err());
        assert!(validate_username("ferris=").is_err());
        assert!(validate_username("ferris{").is_err());
        assert!(validate_username("ferris}").is_err());
        assert!(validate_username("ferris[").is_err());
        assert!(validate_username("ferris]").is_err());
        assert!(validate_username("ferris|").is_err());
        assert!(validate_username("ferris\\").is_err());
        assert!(validate_username("ferris:").is_err());
        assert!(validate_username("ferris;").is_err());
        assert!(validate_username("ferris\"").is_err());
        assert!(validate_username("ferris'").is_err());
        assert!(validate_username("ferris<").is_err());
        assert!(validate_username("ferris>").is_err());
        assert!(validate_username("ferris?").is_err());
        assert!(validate_username("ferris/").is_err());
        assert!(validate_username("ferris`").is_err());
        assert!(validate_username("ferris~").is_err());
    }
}
