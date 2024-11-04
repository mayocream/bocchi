export const fetchApiEndpoint = async (endpoint: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`
  )
  const data = await response.json()
  return data
}
