use std::sync::Arc;

use sea_orm::DatabaseConnection;

use crate::config::Config;

mod bocchi {
    tonic::include_proto!("bocchi");
}

mod user;

#[derive(Debug, Clone)]
pub struct AppState {
    config: Config,
    database: DatabaseConnection,
}

type SharedAppState = Arc<AppState>;
