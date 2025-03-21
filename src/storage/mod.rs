pub mod s3;

#[derive(Debug)]
pub struct Blob {
    mime: String,
    content: Vec<u8>,
}

impl Blob {
    pub fn new(mime: String, content: Vec<u8>) -> Self {
        Self { mime, content }
    }

    pub fn from(content: Vec<u8>) -> Self {
        Self {
            mime: detect_mime(&content),
            content,
        }
    }
}

pub fn detect_mime(content: &[u8]) -> String {
    infer::get(content)
        .map(|x| x.mime_type().to_string())
        .unwrap_or("application/octet-stream".to_string())
}
