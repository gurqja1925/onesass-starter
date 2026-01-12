'use client'

import { useState } from 'react'
import { AdminLayout } from '@/onesaas-core/admin/components'

interface PaymentSettings {
  refundPeriodDays: number // 환불 가능 기간 (일)
  partialRefundEnabled: boolean // 부분 환불 허용 여부
  subscriptionCancelImmediate: boolean // 즉시 취소 vs 기간 종료 시 취소
  planChangeEnabled: boolean // 플랜 변경 허용 여부
  planChangeProration: boolean // 플랜 변경 시 일할 계산
  autoRefundOnCancel: boolean // 취소 시 자동 환불
  minimumSubscriptionDays: number // 최소 구독 기간 (일)
}

export default function PaymentSettingsPage() {
  const [settings, setSettings] = useState<PaymentSettings>({
    refundPeriodDays: 7,
    partialRefundEnabled: true,
    subscriptionCancelImmediate: false,
    planChangeEnabled: true,
    planChangeProration: true,
    autoRefundOnCancel: false,
    minimumSubscriptionDays: 0,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // TODO: API 호출로 설정 저장
    console.log('Saving payment settings:', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    alert('결제 설정이 저장되었습니다!')
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">💳 결제 설정</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            취소, 환불, 플랜 변경 정책을 설정하세요
          </p>
        </div>

        <div className="space-y-6">
          {/* 환불 정책 */}
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <h2 className="text-xl font-bold mb-4">🔄 환불 정책</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">환불 가능 기간 (일)</label>
                <input
                  type="number"
                  value={settings.refundPeriodDays}
                  onChange={(e) => setSettings({ ...settings, refundPeriodDays: parseInt(e.target.value) })}
                  min="0"
                  max="30"
                  className="w-full px-4 py-3 rounded-lg"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  결제일로부터 {settings.refundPeriodDays}일 이내 서비스 미이용 시 전액 환불
                </p>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.partialRefundEnabled}
                    onChange={(e) => setSettings({ ...settings, partialRefundEnabled: e.target.checked })}
                  />
                  <div>
                    <span className="font-medium">부분 환불 허용</span>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      이용 기간에 따라 부분 환불 계산
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoRefundOnCancel}
                    onChange={(e) => setSettings({ ...settings, autoRefundOnCancel: e.target.checked })}
                  />
                  <div>
                    <span className="font-medium">취소 시 자동 환불</span>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      구독 취소 시 남은 기간에 대해 자동으로 환불 처리
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 구독 취소 정책 */}
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <h2 className="text-xl font-bold mb-4">❌ 구독 취소 정책</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">취소 시점</label>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="cancelType"
                      checked={!settings.subscriptionCancelImmediate}
                      onChange={() => setSettings({ ...settings, subscriptionCancelImmediate: false })}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium">기간 종료 시 취소 (권장)</span>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        현재 구독 기간까지 서비스 이용 가능, 다음 결제 중단
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="cancelType"
                      checked={settings.subscriptionCancelImmediate}
                      onChange={() => setSettings({ ...settings, subscriptionCancelImmediate: true })}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium">즉시 취소</span>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        취소 즉시 서비스 이용 중단, 남은 기간 환불 처리
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">최소 구독 기간 (일)</label>
                <input
                  type="number"
                  value={settings.minimumSubscriptionDays}
                  onChange={(e) => setSettings({ ...settings, minimumSubscriptionDays: parseInt(e.target.value) })}
                  min="0"
                  max="365"
                  className="w-full px-4 py-3 rounded-lg"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {settings.minimumSubscriptionDays === 0
                    ? '최소 구독 기간 없음 (언제든 취소 가능)'
                    : `가입 후 최소 ${settings.minimumSubscriptionDays}일 후 취소 가능`}
                </p>
              </div>
            </div>
          </div>

          {/* 플랜 변경 정책 */}
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <h2 className="text-xl font-bold mb-4">🔀 플랜 변경 정책</h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.planChangeEnabled}
                    onChange={(e) => setSettings({ ...settings, planChangeEnabled: e.target.checked })}
                  />
                  <div>
                    <span className="font-medium">플랜 변경 허용</span>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      사용자가 구독 중 다른 플랜으로 변경 가능
                    </p>
                  </div>
                </label>
              </div>

              {settings.planChangeEnabled && (
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.planChangeProration}
                      onChange={(e) => setSettings({ ...settings, planChangeProration: e.target.checked })}
                    />
                    <div>
                      <span className="font-medium">일할 계산 적용</span>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        플랜 변경 시 남은 기간에 대해 차액 정산
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 py-4 rounded-lg font-medium text-lg transition-all hover:opacity-80"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              {saved ? '✓ 저장 완료!' : '💾 설정 저장'}
            </button>
          </div>

          {/* 안내 */}
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <h3 className="text-lg font-bold mb-3">💡 설정 안내</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <li>✓ 이 설정은 모든 신규 결제 및 구독에 적용됩니다</li>
              <li>✓ 기존 구독자는 가입 시점의 정책이 적용됩니다</li>
              <li>✓ 정책 변경 시 사용자에게 이메일로 안내됩니다</li>
              <li>✓ 전자상거래법에 따른 의무사항을 준수해야 합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
