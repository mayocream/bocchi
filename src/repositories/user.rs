use chrono::Utc;
use sqlx::{FromRow, PgPool};

#[derive(Debug, FromRow)]
pub struct User {
    pub id: i32,
    pub uid: String,
    pub name: Option<String>,
    pub username: String,
    pub email: String,
    pub email_verified: bool,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub cover_url: Option<String>,
    pub created_at: chrono::DateTime<Utc>,
    pub updated_at: chrono::DateTime<Utc>,
}

pub async fn find_by_username(conn: &PgPool, username: &str) -> Result<User, sqlx::Error> {
    sqlx::query_as!(User, "SELECT * FROM users WHERE username = $1", username)
        .fetch_one(conn)
        .await
}

pub async fn find_by_email(conn: &PgPool, email: &str) -> Result<User, sqlx::Error> {
    sqlx::query_as!(User, "SELECT * FROM users WHERE email = $1", email)
        .fetch_one(conn)
        .await
}

pub async fn find_by_uid(conn: &PgPool, uid: &str) -> Result<User, sqlx::Error> {
    sqlx::query_as!(User, "SELECT * FROM users WHERE uid = $1", uid)
        .fetch_one(conn)
        .await
}

pub async fn find_by_id(conn: &PgPool, id: i32) -> Result<User, sqlx::Error> {
    sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
        .fetch_one(conn)
        .await
}
