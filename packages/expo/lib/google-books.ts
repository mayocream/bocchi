export const googleBooks = async (isbn: string) => {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
  )
  return await res.json()
}
