use prost_types::Timestamp;

pub trait TimestampConversion {
    fn to_timestamp(&self) -> Timestamp;
}

impl TimestampConversion for chrono::DateTime<chrono::Utc> {
    fn to_timestamp(&self) -> Timestamp {
        let ts = self.timestamp();
        let n = self.timestamp_subsec_nanos();
        Timestamp {
            seconds: ts,
            nanos: n as i32,
        }
    }
}
