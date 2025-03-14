use tracing::{error, info};

#[derive(Debug)]
pub struct Mailgun {
    api_key: String,
    domain: String,
}

impl Mailgun {
    pub fn new(api_key: &str, domain: &str) -> Self {
        Mailgun {
            api_key: api_key.to_string(),
            domain: domain.to_string(),
        }
    }

    #[tracing::instrument]
    async fn send_email(
        &self,
        from: &str,
        to: &str,
        subject: &str,
        text: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let client = reqwest::Client::new();
        let url = format!("https://api.mailgun.net/v3/{}/messages", self.domain);
        let res = client
            .post(&url)
            .basic_auth("api", Some(&self.api_key))
            .form(&[
                ("from", from),
                ("to", to),
                ("subject", subject),
                ("text", text),
            ])
            .send()
            .await?;

        if !res.status().is_success() {
            error!(
                "Failed to send email to {}: reason: {}",
                to,
                res.text().await?
            );
            return Err("Failed to send email".into());
        }

        info!("Sent email to {}", to);

        Ok(())
    }

    #[tracing::instrument]
    pub async fn send_verification_email(
        &self,
        to: &str,
        verification_code: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        self.send_email(
            format!("noreply@{}", self.domain).as_str(),
            to,
            "[Bocchi Social] Verify your email address",
            &format!(
                "Please verify your email address by entering the following code: {}",
                verification_code
            ),
        )
        .await
    }
}
