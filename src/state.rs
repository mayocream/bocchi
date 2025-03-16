use std::{fmt::Debug, sync::Arc};

use sea_orm::DatabaseConnection;

use crate::{hasher::Hasher, mail::EmailProvider, token::Token};

#[derive(Debug, Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub mail: EmailProvider,
    pub token: Token,
    pub hasher: Hasher,
}

pub type SharedAppState = Arc<AppState>;
