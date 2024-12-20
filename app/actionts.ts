'use server'

import { User } from '@/lib/schema'
import { verify } from '@/lib/turnstile'
import * as blocklist from '@/lib/blocklist'
import { prisma } from '@/lib/storage'
import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import * as argon2 from 'argon2'
import { revalidatePath } from 'next/cache'

export const signup = async (form: FormData) => {
  if (!verify(form.get('cf-turnstile-response') as string)) {
    return { message: '人間が確認できませんでした。' }
  }

  if (blocklist.usernames.includes(form.get('username') as string)) {
    return { message: 'このユーザー名は使用できません。' }
  }

  const validated = User.pick({
    email: true,
    username: true,
    password: true,
  }).safeParse(Object.fromEntries(form))

  if (!validated.success) {
    console.log(validated.error.message)
    return { message: '入力内容が正しくありません。' }
  }

  if (
    await prisma.user.findUnique({ where: { email: validated.data.email } })
  ) {
    return { message: 'このメールアドレスは既に使用されています。' }
  }

  if (
    await prisma.user.findUnique({
      where: { username: validated.data.username },
    })
  ) {
    return { message: 'このユーザー名は既に使用されています。' }
  }

  const user = await prisma.user.create({
    data: {
      email: validated.data.email,
      username: validated.data.username,
      password: await argon2.hash(validated.data.password),
    },
  })

  createSession(user)
  revalidatePath('/')
  return redirect('/')
}

export const login = async (form: FormData) => {
  if (!verify(form.get('cf-turnstile-response') as string)) {
    return { message: '人間が確認できませんでした。' }
  }

  const validated = User.pick({
    username: true,
    password: true,
  }).safeParse(Object.fromEntries(form))

  if (!validated.success) {
    return { message: '入力内容が正しくありません。' }
  }

  const user = await prisma.user.findUnique({
    where: { username: validated.data.username },
  })

  if (!user || !(await argon2.verify(user.password, validated.data.password))) {
    return { message: 'ユーザー名またはパスワードが正しくありません。' }
  }

  createSession(user)
  revalidatePath('/')
  return redirect('/')
}
