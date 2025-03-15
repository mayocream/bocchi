pub mod bocchi {
    tonic::include_proto!("bocchi");
}
pub mod auth;
pub mod health;
pub mod interceptor;
pub mod jwt;
pub mod mail;
pub mod state;
pub mod util;
