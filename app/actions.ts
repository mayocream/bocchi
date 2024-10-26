'use server'

import { redirect } from 'next/navigation'
import { setUserCookie } from './lib/auth'
import { NextResponse } from 'next/server'

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
    const error = await response.json<string>()
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
    const error = await response.json<string>()
    return error
  }

  const content = await response.json<any>()
  const jwt = content.token

  setUserCookie(jwt)
  return redirect('/')
}

export async function tweet(prev, formData: FormData) {
  const data = Object.fromEntries(formData)
  const response = await fetch(`${API_URL}/tweets`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json<string>()
    return error
  }

  return await response.json<any>()
}
