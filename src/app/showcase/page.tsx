'use client'

/**
 * OneSaaS 컴포넌트 쇼케이스
 * 모든 UI 컴포넌트와 템플릿을 확인할 수 있는 페이지
 */

import { useState } from 'react'
import {
  ChevronRight, Home, Layout, Component, FileCode, BarChart3,
  Grid, Settings, PenTool, Globe, X, Eye, Bot, Sparkles, Check
} from 'lucide-react'
import { useTemplateSelection, TEMPLATE_INFO, type TemplateSelections } from '@/onesaas-core/templates/TemplateProvider'

// UI Components
import { Button, Input, Badge, Card, Modal, Loading } from '@/onesaas-core/ui'

// Marketing Components
import { Hero, Features, Pricing, Testimonials, FAQ, CTA } from '@/onesaas-core/ui/marketing'

// Korean Components
import { KRWPrice, KoreanDate } from '@/onesaas-core/ui/korean'

// Admin Templates
import {
  DashboardAnalytics,
  DashboardEcommerce,
  DashboardSaaS,
  UsersList,
  OrdersList,
  ProductsList,
  SettingsProfile,
  SettingsBilling,
  SettingsTeam,
} from '@/onesaas-core/templates/admin'

// Blog Templates
import { BlogGrid, BlogPost } from '@/onesaas-core/templates/blog'

// Landing Templates
import { LandingSaaS, LandingStartup } from '@/onesaas-core/templates/landing'

// AI Templates
import {
  ChatbotTemplate,
  ImageGenTemplate,
  TextGenTemplate,
  CodeAssistantTemplate,
  VoiceTemplate,
  SummarizerTemplate,
  TranslatorTemplate,
  RecommendationTemplate,
} from '@/onesaas-core/templates/ai'

type Section = 'overview' | 'primitives' | 'marketing' | 'korean' | 'templates'
type TemplatePreview = string | null

// 템플릿 컴포넌트 매핑
const templateComponents: Record<string, React.ComponentType> = {
  DashboardAnalytics,
  DashboardEcommerce,
  DashboardSaaS,
  UsersList,
  OrdersList,
  ProductsList,
  SettingsProfile,
  SettingsBilling,
  SettingsTeam,
  BlogGrid,
  BlogPost,
  LandingSaaS,
  LandingStartup,
  // AI Templates
  ChatbotTemplate,
  ImageGenTemplate,
  TextGenTemplate,
  CodeAssistantTemplate,
  VoiceTemplate,
  SummarizerTemplate,
  TranslatorTemplate,
  RecommendationTemplate,
}

