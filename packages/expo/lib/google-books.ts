export const googleBooks = async (
  path: string,
  params?: Record<string, string>
) => {
  const url = new URL(`https://www.googleapis.com/books/v1${path}`)
  for (const key in params) {
    url.searchParams.set(key, params[key])
  }
  const response = await fetch(url.toString())
  return await response.json()
}
