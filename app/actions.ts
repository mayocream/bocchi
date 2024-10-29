'use server'

import { redirect } from 'next/navigation'
import { getToken, setUserCookie } from './lib/auth'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function createAccount(prev, formData: FormData) {
  const data = Object.fromEntries(formData)
  data.token = data['cf-turnstile-response']
  delete data['cf-turnstile-response']
  const response = await fetch(`${API_URL}/accounts`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    return error
  }

  return redirect('/login')
}

export async function createSession(prev, formData: FormData) {
  const data = Object.fromEntries(formData)
  data.token = data['cf-turnstile-response']
  delete data['cf-turnstile-response']
  const response = await fetch(`${API_URL}/accounts/sessions`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    return error
  }

  const content = await response.json()
  const jwt = content.token

  setUserCookie(jwt)
  return redirect('/')
}

export async function sendTweet(prev, formData: FormData) {
  const data = Object.fromEntries(formData)
  const response = await fetch(`${API_URL}/tweets`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    return { success: false, error }
  }

  revalidatePath('/')

  return {
    success: true,
    tweet: await response.json(),
  }
}
