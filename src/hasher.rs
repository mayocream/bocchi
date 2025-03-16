use blake3::Hasher as Blake3Hasher;
use chrono::Utc;

#[derive(Debug, Clone)]
pub struct Hasher {
    key: [u8; 32],
}

impl Hasher {
    pub fn new(key: [u8; 32]) -> Self {
        Self { key }
    }

    pub fn generate_time_based_verification_code(&self, data: &str) -> u32 {
        let time_chunk = Utc::now().timestamp() / 600;
        self.generate_with_time(data, time_chunk)
    }

    fn generate_with_time(&self, data: &str, time_chunk: i64) -> u32 {
        let data = format!("{}:{}", data, time_chunk);

        let mut hasher = Blake3Hasher::new_keyed(&self.key);
        let hash = hasher.update(data.as_bytes()).finalize();
        let hash = hash.as_bytes();
        let hash = u32::from_be_bytes([hash[0], hash[1], hash[2], hash[3]]);
        hash % 1_000_000
    }

    pub fn check_verification_code(&self, data: &str, code: u32) -> bool {
        let current_time = Utc::now().timestamp() / 600;
        let current_code = self.generate_with_time(data, current_time);
        let prev_code = self.generate_with_time(data, current_time - 1);

        code == current_code || code == prev_code
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_verification() {
        let key = [0; 32];
        let v = Hasher::new(key);

        let data = "test";
        let code = v.generate_time_based_verification_code(data);
        assert!(v.check_verification_code(data, code));
    }
}
