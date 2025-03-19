use std::sync::Arc;

use crate::{api::AppState, config::Config};

pub async fn serve(config: Config) -> Result<(), Box<dyn std::error::Error>> {
    let _ = Arc::new(AppState {
        config: config.clone(),
        db: sqlx::PgPool::connect(&config.database_url).await?,
    });

    Ok(())
}
