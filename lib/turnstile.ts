export const verify = async (token: string) => {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: token,
        secret: process.env.TURNSTILE_SECRET_KEY!,
      }),
    },
  )

  if (!response.ok) {
    console.error('Failed to contact Turnstile')
    return false
  }

  const data = await response.json()
  return !!data.success
}
