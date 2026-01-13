/**
 * 인증 설정 관리 컴포넌트
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/onesaas-core/ui'
import { SUPPORTED_PROVIDERS, PROVIDER_META, type AuthProviderType } from '@/onesaas-core/auth/config'

interface AuthSettingsProps {
  onSettingsChange?: (settings: AuthSettings) => void
}

export interface AuthSettings {
  enabled: boolean
  providers: {
    [key in AuthProviderType]: boolean
  }
}

export function AuthSettingsManager({ onSettingsChange }: AuthSettingsProps) {
  const [settings, setSettings] = useState<AuthSettings>({
    enabled: true,
    providers: {
      email: true,
      google: true,
      kakao: true,
      github: false,
    },
  })

  const [envValues, setEnvValues] = useState({
    NEXT_PUBLIC_AUTH_ENABLED: 'true',
    NEXT_PUBLIC_AUTH_PROVIDERS: 'email,google,kakao,github',
    ADMIN_AUTH_PROVIDERS: 'email',
  })

  const [showEnvHelper, setShowEnvHelper] = useState(false)

  // 설정이 변경될 때마다 환경 변수 값 업데이트
  useEffect(() => {
    const enabledProviders = Object.entries(settings.providers)
      .filter(([_, enabled]) => enabled)
      .map(([provider]) => provider)
      .join(',')

    const newEnvValues = {
      NEXT_PUBLIC_AUTH_ENABLED: settings.enabled ? 'true' : 'false',
      NEXT_PUBLIC_AUTH_PROVIDERS: enabledProviders,
      ADMIN_AUTH_PROVIDERS: 'email', // 관리자는 항상 이메일만
    }

    setEnvValues(newEnvValues)
    onSettingsChange?.(settings)
  }, [settings, onSettingsChange])

  const toggleProvider = (provider: AuthProviderType) => {
    setSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: !prev.providers[provider],
      },
    }))
  }

  const toggleAuth = () => {
    setSettings(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }))
  }

  const copyToClipboard = () => {
    const envText = Object.entries(envValues)
      .map(([key, value]) => `${key}="${value}"`)
      .join('\n')

    navigator.clipboard.writeText(envText).then(() => {
      alert('환경 변수가 클립보드에 복사되었습니다!')
    })
  }

  return (
    <div className="space-y-6">
      {/* 전체 인증 활성화 */}
      <div className="flex items-center justify-between p-4 rounded-lg border">
        <div>
          <h3 className="font-semibold">인증 기능 활성화</h3>
          <p className="text-sm text-gray-600">모든 인증 기능을 켜거나 끌 수 있습니다</p>
        </div>
        <Button
          onClick={toggleAuth}
          variant={settings.enabled ? 'primary' : 'outline'}
        >
          {settings.enabled ? '활성화' : '비활성화'}
        </Button>
      </div>

      {/* 소셜 로그인 제공자 설정 */}
      <div className="space-y-4">
        <h3 className="font-semibold">소셜 로그인 제공자</h3>
        
        {SUPPORTED_PROVIDERS.map((provider) => {
          const meta = PROVIDER_META[provider]
          const isEnabled = settings.providers[provider]
          
          return (
            <div
              key={provider}
              className={`p-4 rounded-lg border-2 transition-all ${
                isEnabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: meta.bgColor, color: meta.color }}
                  >
                    <span className="text-lg">{meta.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{meta.name}</h4>
                    <p className="text-sm text-gray-600">
                      {provider === 'email' && '이메일/비밀번호 로그인'}
                      {provider === 'google' && 'Google 계정으로 로그인'}
                      {provider === 'kakao' && '카카오 계정으로 로그인'}
                      {provider === 'github' && 'GitHub 계정으로 로그인'}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => toggleProvider(provider)}
                  variant={isEnabled ? 'primary' : 'outline'}
                  size="sm"
                >
                  {isEnabled ? '사용' : '사용 안함'}
                </Button>
              </div>

              {/* 제공자별 설정 가이드 */}
              {isEnabled && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <p className="text-sm font-medium mb-2">설정 가이드:</p>
                  {provider === 'email' && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 별도의 설정이 필요 없습니다</li>
                      <li>• Supabase 인증이 자동으로 처리합니다</li>
                    </ul>
                  )}
                  {provider === 'google' && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Google Cloud Console에서 OAuth 클라이언트 생성</li>
                      <li>• Supabase Authentication &gt; Providers &gt; Google에서 설정</li>
                      <li>• 리디렉션 URI: https://[PROJECT].supabase.co/auth/v1/callback</li>
                    </ul>
                  )}
                  {provider === 'kakao' && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 카카오 개발자 센터에서 앱 생성</li>
                      <li>• Supabase Authentication &gt; Providers &gt; Kakao에서 설정</li>
                      <li>• 카카오 로그인 활성화 및 Redirect URI 설정</li>
                    </ul>
                  )}
                  {provider === 'github' && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• GitHub Settings &gt; Developer settings &gt; OAuth Apps</li>
                      <li>• Supabase Authentication &gt; Providers &gt; GitHub에서 설정</li>
                      <li>• Authorization callback URL 설정</li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 환경 변수 안내 */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">환경 변수 설정</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEnvHelper(!showEnvHelper)}
            >
              {showEnvHelper ? '숨기기' : '보기'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
            >
              복사
            </Button>
          </div>
        </div>

        {showEnvHelper && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              아래 환경 변수를 .env 파일에 추가하세요:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {Object.entries(envValues)
                .map(([key, value]) => `${key}="${value}"`)
                .join('\n')}
            </pre>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>중요:</strong> 환경 변수를 변경한 후에는 개발 서버를 재시작해야 합니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 미리보기 */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">로그인 페이지 미리보기</h3>
        <div className="space-y-2">
          {settings.enabled ? (
            <>
              {Object.entries(settings.providers)
                .filter(([_, enabled]) => enabled)
                .map(([provider]) => {
                  const meta = PROVIDER_META[provider as AuthProviderType]
                  return (
                    <div
                      key={provider}
                      className="flex items-center gap-2 p-2 border rounded"
                      style={{ backgroundColor: meta.bgColor + '20' }}
                    >
                      <span>{meta.icon}</span>
                      <span className="text-sm">{meta.name} 로그인 활성화</span>
                    </div>
                  )
                })}
            </>
          ) : (
            <p className="text-gray-500 text-sm">인증 기능이 비활성화되어 있습니다</p>
          )}
        </div>
      </div>
    </div>
  )
}