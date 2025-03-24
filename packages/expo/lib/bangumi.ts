import { Platform } from 'react-native'
const API_KEY = process.env.EXPO_PUBLIC_BANGUMI_KEY!
const API_URL = 'https://api.bgm.tv'
import Constants from 'expo-constants'

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
      // https://github.com/bangumi/api/blob/master/docs-raw/user%20agent.md
      'User-Agent': `mayocream/eki/${Constants.expoConfig?.version} (${Platform.OS})`,
    },
  })
  return await res.json()
}
