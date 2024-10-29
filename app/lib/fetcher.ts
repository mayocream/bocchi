const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getTweet = async (id: number) => {
  const response = await fetch(`${API_URL}/tweets/${id}`, {
    headers: {
      accept: 'application/json',
    },
  })
  return await response.json()
}

export const getAccount = async (id: number) => {
  const response = await fetch(`${API_URL}/accounts/${id}`, {
    headers: {
      accept: 'application/json',
    },
  })
  return await response.json()
}

export const getTweets = async () => {
  const response = await fetch(`${API_URL}/tweets`, {
    headers: {
      accept: 'application/json',
    },
  })
  return await response.json()
}

export const getAccountFollowers = async (id: number) => {
  const response = await fetch(`${API_URL}/accounts/${id}/followers`, {
    headers: {
      accept: 'application/json',
    },
  })
  return await response.json()
}

export const getAccountFollowing = async (id: number) => {
  const response = await fetch(`${API_URL}/accounts/${id}/following`, {
    headers: {
      accept: 'application/json',
    },
  })
  return await response.json()
}
