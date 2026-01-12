/**
 * Supabase 클라이언트 (API Route용)
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export function createClient(request: NextRequest, response?: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          if (response) {
            response.cookies.set({ name, value, ...options })
          }
        },
        remove(name: string, options: CookieOptions) {
          if (response) {
            response.cookies.set({ name, value: '', ...options })
          }
        },
      },
    }
  )
}
