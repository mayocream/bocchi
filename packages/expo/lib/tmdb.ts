import { fetch } from 'expo/fetch'

const API_KEY = process.env.EXPO_PUBLIC_TMDB_KEY!

export const tmdb = async (
  path: string,
  params: Record<string, string> = {}
) => {
  const url = new URL(`https://api.themoviedb.org/3${path}`)
  for (const key in params) {
    url.searchParams.set(key, params[key])
  }
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  })
  return await response.json()
}
