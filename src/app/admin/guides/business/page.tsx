'use client'

import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'

export default function BusinessGuidePage() {
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
            <span className="text-5xl">💼</span>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                SaaS 비즈니스 가이드
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                SaaS 서비스 운영의 기본 개념과 비즈니스 모델
              </p>
            </div>
          </div>
        </div>

        {/* SaaS가 뭐예요? */}
        <Card>
          <CardHeader>
            <CardTitle>🤔 SaaS가 뭐예요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p style={{ color: 'var(--color-text)' }}>
                <strong>SaaS</strong> = <strong>S</strong>oftware <strong>a</strong>s <strong>a</strong> <strong>S</strong>ervice
                <br />
                <br />
                쉽게 말해, <strong>매달 돈 받고 서비스를 제공하는 사업</strong>이에요!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: '#fef2f2' }}>
                <p className="text-2xl mb-2">📦</p>
                <p className="font-medium" style={{ color: '#991b1b' }}>옛날 방식</p>
                <p className="text-sm" style={{ color: '#991b1b' }}>
                  소프트웨어를 한 번 사면 끝
                  <br />
                  예: CD로 프로그램 구매
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: '#dcfce7' }}>
                <p className="text-2xl mb-2">☁️</p>
                <p className="font-medium" style={{ color: '#166534' }}>SaaS 방식</p>
                <p className="text-sm" style={{ color: '#166534' }}>
                  매달 구독료를 내고 사용
                  <br />
                  예: 넷플릭스, 노션, 슬랙
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#dbeafe' }}>
              <p style={{ color: '#1e40af' }}>
                <strong>💡 SaaS의 장점:</strong>
                <br />
                • 안정적인 월 수입 (구독료)
                <br />
                • 고객과 지속적인 관계
                <br />
                • 업데이트를 바로 제공 가능
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 관리자 vs 사용자 */}
        <Card>
          <CardHeader>
            <CardTitle>👥 관리자 vs 사용자 (가장 중요!)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
              <p style={{ color: '#92400e' }}>
                <strong>⚠️ 이것만 기억하세요!</strong>
                <br />
                <strong>관리자</strong>(당신) ≠ <strong>사용자</strong>(고객)
                <br />
                로그인도 다르고, 볼 수 있는 것도 달라요!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 관리자 */}
              <div className="p-6 rounded-lg" style={{ background: '#fef2f2', border: '2px solid #ef4444' }}>
                <div className="text-center mb-4">
                  <span className="text-5xl">👨‍💼</span>
                  <h3 className="text-xl font-bold mt-2" style={{ color: '#991b1b' }}>관리자 (당신)</h3>
                </div>
                <div className="space-y-2" style={{ color: '#991b1b' }}>
                  <p>✓ 서비스를 <strong>운영</strong>하는 사람</p>
                  <p>✓ <strong>/admin</strong> 페이지 접근 가능</p>
                  <p>✓ 모든 사용자 정보를 볼 수 있음</p>
                  <p>✓ 가격, 플랜 설정 가능</p>
                  <p>✓ 결제 내역 확인 가능</p>
                  <p>✓ 통계 및 분석 확인</p>
                </div>
                <div className="mt-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.5)' }}>
                  <p className="text-sm font-mono" style={{ color: '#991b1b' }}>
                    로그인: 관리자 이메일로 로그인
                    <br />
                    접근: /admin/*
                  </p>
                </div>
              </div>

              {/* 사용자 */}
              <div className="p-6 rounded-lg" style={{ background: '#dcfce7', border: '2px solid #10b981' }}>
                <div className="text-center mb-4">
                  <span className="text-5xl">👤</span>
                  <h3 className="text-xl font-bold mt-2" style={{ color: '#166534' }}>사용자 (고객)</h3>
                </div>
                <div className="space-y-2" style={{ color: '#166534' }}>
                  <p>✓ 서비스를 <strong>이용</strong>하는 사람</p>
                  <p>✓ 일반 페이지만 접근 가능</p>
                  <p>✓ 자기 정보만 볼 수 있음</p>
                  <p>✓ 구독 플랜 선택/결제</p>
                  <p>✓ 서비스 기능 사용</p>
                  <p>✓ 본인 계정 관리</p>
                </div>
                <div className="mt-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.5)' }}>
                  <p className="text-sm font-mono" style={{ color: '#166534' }}>
                    로그인: 회원가입 후 로그인
                    <br />
                    접근: /, /dashboard, /pricing
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                🔐 관리자 설정 방법
              </p>
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                환경변수에서 관리자 이메일을 지정하면 됩니다:
              </p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,owner@example.com
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                여러 명이면 쉼표(,)로 구분해요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 비즈니스 모델 */}
        <Card>
          <CardHeader>
            <CardTitle>💰 SaaS 수익 구조</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              SaaS는 보통 이런 식으로 돈을 벌어요:
            </p>

            <div className="space-y-4">
              {/* 무료 플랜 */}
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🆓</span>
                  <h4 className="font-bold" style={{ color: 'var(--color-text)' }}>무료 플랜 (Free)</h4>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  • 기본 기능만 제공
                  <br />
                  • 사용자를 끌어들이는 용도
                  <br />
                  • 유료로 전환하도록 유도
                </p>
              </div>

              {/* 프로 플랜 */}
              <div className="p-4 rounded-lg" style={{ background: '#dbeafe' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⭐</span>
                  <h4 className="font-bold" style={{ color: '#1e40af' }}>프로 플랜 (Pro)</h4>
                </div>
                <p className="text-sm" style={{ color: '#1e40af' }}>
                  • 대부분의 기능 제공
                  <br />
                  • 월 9,900원 ~ 29,000원 정도
                  <br />
                  • <strong>가장 많이 선택하는 플랜</strong>
                </p>
              </div>

              {/* 엔터프라이즈 */}
              <div className="p-4 rounded-lg" style={{ background: '#fef3c7' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏢</span>
                  <h4 className="font-bold" style={{ color: '#92400e' }}>엔터프라이즈 (Enterprise)</h4>
                </div>
                <p className="text-sm" style={{ color: '#92400e' }}>
                  • 모든 기능 + 전담 지원
                  <br />
                  • 회사/팀 단위 사용
                  <br />
                  • 가격 협의 (문의 필요)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#dcfce7', border: '2px solid #10b981' }}>
              <p style={{ color: '#166534' }}>
                <strong>💡 팁:</strong> 대부분의 수익은 <strong>Pro 플랜</strong>에서 나와요!
                <br />
                무료 플랜은 홍보용, 엔터프라이즈는 대형 고객용이에요.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 핵심 지표 */}
        <Card>
          <CardHeader>
            <CardTitle>📊 알아야 할 핵심 지표</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              SaaS 사업에서 꼭 봐야 할 숫자들이에요:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>MRR (월 반복 수익)</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  매달 들어오는 구독료 총합
                  <br />
                  예: 유료 사용자 100명 × 만원 = MRR 100만원
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>활성 사용자 (MAU)</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  이번 달에 실제로 서비스를 사용한 사람
                  <br />
                  많을수록 좋아요!
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>전환율</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  무료 → 유료로 바꾼 비율
                  <br />
                  보통 2~5%면 좋은 편이에요
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="font-bold mb-1" style={{ color: 'var(--color-text)' }}>이탈율 (Churn)</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  구독을 취소한 비율
                  <br />
                  5% 이하로 유지하는 게 목표!
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: '#dbeafe' }}>
              <p style={{ color: '#1e40af' }}>
                <strong>📈 이 지표들은 관리자 대시보드에서 볼 수 있어요!</strong>
                <br />
                /admin → 대시보드에서 확인하세요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 운영 체크리스트 */}
        <Card>
          <CardHeader>
            <CardTitle>✅ SaaS 운영 체크리스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              서비스 시작 전 확인하세요:
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">☑️</span>
                <p style={{ color: 'var(--color-text)' }}>가격 정책을 정했나요? (무료/Pro/Enterprise)</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">☑️</span>
                <p style={{ color: 'var(--color-text)' }}>관리자 이메일을 설정했나요?</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">☑️</span>
                <p style={{ color: 'var(--color-text)' }}>결제 시스템을 연동했나요? (PortOne)</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">☑️</span>
                <p style={{ color: 'var(--color-text)' }}>이용약관/개인정보처리방침을 작성했나요?</p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xl">☑️</span>
                <p style={{ color: 'var(--color-text)' }}>고객 문의 채널을 만들었나요? (이메일/채팅)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 다음 단계 */}
        <div className="flex justify-between">
          <Link
            href="/admin/guides"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
          >
            ← 가이드 목록
          </Link>
          <Link
            href="/admin/guides/pricing"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            다음: 가격/구독 설정 →
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
