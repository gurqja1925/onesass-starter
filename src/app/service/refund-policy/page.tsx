'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { RefundPolicyDetails } from '@/onesaas-core/payment/terms'

export default function RefundPolicyPage() {
  return (
    <DashboardLayout title="환불 정책">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🔄 취소 및 환불 정책</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            공정하고 투명한 환불 정책을 제공합니다
          </p>
        </div>

        {/* Policy Content */}
        <div
          className="p-8 rounded-2xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <RefundPolicyDetails />
        </div>

        {/* Contact Info */}
        <div
          className="p-6 rounded-2xl mt-6"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="text-xl font-bold mb-4">📞 환불 문의</h3>
          <div className="space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
            <p>환불과 관련하여 궁금한 사항이 있으시면 언제든지 문의해주세요.</p>
            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
              이메일: support@onesaas.kr
            </p>
            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
              운영시간: 평일 09:00 - 18:00 (주말 및 공휴일 제외)
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
