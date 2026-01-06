import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface AuthConfig {
  enabled: boolean
  providers: string[]
}

export function getAuthConfig(): AuthConfig {
  try {
    const configPath = join(process.cwd(), 'onesaas.json')
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'))
      return {
        enabled: config.features?.auth?.enabled ?? true,
        providers: config.features?.auth?.providers ?? ['email'],
      }
    }
  } catch {
    // 설정 파일 없으면 기본값
  }
  return {
    enabled: true,
    providers: ['email'],
  }
}

export function isProviderEnabled(provider: string): boolean {
  const config = getAuthConfig()
  return config.enabled && config.providers.includes(provider)
}
