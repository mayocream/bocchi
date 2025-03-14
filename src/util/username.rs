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
