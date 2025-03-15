use std::fmt::Debug;

use reqwest::Client;
use tracing::{error, info};

#[derive(Debug, Clone)]
pub enum EmailProvider {
    Mailgun(Mailgun),
    Noop,
}

#[derive(Debug, Clone)]
pub struct Mailgun {
    api_url: String,
    api_key: String,
    client: Client,
    sender: String,
}

impl Mailgun {
    pub fn new(api_key: String, domain: String) -> Self {
        let api_url = format!("https://api.mailgun.net/v3/{}/messages", domain);
        let sender = format!("noreply@{}", domain);
        Self {
            api_key,
            api_url,
            client: Client::new(),
            sender,
        }
    }
}

impl EmailProvider {
    #[tracing::instrument]
    pub async fn send_email(
        &self,
        to: &str,
        subject: &str,
        text: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        match self {
            Self::Mailgun(mailgun) => {
                let res = mailgun
                    .client
                    .post(&mailgun.api_url)
                    .basic_auth("api", Some(&mailgun.api_key))
                    .form(&[
                        ("from", mailgun.sender.as_str()),
                        ("to", to),
                        ("subject", subject),
                        ("text", text),
                    ])
                    .send()
                    .await?;

                if !res.status().is_success() {
                    let error_text = res.text().await?;
                    error!("Failed to send email to {}: reason: {}", to, error_text);
                    return Err("Failed to send email".into());
                }

                info!("Sent email to {}", to);
                Ok(())
            }
            Self::Noop => Ok(()),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[ignore]
    #[tokio::test]
    async fn test_mailgun() -> Result<(), Box<dyn std::error::Error>> {
        dotenvy::dotenv()?;
        let mailgun = Mailgun::new(dotenvy::var("MAILGUN_API_KEY")?, dotenvy::var("DOMAIN")?);
        let email_provider = EmailProvider::Mailgun(mailgun);

        email_provider
            .send_email(
                "mayo@linux.com",
                "The quick brown fox",
                "jumps over the lazy dog",
            )
            .await
            .expect("Failed to send email");

        Ok(())
    }

    #[tokio::test]
    async fn test_noop() {
        let email_provider = EmailProvider::Noop;
        assert!(email_provider.send_email("", "", "").await.is_ok());
    }
}
