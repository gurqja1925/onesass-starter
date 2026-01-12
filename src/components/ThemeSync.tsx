'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/onesaas-core/auth/provider'
import { useTheme } from '@/onesaas-core/themes/ThemeProvider'
import type { ThemeId } from '@/onesaas-core/plugins/types'

/**
 * DB에 저장된 사용자 테마를 자동으로 동기화하는 컴포넌트
 */
export function ThemeSync() {
  const { user } = useAuth()
  const { setTheme } = useTheme()
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    // user가 로드되고 아직 동기화하지 않았으면 DB 테마 적용
    if (user && !synced && user.user_metadata?.theme) {
      const dbTheme = user.user_metadata.theme as ThemeId
      setTheme(dbTheme)
      setSynced(true)
    }
  }, [user, synced, setTheme])

  return null
}