export default function ShowcasePage() {
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const [previewTemplate, setPreviewTemplate] = useState<TemplatePreview>(null)
  const { selections, setTemplate, getTemplate } = useTemplateSelection()

  // 템플릿 적용
  const handleApplyTemplate = (templateId: string) => {
    const info = TEMPLATE_INFO[templateId]
    if (info) {
      setTemplate(info.category, templateId)
      // 알림 표시 (간단한 toast)
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg animate-pulse'
      toast.style.background = 'var(--color-accent)'
      toast.style.color = 'var(--color-bg)'
      toast.textContent = `✓ ${info.name} 템플릿이 ${info.category === 'landing' ? '랜딩 페이지' : info.category === 'admin' ? '어드민' : info.category === 'blog' ? '블로그' : 'AI 페이지'}에 적용되었습니다!`
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 3000)
    }
    setPreviewTemplate(null)
  }

  // 현재 적용된 템플릿인지 확인
  const isApplied = (templateId: string): boolean => {
    const info = TEMPLATE_INFO[templateId]
    if (!info) return false
    return getTemplate(info.category) === templateId
  }

  const sections = [
    { id: 'overview', label: '개요', icon: Home },
    { id: 'primitives', label: 'UI 컴포넌트', icon: Component },
    { id: 'marketing', label: '마케팅', icon: PenTool },
    { id: 'korean', label: '한국 특화', icon: Globe },
    { id: 'templates', label: '템플릿', icon: Layout },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* 섹션 탭 네비게이션 */}
      <div
        className="sticky top-16 z-40 border-b"
        style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as Section)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                style={{
                  background: activeSection === section.id ? 'var(--color-accent)' : 'transparent',
                  color: activeSection === section.id ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 개요 */}
        {activeSection === 'overview' && (
          <div>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                OneSaaS <span style={{ color: 'var(--color-accent)' }}>컴포넌트 라이브러리</span>
              </h1>
              <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
                한국 비즈니스에 최적화된 프리미엄 SaaS 컴포넌트
              </p>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { label: 'UI 컴포넌트', value: '49+' },
                { label: '템플릿', value: '13+' },
                { label: '테마', value: '10' },
                { label: 'AI 템플릿', value: '8' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl text-center"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                >
                  <p className="text-3xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>
                    {stat.value}
                  </p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* 카테고리 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Primitives', desc: 'Button, Input, Badge 등 기본 UI', count: 27, icon: Component },
                { title: 'Forms', desc: 'FileUpload, DatePicker 등', count: 4, icon: FileCode },
                { title: 'Charts', desc: 'Line, Bar, Pie, Area 차트', count: 4, icon: BarChart3 },
                { title: 'Marketing', desc: 'Hero, Pricing, FAQ 등', count: 6, icon: PenTool },
                { title: 'Korean', desc: '전화번호, 사업자번호 등', count: 8, icon: Globe },
                { title: 'Admin', desc: 'Dashboard, Users, Orders', count: 9, icon: Settings },
                { title: 'Blog', desc: 'Grid, Post 레이아웃', count: 2, icon: Grid },
                { title: 'Landing', desc: 'SaaS, Startup 랜딩', count: 2, icon: Layout },
              ].map((cat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl cursor-pointer transition-transform hover:-translate-y-1"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                >
                  <cat.icon className="w-8 h-8 mb-4" style={{ color: 'var(--color-accent)' }} />
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{cat.title}</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>{cat.desc}</p>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
                    {cat.count}개
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UI 컴포넌트 */}
        {activeSection === 'primitives' && (
          <div>
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
              UI 컴포넌트
            </h2>

            {/* Button */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Button</h3>
              <div
                className="p-6 rounded-xl"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </section>

            {/* Input */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Input</h3>
              <div
                className="p-6 rounded-xl"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="max-w-md space-y-4">
                  <Input label="이메일" placeholder="email@example.com" />
                  <Input label="비밀번호" type="password" placeholder="••••••••" />
                  <Input label="에러 상태" error="올바른 값을 입력하세요" />
                </div>
              </div>
            </section>

            {/* Badge */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Badge</h3>
              <div
                className="p-6 rounded-xl"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex flex-wrap gap-4">
                  <Badge>Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Error</Badge>
                </div>
              </div>
            </section>

            {/* Card */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Card</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>기본 카드</h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>카드 컴포넌트 예시입니다.</p>
                </Card>
                <Card>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>상호작용</h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>호버 효과가 있습니다.</p>
                </Card>
                <Card>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>다양한 컨텐츠</h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>이미지, 버튼 등을 포함할 수 있습니다.</p>
                </Card>
              </div>
            </section>
          </div>
        )}

        {/* 마케팅 */}
        {activeSection === 'marketing' && (
          <div>
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
              마케팅 컴포넌트
            </h2>

            {/* Hero */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Hero</h3>
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
                <Hero
                  badge="🎉 신규 출시"
                  title="비즈니스 성장을 위한 최고의 솔루션"
                  subtitle="간편한 설정으로 빠르게 시작하세요"
                  primaryAction={{ label: '무료 시작', href: '#' }}
                  secondaryAction={{ label: '더 알아보기', href: '#' }}
                />
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>FAQ</h3>
              <FAQ
                items={[
                  { question: '무료 체험이 가능한가요?', answer: '네, 14일 동안 모든 기능을 무료로 사용할 수 있습니다.' },
                  { question: '결제 방법은 무엇인가요?', answer: '신용카드, 계좌이체, 네이버페이 등 다양한 결제 방법을 지원합니다.' },
                  { question: '환불 정책은 어떻게 되나요?', answer: '구매 후 30일 이내 전액 환불이 가능합니다.' },
                ]}
              />
            </section>

            {/* CTA */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>CTA</h3>
              <CTA
                title="지금 바로 시작하세요"
                description="14일 무료 체험으로 모든 기능을 경험해보세요"
                primaryAction={{ label: '무료 시작', href: '#' }}
                secondaryAction={{ label: '데모 예약', href: '#' }}
              />
            </section>
          </div>
        )}

        {/* 한국 특화 */}
        {activeSection === 'korean' && (
          <div>
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
              한국 특화 컴포넌트
            </h2>

            {/* KRWPrice */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>KRWPrice (원화 가격)</h3>
              <div
                className="p-6 rounded-xl"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>기본:</p>
                    <KRWPrice value={1000000} />
                  </div>
                  <div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>할인 표시:</p>
                    <KRWPrice value={1000000} discount={20} />
                  </div>
                  <div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>부가세 포함:</p>
                    <KRWPrice value={1000000} showVAT />
                  </div>
                  <div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>큰 사이즈:</p>
                    <KRWPrice value={1000000} size="xl" />
                  </div>
                </div>
              </div>
            </section>

            {/* KoreanDate */}
            <section className="mb-12">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>KoreanDate (한국 날짜)</h3>
              <div
                className="p-6 rounded-xl"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>전체 형식:</p>
                    <KoreanDate date={new Date()} format="full" />
                  </div>
                  <div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>짧은 형식:</p>
                    <KoreanDate date={new Date()} format="short" />
                  </div>
                  <div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>상대적 시간:</p>
                    <KoreanDate date={new Date(Date.now() - 3600000)} format="relative" />
                  </div>
                  <div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>요일 포함:</p>
                    <KoreanDate date={new Date()} format="full" showDayOfWeek />
                  </div>
                </div>
              </div>
            </section>

            {/* 컴포넌트 목록 */}
            <section>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>전체 한국 특화 컴포넌트</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: 'PhoneInput', desc: '한국 전화번호 (010-XXXX-XXXX)' },
                  { name: 'BusinessNumber', desc: '사업자등록번호 (000-00-00000)' },
                  { name: 'AddressSearch', desc: '주소 검색 (다음 주소 API)' },
                  { name: 'BankAccount', desc: '은행 계좌번호 입력' },
                  { name: 'KRWPrice', desc: '원화 가격 표시' },
                  { name: 'KoreanDate', desc: '한국 날짜 형식' },
                  { name: 'TermsAgreement', desc: '약관 동의 (한국 법적 요구)' },
                  { name: 'PrivacyConsent', desc: '개인정보 수집/이용 동의' },
                ].map((comp, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                  >
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{comp.name}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{comp.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 템플릿 */}
        {activeSection === 'templates' && (
          <div>
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
              페이지 템플릿
            </h2>
            <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              클릭하여 미리보기를 확인하세요
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Admin */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <Settings className="w-5 h-5" /> 어드민 템플릿
                  {selections.admin && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
                      적용됨
                    </span>
                  )}
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'DashboardAnalytics', name: '분석 대시보드' },
                    { id: 'DashboardEcommerce', name: '이커머스 대시보드' },
                    { id: 'DashboardSaaS', name: 'SaaS 대시보드' },
                    { id: 'UsersList', name: '사용자 목록' },
                    { id: 'OrdersList', name: '주문 목록' },
                    { id: 'ProductsList', name: '상품 목록' },
                    { id: 'SettingsProfile', name: '프로필 설정' },
                    { id: 'SettingsBilling', name: '결제 설정' },
                    { id: 'SettingsTeam', name: '팀 설정' },
                  ].map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewTemplate(t.id)}
                      className="w-full p-3 rounded-lg text-left flex items-center justify-between hover:scale-[1.02] transition-transform"
                      style={{
                        background: isApplied(t.id) ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        color: isApplied(t.id) ? 'var(--color-bg)' : 'var(--color-text)',
                      }}
                    >
                      <span className="text-sm flex items-center gap-2">
                        {isApplied(t.id) && <Check className="w-4 h-4" />}
                        {t.name}
                      </span>
                      <Eye className="w-4 h-4" style={{ color: isApplied(t.id) ? 'var(--color-bg)' : 'var(--color-accent)' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Blog */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <Grid className="w-5 h-5" /> 블로그 템플릿
                  {selections.blog && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
                      적용됨
                    </span>
                  )}
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'BlogGrid', name: '블로그 그리드' },
                    { id: 'BlogPost', name: '블로그 포스트' },
                  ].map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewTemplate(t.id)}
                      className="w-full p-3 rounded-lg text-left flex items-center justify-between hover:scale-[1.02] transition-transform"
                      style={{
                        background: isApplied(t.id) ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        color: isApplied(t.id) ? 'var(--color-bg)' : 'var(--color-text)',
                      }}
                    >
                      <span className="text-sm flex items-center gap-2">
                        {isApplied(t.id) && <Check className="w-4 h-4" />}
                        {t.name}
                      </span>
                      <Eye className="w-4 h-4" style={{ color: isApplied(t.id) ? 'var(--color-bg)' : 'var(--color-accent)' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Landing */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <Layout className="w-5 h-5" /> 랜딩 템플릿
                  {selections.landing && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
                      적용됨
                    </span>
                  )}
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'LandingSaaS', name: 'SaaS 랜딩' },
                    { id: 'LandingStartup', name: '스타트업 랜딩' },
                  ].map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewTemplate(t.id)}
                      className="w-full p-3 rounded-lg text-left flex items-center justify-between hover:scale-[1.02] transition-transform"
                      style={{
                        background: isApplied(t.id) ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        color: isApplied(t.id) ? 'var(--color-bg)' : 'var(--color-text)',
                      }}
                    >
                      <span className="text-sm flex items-center gap-2">
                        {isApplied(t.id) && <Check className="w-4 h-4" />}
                        {t.name}
                      </span>
                      <Eye className="w-4 h-4" style={{ color: isApplied(t.id) ? 'var(--color-bg)' : 'var(--color-accent)' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Templates Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--color-text)' }}>
                <Sparkles className="w-7 h-7" style={{ color: 'var(--color-accent)' }} />
                AI 템플릿
                <span className="text-sm font-normal px-2 py-1 rounded-full" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
                  8개
                </span>
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'ChatbotTemplate', name: 'AI 챗봇', desc: '대화형 AI 어시스턴트', icon: '🤖' },
                  { id: 'ImageGenTemplate', name: '이미지 생성', desc: 'AI 이미지 생성기', icon: '🎨' },
                  { id: 'TextGenTemplate', name: '텍스트 생성', desc: '블로그, 마케팅 카피', icon: '✍️' },
                  { id: 'CodeAssistantTemplate', name: '코드 어시스턴트', desc: '코드 생성 및 분석', icon: '💻' },
                  { id: 'VoiceTemplate', name: '음성 서비스', desc: 'TTS/STT 변환', icon: '🎙️' },
                  { id: 'SummarizerTemplate', name: '문서 요약', desc: '긴 문서 핵심 요약', icon: '📋' },
                  { id: 'TranslatorTemplate', name: 'AI 번역', desc: '다국어 번역 서비스', icon: '🌐' },
                  { id: 'RecommendationTemplate', name: '추천 시스템', desc: '맞춤형 추천 엔진', icon: '⭐' },
                ].map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewTemplate(t.id)}
                    className="p-4 rounded-xl text-left hover:scale-[1.02] transition-transform group"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{t.icon}</span>
                      <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{t.name}</h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 템플릿 미리보기 모달 - 전체 화면 */}
        {previewTemplate && (
          <div className="fixed inset-0 z-50" style={{ background: 'var(--color-bg)' }}>
            {/* 상단 툴바 */}
            <div
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
              style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}
            >
              {/* 템플릿 이름 */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {TEMPLATE_INFO[previewTemplate]?.name || previewTemplate} 미리보기
                </span>
                {isApplied(previewTemplate) && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
                    현재 적용됨
                  </span>
                )}
              </div>

              {/* 버튼들 */}
              <div className="flex items-center gap-2">
                {!isApplied(previewTemplate) && (
                  <button
                    onClick={() => handleApplyTemplate(previewTemplate)}
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    <Check className="w-4 h-4" />
                    이 템플릿 적용하기
                  </button>
                )}
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 컨텐츠 - 전체 화면 (상단 바 아래) */}
            <div className="w-full h-full pt-14 overflow-auto">
              {(() => {
                const TemplateComponent = templateComponents[previewTemplate]
                return TemplateComponent ? <TemplateComponent /> : <p>템플릿을 찾을 수 없습니다</p>
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
