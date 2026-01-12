/**
 * OneSaaS Plugin Configuration
 * 플러그인 설정 - 테마, 템플릿, 컴포넌트 활성화 관리
 *
 * 이 파일에서 활성화할 테마, 템플릿, 컴포넌트를 설정합니다.
 * 필요한 것만 활성화하여 번들 크기를 최적화할 수 있습니다.
 */

import type { PluginsConfig } from '@/onesaas-core/plugins'

/**
 * 플러그인 설정
 */
export const plugins: PluginsConfig = {
  // ===================================
  // 테마 설정
  // ===================================
  theme: {
    // 활성 테마: minimal, neon, luxury, playful, brutalist,
    //           corporate, startup, fintech, healthcare, ecommerce
    active: 'brutalist',

    // 모드: light, dark, system (시스템 설정 따름)
    mode: 'dark',

    // 텍스트 방향: ltr (왼쪽→오른쪽), rtl (오른쪽→왼쪽)
    direction: 'ltr',
  },

  // ===================================
  // 레이아웃 설정
  // ===================================
  layout: {
    // 콘텐츠 너비: fluid (전체), boxed (제한)
    width: 'fluid',

    // 사이드바 설정
    sidebar: {
      // 변형: full (전체), compact (축소), icon-only (아이콘만), hidden (숨김)
      variant: 'full',
      // 테마: light, dark, themed (테마 색상 따름)
      theme: 'dark',
      // 위치: fixed (고정), scrollable (스크롤)
      position: 'fixed',
    },

    // 상단바 설정
    topbar: {
      // 테마: light, dark, themed
      theme: 'dark',
      // 위치: fixed, scrollable
      position: 'fixed',
    },
  },

  // ===================================
  // 활성화할 템플릿
  // ===================================
  templates: {
    // 어드민 템플릿 (30개 중 선택)
    admin: [
      'dashboard-analytics',
      'dashboard-ecommerce',
      'dashboard-saas',
      'users-list',
      'users-detail',
      'orders',
      'products',
      'analytics',
      'settings-profile',
      'settings-billing',
      'settings-team',
      'settings-notifications',
      'invoices',
      'calendar',
      'messages',
      'notifications',
      'file-manager',
      'kanban',
      'todo',
      'email',
    ],

    // 블로그 템플릿 (30개 중 선택)
    blog: [
      'home-grid',
      'home-list',
      'home-masonry',
      'home-magazine',
      'post-default',
      'post-sidebar',
      'post-fullwidth',
      'author',
      'category',
      'tag',
      'archive',
      'search',
    ],

    // 랜딩 페이지 템플릿 (30개 중 선택)
    landing: [
      'startup',
      'agency',
      'saas',
      'app',
      'product',
      'service',
      'portfolio',
      'event',
      'restaurant',
      'real-estate',
      'education',
      'fitness',
      'travel',
      'finance',
      'healthcare',
    ],
  },

  // ===================================
  // 컴포넌트 번들 활성화
  // ===================================
  components: {
    // Chart.js 차트 컴포넌트
    charts: true,

    // 고급 폼 컴포넌트 (FormWizard, FileUpload, RichTextEditor 등)
    forms: true,

    // 마케팅 섹션 (Hero, Pricing, Testimonials 등)
    marketing: true,

    // 한국 특화 컴포넌트 (주소검색, 사업자번호 등)
    korean: true,

    // 데이터 표시 컴포넌트 (Table, DataTable, Timeline 등)
    dataDisplay: true,

    // 네비게이션 컴포넌트 (Tabs, Accordion, Menu 등)
    navigation: true,
  },

  // ===================================
  // 한국 비즈니스 설정
  // ===================================
  korean: {
    // 결제 시스템: portone, tosspayments
    payment: 'portone',

    // 다음 주소 API 사용
    addressApi: true,

    // 사업자등록번호 검증
    businessNumber: true,

    // 부가세 자동 계산 (10%)
    vatCalculation: true,
  },
}

/**
 * 테마가 활성화되어 있는지 확인
 */
export function isThemeActive(themeId: string): boolean {
  return plugins.theme.active === themeId
}

/**
 * 템플릿이 활성화되어 있는지 확인
 */
export function isTemplateActive(
  category: 'admin' | 'blog' | 'landing',
  templateId: string
): boolean {
  return plugins.templates[category].includes(templateId)
}

/**
 * 컴포넌트 번들이 활성화되어 있는지 확인
 */
export function isComponentBundleActive(
  bundle: keyof typeof plugins.components
): boolean {
  return plugins.components[bundle]
}

/**
 * 한국 비즈니스 기능이 활성화되어 있는지 확인
 */
export function isKoreanFeatureActive(
  feature: keyof typeof plugins.korean
): boolean {
  const value = plugins.korean[feature]
  return typeof value === 'boolean' ? value : !!value
}

/**
 * 현재 결제 시스템 가져오기
 */
export function getPaymentProvider(): 'portone' | 'tosspayments' {
  return plugins.korean.payment
}
