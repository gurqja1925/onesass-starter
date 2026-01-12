'use client'

import { useState } from 'react'

interface PaymentTermsProps {
  onAgree: () => void
  onCancel: () => void
}

export function PaymentTerms({ onAgree, onCancel }: PaymentTermsProps) {
  const [agreed, setAgreed] = useState({
    service: true,
    payment: true,
    privacy: true,
    refund: true
  })
  const [expanded, setExpanded] = useState({
    service: false,
    payment: false,
    privacy: false,
    refund: false
  })

  const allAgreed = agreed.service && agreed.payment && agreed.privacy && agreed.refund

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div
        className="max-w-lg w-full max-h-[80vh] overflow-y-auto p-5 rounded-xl"
        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
      >
        <h2 className="text-lg font-bold mb-3">결제 약관 동의</h2>

        {/* 서비스 이용약관 */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreed.service}
              onChange={(e) => setAgreed({ ...agreed, service: e.target.checked })}
              className="flex-shrink-0"
            />
            <button
              type="button"
              onClick={() => setExpanded({ ...expanded, service: !expanded.service })}
              className="flex-1 text-left text-sm font-medium flex items-center justify-between py-1"
              style={{ color: 'var(--color-text)' }}
            >
              <span>[필수] 서비스 이용약관</span>
              <span className="text-xs">{expanded.service ? '▲' : '▼'}</span>
            </button>
          </div>
          {expanded.service && (
            <div
              className="mt-2 ml-6 p-2 rounded text-xs"
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
            >
              <p className="mb-1">본 약관은 서비스 이용과 관련한 권리, 의무 및 책임사항을 규정합니다.</p>
            </div>
          )}
        </div>

        {/* 결제 약관 */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreed.payment}
              onChange={(e) => setAgreed({ ...agreed, payment: e.target.checked })}
              className="flex-shrink-0"
            />
            <button
              type="button"
              onClick={() => setExpanded({ ...expanded, payment: !expanded.payment })}
              className="flex-1 text-left text-sm font-medium flex items-center justify-between py-1"
              style={{ color: 'var(--color-text)' }}
            >
              <span>[필수] 결제 약관</span>
              <span className="text-xs">{expanded.payment ? '▲' : '▼'}</span>
            </button>
          </div>
          {expanded.payment && (
            <div
              className="mt-2 ml-6 p-2 rounded text-xs"
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
            >
              <p className="mb-1">구독형 서비스는 매월 자동으로 결제되며, 언제든지 구독을 취소할 수 있습니다.</p>
            </div>
          )}
        </div>

        {/* 개인정보 처리방침 */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreed.privacy}
              onChange={(e) => setAgreed({ ...agreed, privacy: e.target.checked })}
              className="flex-shrink-0"
            />
            <button
              type="button"
              onClick={() => setExpanded({ ...expanded, privacy: !expanded.privacy })}
              className="flex-1 text-left text-sm font-medium flex items-center justify-between py-1"
              style={{ color: 'var(--color-text)' }}
            >
              <span>[필수] 개인정보 처리방침</span>
              <span className="text-xs">{expanded.privacy ? '▲' : '▼'}</span>
            </button>
          </div>
          {expanded.privacy && (
            <div
              className="mt-2 ml-6 p-2 rounded text-xs"
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
            >
              <p className="mb-1">결제 처리를 위해 이름, 이메일, 전화번호, 결제정보를 수집하며, 탈퇴 시 즉시 파기됩니다.</p>
            </div>
          )}
        </div>

        {/* 취소 및 환불 정책 */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreed.refund}
              onChange={(e) => setAgreed({ ...agreed, refund: e.target.checked })}
              className="flex-shrink-0"
            />
            <button
              type="button"
              onClick={() => setExpanded({ ...expanded, refund: !expanded.refund })}
              className="flex-1 text-left text-sm font-medium flex items-center justify-between py-1"
              style={{ color: 'var(--color-text)' }}
            >
              <span>[필수] 취소 및 환불 정책</span>
              <span className="text-xs">{expanded.refund ? '▲' : '▼'}</span>
            </button>
          </div>
          {expanded.refund && (
            <div
              className="mt-2 ml-6 p-2 rounded text-xs"
              style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}
            >
              <p className="mb-1">구독은 언제든지 취소 가능하며, 취소 즉시 다음 결제가 중단됩니다. 이미 결제된 요금은 환불되지 않으며, 현재 구독 기간 종료까지 서비스를 이용할 수 있습니다.</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            취소
          </button>
          <button
            onClick={onAgree}
            disabled={!allAgreed}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            동의하고 계속
          </button>
        </div>
      </div>
    </div>
  )
}

// 환불 정책 상세 페이지용 컴포넌트
export function RefundPolicyDetails() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl font-bold mb-3">📋 환불 정책 안내</h3>
        <div className="space-y-4" style={{ color: 'var(--color-text-secondary)' }}>
          <div>
            <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>1. 일반 결제 환불</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>결제일로부터 7일 이내, 서비스 미이용 시: 전액 환불</li>
              <li>서비스 이용 중인 경우: 부분 환불 (일할 계산)</li>
              <li>환불 수수료: 없음</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>2. 정기결제(구독) 취소</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>언제든지 취소 가능</li>
              <li>취소 즉시 다음 결제 중단</li>
              <li>현재 구독 기간 종료까지 서비스 이용 가능</li>
              <li>이미 결제된 금액은 환불 불가</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>3. 환불 신청 방법</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>고객센터: support@onesaas.kr</li>
              <li>필요 정보: 주문번호, 환불 사유</li>
              <li>처리 기간: 영업일 기준 3-5일</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>4. 환불 불가 사유</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>서비스 이용 후 7일 경과</li>
              <li>이용자의 귀책사유로 인한 서비스 제한</li>
              <li>무료 체험 기간 중 가입한 구독</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
