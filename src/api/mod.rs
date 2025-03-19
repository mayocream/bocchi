use std::sync::Arc;

use crate::config::Config;

#[derive(Debug, Clone)]
pub struct AppState {
    pub config: Config,
    pub db: sqlx::PgPool,
}

pub type SharedAppState = Arc<AppState>;
