import { endSession } from '@/app/lib/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const GET = async () => {
  endSession()
  revalidatePath('/dashboard')
  return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL!)
}
