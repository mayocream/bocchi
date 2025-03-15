use std::{fmt::Debug, sync::Arc};

use sea_orm::DatabaseConnection;

use crate::{jwt::Jwt, mail::EmailProvider, util::verifier::Verifier};

#[derive(Debug, Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub mail: EmailProvider,
    pub jwt: Jwt,
    pub verifier: Verifier,
}

pub type SharedAppState = Arc<AppState>;
