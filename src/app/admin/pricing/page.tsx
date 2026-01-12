'use client'

import { useState } from 'react'
import { AdminLayout } from '@/onesaas-core/admin/components'

interface PricingPlan {
  id: string
  name: string
  price: number
  yearlyPrice: number
  features: string[]
  popular: boolean
}

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([
    {
      id: 'starter',
      name: 'Starter',
      price: 10000,
      yearlyPrice: 96000,
      features: ['기본 기능', '월 1,000회 API 호출', '이메일 지원', '1GB 저장공간'],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 30000,
      yearlyPrice: 288000,
      features: ['모든 기본 기능', '월 10,000회 API 호출', '우선 지원', '10GB 저장공간', '고급 분석'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 100000,
      yearlyPrice: 960000,
      features: ['모든 Pro 기능', '무제한 API 호출', '24/7 전화 지원', '무제한 저장공간', '맞춤 개발'],
      popular: false
    }
  ])

  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleAddNewPlan = () => {
    const newPlan: PricingPlan = {
      id: `plan_${Date.now()}`,
      name: '새 플랜',
      price: 0,
      yearlyPrice: 0,
      features: [],
      popular: false
    }
    setPlans([...plans, newPlan])
    setEditingPlan(newPlan)
    setIsAddingNew(true)
  }

  const handleDeletePlan = (planId: string) => {
    if (plans.length <= 1) {
      alert('최소 1개의 플랜은 유지해야 합니다.')
      return
    }

    if (confirm('이 플랜을 삭제하시겠습니까? 삭제된 플랜은 복구할 수 없습니다.')) {
      setPlans(plans.filter(p => p.id !== planId))
      if (editingPlan?.id === planId) {
        setEditingPlan(null)
      }
      alert('플랜이 삭제되었습니다.')
    }
  }

  const handleSavePlan = () => {
    if (!editingPlan) return

    // 유효성 검사
    if (!editingPlan.name.trim()) {
      alert('플랜 이름을 입력해주세요.')
      return
    }
    if (editingPlan.price <= 0) {
      alert('월간 가격을 입력해주세요.')
      return
    }
    if (editingPlan.yearlyPrice <= 0) {
      alert('연간 가격을 입력해주세요.')
      return
    }
    if (editingPlan.features.length === 0) {
      alert('최소 1개의 기능을 추가해주세요.')
      return
    }

    if (isAddingNew) {
      // 새 플랜 추가 완료
      setIsAddingNew(false)
    } else {
      // 기존 플랜 수정
      setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p))
    }

    setEditingPlan(null)
    alert('플랜이 저장되었습니다!')
  }

  const handleCancelEdit = () => {
    if (isAddingNew && editingPlan) {
      // 새 플랜 추가 중 취소하면 삭제
      setPlans(plans.filter(p => p.id !== editingPlan.id))
      setIsAddingNew(false)
    }
    setEditingPlan(null)
  }

  const handleAddFeature = (planId: string) => {
    const feature = prompt('추가할 기능을 입력하세요:')
    if (!feature) return

    if (editingPlan && editingPlan.id === planId) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, feature]
      })
    }
  }

  const handleRemoveFeature = (planId: string, index: number) => {
    if (editingPlan && editingPlan.id === planId) {
      setEditingPlan({
        ...editingPlan,
        features: editingPlan.features.filter((_, i) => i !== index)
      })
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              💰 프라이싱 설정
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              서비스의 가격 플랜을 설정하고 관리합니다
            </p>
          </div>
          <button
            onClick={handleAddNewPlan}
            disabled={!!editingPlan}
            className="px-6 py-3 rounded-lg font-medium transition-all hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            ➕ 새 플랜 추가
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isEditing = editingPlan?.id === plan.id
            const displayPlan = isEditing ? editingPlan : plan

            return (
              <div
                key={plan.id}
                className="p-6 rounded-2xl relative"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: plan.popular ? '2px solid var(--color-accent)' : '1px solid var(--color-border)'
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    인기
                  </div>
                )}

                {/* Plan Name */}
                {isEditing ? (
                  <input
                    type="text"
                    value={displayPlan.name}
                    onChange={(e) => setEditingPlan({ ...displayPlan, name: e.target.value })}
                    className="text-2xl font-bold mb-4 w-full px-2 py-1 rounded"
                    style={{
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  />
                ) : (
                  <h3 className="text-2xl font-bold mb-4">{displayPlan.name}</h3>
                )}

                {/* Monthly Price */}
                <div className="mb-2">
                  <label className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    월간 가격 (원)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={displayPlan.price}
                      onChange={(e) => setEditingPlan({ ...displayPlan, price: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded mt-1"
                      style={{
                        background: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                    />
                  ) : (
                    <p className="text-3xl font-bold">₩{displayPlan.price.toLocaleString()}</p>
                  )}
                </div>

                {/* Yearly Price */}
                <div className="mb-6">
                  <label className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    연간 가격 (원)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={displayPlan.yearlyPrice}
                      onChange={(e) => setEditingPlan({ ...displayPlan, yearlyPrice: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded mt-1"
                      style={{
                        background: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                    />
                  ) : (
                    <p className="text-xl font-bold">₩{displayPlan.yearlyPrice.toLocaleString()}</p>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">기능 목록</label>
                    {isEditing && (
                      <button
                        onClick={() => handleAddFeature(plan.id)}
                        className="text-sm px-3 py-1 rounded"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                      >
                        + 추가
                      </button>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {displayPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span style={{ color: 'var(--color-accent)' }}>✓</span>
                        <span className="flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                          {feature}
                        </span>
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveFeature(plan.id, index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Popular Toggle */}
                {isEditing && (
                  <div className="mb-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={displayPlan.popular}
                        onChange={(e) => setEditingPlan({ ...displayPlan, popular: e.target.checked })}
                        className="w-4 h-4"
                        style={{ accentColor: 'var(--color-accent)' }}
                      />
                      <span className="text-sm">인기 플랜으로 표시</span>
                    </label>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSavePlan}
                        className="flex-1 py-2 rounded-lg font-medium transition-all hover:opacity-80"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                      >
                        {isAddingNew ? '추가' : '저장'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 py-2 rounded-lg font-medium transition-all hover:opacity-80"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="w-full py-2 rounded-lg font-medium transition-all hover:opacity-80"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                      >
                        ✏️ 수정
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="w-full py-2 rounded-lg font-medium transition-all hover:opacity-80"
                        style={{ background: '#ef4444', color: '#fff' }}
                      >
                        🗑️ 삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info */}
        <div
          className="mt-8 p-6 rounded-2xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="text-xl font-bold mb-4">💡 안내사항</h3>
          <ul className="space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
            <li>✓ <strong>플랜 추가</strong>: "새 플랜 추가" 버튼으로 새로운 가격 플랜을 생성할 수 있습니다</li>
            <li>✓ <strong>플랜 삭제</strong>: 각 플랜의 "삭제" 버튼으로 삭제할 수 있습니다 (최소 1개 유지 필요)</li>
            <li>✓ <strong>가격 변경</strong>: 신규 구독자부터 적용되며, 기존 구독자는 갱신 시점에 새 가격이 적용됩니다</li>
            <li>✓ <strong>연간 가격</strong>: 월간 가격의 10개월 분량으로 설정하는 것을 권장합니다 (20% 할인)</li>
            <li>✓ <strong>인기 플랜</strong>: 체크박스를 선택하면 사용자에게 강조 표시됩니다</li>
            <li>✓ <strong>기능 추가</strong>: 편집 모드에서 "+" 버튼으로 기능을 추가하고, "×" 버튼으로 삭제할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
