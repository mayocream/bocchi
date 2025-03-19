pub mod mailgun;

#[derive(Debug, Clone)]
pub enum Email {
    Mailgun(mailgun::Mailgun),
    Noop,
}

impl Default for Email {
    fn default() -> Self {
        Self::Noop
    }
}

impl Email {
    pub async fn send(&self, to: &str, subject: &str, body: &str) -> anyhow::Result<()> {
        match self {
            Self::Mailgun(mailgun) => mailgun.send(to, subject, body).await,
            Self::Noop => Ok(()),
        }
    }
}
