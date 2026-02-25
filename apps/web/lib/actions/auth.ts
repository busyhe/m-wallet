'use server'

import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'mw-auth'
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Verify password and set auth cookie
export async function verifyPassword(password: string): Promise<boolean> {
  const correctPassword = process.env.LOCK_PASSWORD
  if (!correctPassword) return true // No password configured, allow access

  if (password === correctPassword) {
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/'
    })
    return true
  }
  return false
}

// Check if user is authenticated
export async function checkAuth(): Promise<boolean> {
  const correctPassword = process.env.LOCK_PASSWORD
  if (!correctPassword) return true // No password configured

  const cookieStore = await cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)
  return authCookie?.value === 'authenticated'
}

// Logout (clear auth cookie)
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}
