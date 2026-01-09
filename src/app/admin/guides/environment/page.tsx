'use client'

import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'

export default function EnvironmentGuidePage() {
  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* 뒤로가기 */}
        <Link
          href="/admin/guides"
          className="inline-flex items-center gap-2 text-sm"
          style={{ color: 'var(--color-accent)' }}
        >
          ← 가이드 목록으로
        </Link>

        {/* 헤더 */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">⚙️</span>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                환경변수 가이드
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                환경변수 설정과 보안 관리 방법
              </p>
            </div>
          </div>
        </div>

        {/* 환경변수가 뭐예요? */}
        <Card>
          <CardHeader>
            <CardTitle>🤔 환경변수가 뭐예요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p style={{ color: 'var(--color-text)' }}>
                <strong>환경변수</strong>는 비밀번호나 중요한 설정을 저장하는 <strong>비밀 금고</strong>예요!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: '#fef2f2' }}>
                <p className="text-2xl mb-2">❌</p>
                <p className="font-medium" style={{ color: '#991b1b' }}>코드에 직접 쓰면</p>
                <p className="text-sm" style={{ color: '#991b1b' }}>
                  다른 사람이 볼 수 있어요!
                  <br />
                  해킹 위험! 😱
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#dcfce7' }}>
                <p className="text-2xl mb-2">✅</p>
                <p className="font-medium" style={{ color: '#166534' }}>환경변수에 저장하면</p>
                <p className="text-sm" style={{ color: '#166534' }}>
                  나만 알 수 있어요!
                  <br />
                  안전하게 보관! 🔒
                </p>
              </div>
            </div>

            <p style={{ color: 'var(--color-text-secondary)' }}>
              비밀번호, API 키 같은 중요한 정보는 항상 환경변수에 저장해야 해요!
            </p>
          </CardContent>
        </Card>

        {/* .env 파일 */}
        <Card>
          <CardHeader>
            <CardTitle>📄 .env 파일이란?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text)' }}>
              <strong>.env</strong> 파일은 환경변수를 저장하는 파일이에요.
            </p>

            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                .env 파일 예시:
              </p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                <p><span style={{ color: '#9cdcfe' }}>DATABASE_URL</span>=<span style={{ color: '#ce9178' }}>&quot;postgresql://...&quot;</span></p>
                <p><span style={{ color: '#9cdcfe' }}>NEXT_PUBLIC_SUPABASE_URL</span>=<span style={{ color: '#ce9178' }}>&quot;https://xxx.supabase.co&quot;</span></p>
                <p><span style={{ color: '#9cdcfe' }}>OPENAI_API_KEY</span>=<span style={{ color: '#ce9178' }}>&quot;sk-xxx&quot;</span></p>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#fef2f2', border: '2px solid #ef4444' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>🚨 절대 주의!</strong>
                <br />
                .env 파일은 <strong>절대로</strong> GitHub에 올리면 안 돼요!
                <br />
                (걱정 마세요, 이미 .gitignore에 추가되어 있어요)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 필수 환경변수 */}
        <Card>
          <CardHeader>
            <CardTitle>📋 필수 환경변수 목록</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              이 프로젝트에서 필요한 환경변수들이에요:
            </p>

            {/* 데이터베이스 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🗄️</span>
                <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>데이터베이스 (필수)</h4>
              </div>
              <div className="space-y-2 font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <p><strong>DATABASE_URL</strong> - 데이터베이스 주소</p>
                <p><strong>DIRECT_URL</strong> - 직접 연결 주소</p>
              </div>
            </div>

            {/* Supabase */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💚</span>
                <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>Supabase (필수)</h4>
              </div>
              <div className="space-y-2 font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <p><strong>NEXT_PUBLIC_SUPABASE_URL</strong> - Supabase 프로젝트 URL</p>
                <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> - 공개 키</p>
              </div>
            </div>

            {/* 결제 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💳</span>
                <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>결제 (선택)</h4>
              </div>
              <div className="space-y-2 font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <p><strong>PORTONE_API_KEY</strong> - PortOne API 키</p>
                <p><strong>PORTONE_API_SECRET</strong> - PortOne 비밀 키</p>
              </div>
            </div>

            {/* AI */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🤖</span>
                <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>AI (선택)</h4>
              </div>
              <div className="space-y-2 font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <p><strong>OPENAI_API_KEY</strong> - OpenAI API 키</p>
              </div>
            </div>

            {/* 운영 설정 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚙️</span>
                <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>운영 설정</h4>
              </div>
              <div className="space-y-2 font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <p><strong>NEXT_PUBLIC_DEMO_MODE</strong> - 데모 모드 (true/false)</p>
                <p><strong>NEXT_PUBLIC_ADMIN_EMAILS</strong> - 관리자 이메일 (쉼표로 구분)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEXT_PUBLIC 설명 */}
        <Card>
          <CardHeader>
            <CardTitle>🔤 NEXT_PUBLIC_가 뭐예요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: '#dbeafe' }}>
                <p className="font-medium mb-2" style={{ color: '#1e40af' }}>
                  NEXT_PUBLIC_으로 시작하면
                </p>
                <p className="text-sm" style={{ color: '#1e40af' }}>
                  브라우저에서도 사용 가능해요
                  <br />
                  (사용자도 볼 수 있어요)
                </p>
                <p className="mt-2 text-xs font-mono" style={{ color: '#1e40af' }}>
                  예: NEXT_PUBLIC_SUPABASE_URL
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#fef3c7' }}>
                <p className="font-medium mb-2" style={{ color: '#92400e' }}>
                  NEXT_PUBLIC_ 없으면
                </p>
                <p className="text-sm" style={{ color: '#92400e' }}>
                  서버에서만 사용 가능해요
                  <br />
                  (사용자가 볼 수 없어요)
                </p>
                <p className="mt-2 text-xs font-mono" style={{ color: '#92400e' }}>
                  예: OPENAI_API_KEY
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#fef2f2', border: '2px solid #ef4444' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>⚠️ 중요!</strong>
                <br />
                비밀 키(API_SECRET, API_KEY 등)는 <strong>절대</strong> NEXT_PUBLIC_를 붙이면 안 돼요!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vercel에서 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>☁️ Vercel에서 환경변수 설정하기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              배포할 때는 Vercel에 환경변수를 설정해야 해요:
            </p>

            <div className="space-y-6">
              {/* 단계 1 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    Vercel 대시보드 접속
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
                      vercel.com/dashboard
                    </a>에 접속
                  </p>
                </div>
              </div>

              {/* 단계 2 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    프로젝트 선택 → Settings
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    프로젝트 클릭 후 &quot;Settings&quot; 탭 클릭
                  </p>
                </div>
              </div>

              {/* 단계 3 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    Environment Variables 클릭
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    왼쪽 메뉴에서 &quot;Environment Variables&quot; 클릭
                  </p>
                </div>
              </div>

              {/* 단계 4 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    환경변수 추가
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    Key에 변수 이름, Value에 값 입력 후 &quot;Add&quot; 클릭
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#dcfce7', border: '2px solid #10b981' }}>
              <p style={{ color: '#166534' }}>
                <strong>💡 팁:</strong> 환경변수 추가 후 <strong>재배포</strong>해야 적용돼요!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 다음 단계 */}
        <div className="flex justify-between">
          <Link
            href="/admin/guides/database"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
          >
            ← 데이터베이스 가이드
          </Link>
          <Link
            href="/admin/guides/security"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            다음: 보안 가이드 →
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
