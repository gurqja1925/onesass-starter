'use client'

/**
 * 템플릿 미리보기 페이지
 */

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  LandingSaaS,
  LandingStartup,
  LandingRealEstate,
  LandingEducation,
  LandingFitness,
  LandingRestaurant,
  LandingHealthcare,
  LandingTravel,
  LandingFinance,
  LandingAgency,
  LandingEcommerce,
  LandingEvent
} from '@/onesaas-core/templates/landing'

const templates: Record<string, React.ComponentType<any>> = {
  'saas': LandingSaaS,
  'startup': LandingStartup,
  'real-estate': LandingRealEstate,
  'education': LandingEducation,
  'fitness': LandingFitness,
  'restaurant': LandingRestaurant,
  'healthcare': LandingHealthcare,
  'travel': LandingTravel,
  'finance': LandingFinance,
  'agency': LandingAgency,
  'ecommerce': LandingEcommerce,
  'event': LandingEvent
}

const templateNames: Record<string, string> = {
  'saas': 'SaaS',
  'startup': 'Startup',
  'real-estate': '부동산',
  'education': '교육/학원',
  'fitness': '피트니스',
  'restaurant': '레스토랑',
  'healthcare': '의료/병원',
  'travel': '여행',
  'finance': '금융/핀테크',
  'agency': '에이전시',
  'ecommerce': '이커머스',
  'event': '이벤트/웨딩'
}

export default function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { id } = resolvedParams
  const Template = templates[id]
  const templateName = templateNames[id]

  if (!Template) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">템플릿을 찾을 수 없습니다</h1>
          <Link href="/templates" className="underline" style={{ color: 'var(--color-accent)' }}>
            템플릿 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Floating Back Button */}
      <Link
        href="/templates"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        {templateName} 템플릿
      </Link>

      {/* Template Render */}
      <Template />
    </div>
  )
}
