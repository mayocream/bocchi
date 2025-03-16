use aws_config::BehaviorVersion;

pub struct MediaService {

}

impl MediaService {
    pub async fn new() -> Self {
        let config = aws_config::load_defaults(BehaviorVersion::latest()).await;
        MediaService {}
    }
}
