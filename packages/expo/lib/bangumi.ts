const API_KEY = process.env.EXPO_PUBLIC_BANGUMI_KEY!
const API_URL = 'https://api.bgm.tv'

export const bangumi = async (
  path: string,
  params: Record<string, string> = {},
  body?: Record<string, any>
) => {
  const url = new URL(`${API_URL}${path}`)
  for (const key in params) {
    url.searchParams.set(key, params[key])
  }
  const res = await fetch(url.toString(), {
    method: body ? 'POST' : 'GET',
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      authorization: `Bearer ${API_KEY}`,
      'User-Agent': 'Bangumi App',
    },
  })
  return await res.json()
}
