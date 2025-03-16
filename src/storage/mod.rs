use anyhow::{Context, Result};

pub mod s3;

#[derive(Clone, Debug)]
pub struct Blob {
    pub mime: String,
    pub content: Vec<u8>,
}

impl Blob {
    pub fn new(mime: String, content: Vec<u8>) -> Self {
        Self { mime, content }
    }
}

// Detect MIME type based on magic bytes
pub fn detect_mime(content: &Vec<u8>) -> Result<String> {
    let mime = infer::get(content)
        .context("Failed to detect MIME type")?
        .to_string();

    Ok(mime)
}
