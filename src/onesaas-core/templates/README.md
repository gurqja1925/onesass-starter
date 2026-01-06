# OneSaaS 템플릿 시스템

## SaaS 구조 패턴

OneSaaS는 세 가지 구조 패턴을 지원합니다:

### 1. 랜딩 페이지만 (OnePage)
간단한 비즈니스용 원페이지 사이트

```
📁 app/
├── page.tsx         # 원페이지 (히어로, 서비스, 연락처)
├── layout.tsx       # 심플 레이아웃
```

**적합한 비즈니스:**
- 변호사, 의사, 회계사 (전문직)
- 카페, 레스토랑, 미용실 (서비스업)
- 포트폴리오, 프리랜서 (개인)

**템플릿:** `src/onesaas-core/templates/onepage/`
- 100+ 비즈니스 유형별 템플릿
- Hero, Section, Gallery 컴포넌트
- 이미지/비디오 배경 지원

---

### 2. 랜딩 + 어드민 + SaaS (풀 SaaS)
완전한 SaaS 애플리케이션 구조

```
📁 app/
├── (marketing)/           # 마케팅 그룹 (공개)
│   ├── page.tsx           # 랜딩 페이지
│   ├── pricing/           # 가격표
│   ├── features/          # 기능 소개
│   └── blog/              # 블로그
│
├── (app)/                 # SaaS 앱 그룹 (로그인 필수)
│   ├── layout.tsx         # 👈 왼쪽 사이드바 레이아웃
│   ├── dashboard/         # 대시보드
│   ├── projects/          # 프로젝트 목록
│   ├── analytics/         # 분석
│   └── settings/          # 설정
│
├── (admin)/               # 관리자 그룹 (관리자만)
│   ├── layout.tsx         # 👈 어드민 사이드바 레이아웃
│   ├── users/             # 사용자 관리
│   ├── orders/            # 주문 관리
│   └── products/          # 상품 관리
```

**특징:**
- 왼쪽 사이드바 네비게이션 (기능이 많음)
- 사용자 인증 필수
- 역할 기반 접근 제어

**템플릿:**
- `src/onesaas-core/templates/admin/` - 어드민 템플릿
- `src/onesaas-core/templates/landing/` - 마케팅 템플릿
- `src/onesaas-core/templates/ai/` - AI 기능 템플릿

---

### 3. 어드민만 (Internal Tool)
내부 관리 도구

```
📁 app/
├── layout.tsx             # 👈 왼쪽 사이드바 레이아웃
├── dashboard/             # 대시보드
├── users/                 # 사용자 관리
├── analytics/             # 분석
└── settings/              # 설정
```

**적합한 용도:**
- 사내 관리 시스템
- CRM, ERP
- 데이터 대시보드

---

## 레이아웃 시스템

### 사이드바 레이아웃 (SaaS/Admin용)

```tsx
// (app)/layout.tsx
export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* 왼쪽 사이드바 */}
      <aside className="w-64 bg-gray-900 text-white">
        <Logo />
        <Navigation items={[
          { icon: 'Home', label: '대시보드', href: '/dashboard' },
          { icon: 'Users', label: '사용자', href: '/users' },
          { icon: 'Settings', label: '설정', href: '/settings' },
        ]} />
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <TopBar /> {/* 사용자 정보, 알림 */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
```

### 랜딩 레이아웃 (마케팅용)

```tsx
// (marketing)/layout.tsx
export default function MarketingLayout({ children }) {
  return (
    <>
      <TopNavigation /> {/* 상단 네비게이션 */}
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

---

## 템플릿 폴더 구조

```
src/onesaas-core/templates/
├── onepage/               # 원페이지 템플릿 (100+)
│   ├── OnepageBase.tsx    # 베이스 컴포넌트
│   ├── templates.ts       # 비즈니스별 데이터
│   └── index.ts           # 유틸리티 함수
│
├── admin/                 # 어드민 템플릿 (30+)
│   ├── layouts/           # 사이드바 레이아웃
│   ├── dashboard/         # 대시보드 페이지
│   ├── users/             # 사용자 관리
│   ├── orders/            # 주문 관리
│   └── settings/          # 설정 페이지
│
├── landing/               # 마케팅 랜딩 (30+)
│   ├── hero/              # 히어로 섹션
│   ├── features/          # 기능 소개
│   ├── pricing/           # 가격표
│   └── testimonials/      # 후기
│
├── blog/                  # 블로그 템플릿 (30+)
│   ├── list/              # 글 목록
│   └── post/              # 글 상세
│
└── ai/                    # AI 기능 템플릿 (10+)
    ├── chatbot/           # 챗봇
    ├── image-gen/         # 이미지 생성
    └── text-gen/          # 텍스트 생성
```

---

## 사용 예시

### 원페이지 사이트 만들기

```tsx
import { Hero, Section, ServicesGrid, Contact } from '@/onesaas-core/templates/onepage'
import { getTemplateById } from '@/onesaas-core/templates/onepage'

// 변호사 템플릿 사용
const template = getTemplateById('lawyer')

export default function LandingPage() {
  return (
    <>
      <Hero {...template.defaultHero} />
      <Section id="services" title="서비스 안내">
        <ServicesGrid services={template.defaultServices} />
      </Section>
      <Section id="contact" title="문의하기">
        <Contact business={template.defaultBusiness} />
      </Section>
    </>
  )
}
```

### SaaS 대시보드 만들기

```tsx
import { SidebarLayout } from '@/onesaas-core/templates/admin/layouts'
import { DashboardCards } from '@/onesaas-core/templates/admin/dashboard'

export default function DashboardPage() {
  return (
    <SidebarLayout>
      <DashboardCards />
    </SidebarLayout>
  )
}
```
