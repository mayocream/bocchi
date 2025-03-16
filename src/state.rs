use std::{fmt::Debug, sync::Arc};

use sea_orm::DatabaseConnection;

use crate::{config::Config, hasher::Hasher, mail::EmailProvider, storage::s3::S3, token::Token};

#[derive(Debug, Clone)]
pub struct AppState {
    pub config: Config,
    pub db: DatabaseConnection,
    pub mail: EmailProvider,
    pub token: Token,
    pub hasher: Hasher,
    pub s3: S3,
}

pub type SharedAppState = Arc<AppState>;
