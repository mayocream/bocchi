pub mod bocchi {
    tonic::include_proto!("bocchi");
}
pub mod api;
pub mod config;
pub mod hasher;
pub mod mail;
pub mod server;
pub mod state;
pub mod storage;
pub mod token;
pub mod util;
