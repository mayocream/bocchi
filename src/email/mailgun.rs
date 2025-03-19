use tracing::error;

#[derive(Debug, Clone)]
pub struct Mailgun {
    pub api_key: String,
    pub domain: String,
    pub from: String,
}

impl Mailgun {
    pub async fn send(&self, to: &str, subject: &str, body: &str) -> anyhow::Result<()> {
        let client = reqwest::Client::new();
        let response = client
            .post(&format!(
                "https://api.mailgun.net/v3/{}/messages",
                self.domain
            ))
            .basic_auth("api", Some(&self.api_key))
            .form(&[
                ("from", self.from.as_str()),
                ("to", to),
                ("subject", subject),
                ("text", body),
            ])
            .send()
            .await?;

        if response.status().is_success() {
            Ok(())
        } else {
            let response = response.text().await?;
            error!("failed to send email: {}", response);
            Err(anyhow::anyhow!("failed to send email: {}", response))
        }
    }
}
