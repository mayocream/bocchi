export const query = async (url: string, init?: RequestInit) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, init)
  if (!res.ok) {
    return null
  }
  return res.json()
}
