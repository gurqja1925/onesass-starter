/**
 * OneSaaS Skills System
 *
 * Anthropic의 skill-creator를 기반으로 한 스킬 시스템
 * Claude의 기능을 확장하는 모듈식 패키지
 */

// ============================================================
// 스킬 타입 정의
// ============================================================

export interface SkillMetadata {
  id: string
  name: string
  nameKo: string
  version: string
  description: string
  category: 'design' | 'development' | 'testing' | 'documentation' | 'deployment'
  author: string
  keywords: string[]
}

export interface Skill {
  metadata: SkillMetadata
  instructions: string
  resources?: {
    scripts?: string[]
    references?: string[]
    assets?: string[]
  }
}

// ============================================================
// OneSaaS 내장 스킬들
// ============================================================

export const builtInSkills: Skill[] = [
  // 1. Frontend Design Skill
  {
    metadata: {
      id: 'frontend-design',
      name: 'Frontend Design',
      nameKo: '프론트엔드 디자인',
      version: '1.0.0',
      description: 'AI slop을 거부하고 독창적이고 기억에 남는 UI를 만드는 디자인 가이드',
      category: 'design',
      author: 'OneSaaS',
      keywords: ['design', 'ui', 'ux', 'frontend', 'aesthetic'],
    },
    instructions: `
# Frontend Design Skill

## 디자인 원칙

### 코딩 전에 확인할 것
1. 인터페이스의 목적과 대상 사용자 이해
2. 대담한 미학적 방향 선택 (brutalist, maximalist, retro, luxury 등)
3. 차별화 기회 식별

### 피해야 할 패턴 (AI Slop)
- Generic purple gradients
- 모든 것을 중앙 정렬
- Inter/Arial/System fonts만 사용
- 천편일률적인 카드 패턴
- 과도한 균일 rounded corners
- 예측 가능한 레이아웃

### 추구해야 할 패턴
- 독특한 타이포그래피 선택
- 날카로운 악센트를 가진 일관된 색상 체계
- 고임팩트 순간의 모션/애니메이션
- 비대칭을 활용한 예상치 못한 레이아웃
- 네거티브 스페이스의 창의적 활용
- 그라디언트, 텍스처, 패턴, 그림자 활용
`,
    resources: {
      references: ['/onesaas-core/design/index.ts'],
    },
  },

  // 2. Theme Factory Skill
  {
    metadata: {
      id: 'theme-factory',
      name: 'Theme Factory',
      nameKo: '테마 팩토리',
      version: '1.0.0',
      description: '10가지 프리셋 테마로 전문적인 스타일링 적용',
      category: 'design',
      author: 'OneSaaS',
      keywords: ['theme', 'color', 'font', 'style', 'branding'],
    },
    instructions: `
# Theme Factory Skill

## 사용 가능한 테마

### 카테고리별 테마
- **Modern**: Modern Minimalist, Arctic Frost
- **Creative**: Ocean Depths, Botanical Garden
- **Professional**: Tech Innovation
- **Vibrant**: Sunset Boulevard, Midnight Galaxy
- **Elegant**: Forest Canopy, Golden Hour, Desert Rose

## 워크플로우
1. 테마 쇼케이스 표시
2. 사용자 선호 테마 요청
3. 명시적 확인 획득
4. 선택한 색상/폰트 적용

## 커스텀 테마
기존 옵션이 맞지 않을 경우 커스텀 테마 생성 지원

## 코드 사용법
\`\`\`typescript
import { applyTheme, themePresets } from '@/onesaas-core/design'

// 테마 적용
applyTheme('ocean-depths', 'dark')

// 사용 가능한 테마 목록
console.log(themePresets.map(t => t.name))
\`\`\`
`,
    resources: {
      references: ['/onesaas-core/design/index.ts', '/onesaas-core/design/ThemeSelector.tsx'],
    },
  },

  // 3. Webapp Testing Skill
  {
    metadata: {
      id: 'webapp-testing',
      name: 'Webapp Testing',
      nameKo: '웹앱 테스팅',
      version: '1.0.0',
      description: 'Playwright를 사용한 로컬 웹 애플리케이션 테스트',
      category: 'testing',
      author: 'OneSaaS',
      keywords: ['test', 'playwright', 'e2e', 'automation', 'qa'],
    },
    instructions: `
# Webapp Testing Skill

## 핵심 원칙
1. "정찰 후 행동" 접근: 탐색 → 로드 완료 대기 → DOM 검사 → 셀렉터 식별 → 액션 실행
2. 동적 애플리케이션에서는 \`page.waitForLoadState('networkidle')\` 대기 후 검사

## 테스트 실행
\`\`\`bash
# 전체 테스트
npx playwright test

# 특정 테스트 파일
npx playwright test tests/admin.spec.ts

# UI 모드
npx playwright test --ui

# 브라우저에서 실행
npx playwright test --headed
\`\`\`

## 테스트 작성 패턴
\`\`\`typescript
import { test, expect } from '@playwright/test'

test('페이지 로드 테스트', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()
})
\`\`\`
`,
    resources: {
      scripts: ['/playwright.config.ts'],
      references: ['/tests/homepage.spec.ts', '/tests/admin.spec.ts', '/tests/auth.spec.ts'],
    },
  },

  // 4. SaaS Builder Skill
  {
    metadata: {
      id: 'saas-builder',
      name: 'SaaS Builder',
      nameKo: 'SaaS 빌더',
      version: '1.0.0',
      description: '한국형 SaaS 서비스를 빠르게 구축하는 가이드',
      category: 'development',
      author: 'OneSaaS',
      keywords: ['saas', 'startup', 'korean', 'payment', 'subscription'],
    },
    instructions: `
# SaaS Builder Skill

## 핵심 구성 요소

### 1. 인증 (Authentication)
- Supabase Auth 기반
- 소셜 로그인: Google, Kakao, GitHub
- 이메일/비밀번호 로그인

### 2. 결제 (Payment)
- PortOne (구 아임포트) 연동
- 카드, 계좌이체, 간편결제 지원
- 구독 플랜: Free, Pro, Enterprise

### 3. 관리자 대시보드
- 사용자 관리
- 결제/구독 관리
- 통계 및 분석
- 설정

### 4. 배포
- Vercel 배포
- GitHub 연동
- 환경변수 관리

## 디렉토리 구조
\`\`\`
src/
├── app/                # Next.js App Router
│   ├── admin/         # 관리자 페이지
│   ├── api/           # API 라우트
│   └── (pages)/       # 사용자 페이지
├── onesaas-core/      # 코어 기능
│   ├── auth/          # 인증
│   ├── admin/         # 관리자
│   ├── payment/       # 결제
│   ├── ui/            # UI 컴포넌트
│   └── design/        # 디자인 시스템
└── lib/               # 유틸리티
\`\`\`
`,
  },

  // 5. Korean Localization Skill
  {
    metadata: {
      id: 'korean-localization',
      name: 'Korean Localization',
      nameKo: '한국어 현지화',
      version: '1.0.0',
      description: '한국 사용자를 위한 현지화 가이드',
      category: 'documentation',
      author: 'OneSaaS',
      keywords: ['korean', 'localization', 'i18n', 'l10n', 'translation'],
    },
    instructions: `
# Korean Localization Skill

## 결제 연동
- **PortOne** (구 아임포트): 한국 결제 통합
- **토스페이먼츠**: 토스 기반 결제
- 간편결제: 카카오페이, 네이버페이, 토스페이

## 인증 제공자
- 카카오 로그인 (필수)
- 네이버 로그인 (권장)
- Google 로그인

## UI/UX 고려사항
- 한글 폰트: Pretendard, Noto Sans KR
- 날짜 형식: YYYY년 MM월 DD일
- 통화 형식: ₩1,000

## 법적 요구사항
- 이용약관 (Terms of Service)
- 개인정보처리방침 (Privacy Policy)
- 전자상거래 표시 사항
`,
  },

  // 6. Claude Agent SDK Skill
  {
    metadata: {
      id: 'claude-agent-sdk',
      name: 'Claude Agent SDK',
      nameKo: 'Claude Agent SDK',
      version: '1.0.0',
      description: '서브에이전트와 멀티에이전트 워크플로우를 구축하는 Anthropic 공식 SDK',
      category: 'development',
      author: 'Anthropic',
      keywords: ['agent', 'sdk', 'subagent', 'multi-agent', 'claude', 'ai', 'automation'],
    },
    instructions: `
# Claude Agent SDK Skill

## 개요
Claude Agent SDK는 Anthropic의 공식 SDK로, 자율적으로 파일 읽기, 명령 실행, 웹 검색, 코드 편집을 수행하는 AI 에이전트를 구축할 수 있습니다.

## 설치

  # TypeScript
  npm install @anthropic-ai/claude-agent-sdk

  # Python
  pip install claude-agent-sdk

## 기본 사용법

  import { query } from "@anthropic-ai/claude-agent-sdk";

  for await (const message of query({
    prompt: "버그를 찾아서 수정해주세요",
    options: { allowedTools: ["Read", "Edit", "Bash"] }
  })) {
    console.log(message);
  }

## 서브에이전트 정의

  const options = {
    allowedTools: ["Read", "Glob", "Grep", "Task"],
    agents: {
      "code-reviewer": {
        description: "코드 품질 및 보안 리뷰 전문가",
        prompt: "코드 품질을 분석하고 개선 사항을 제안하세요",
        tools: ["Read", "Glob", "Grep"]
      }
    }
  };

## 주요 도구
| 도구 | 설명 |
|------|------|
| Read | 파일 읽기 |
| Write | 파일 생성 |
| Edit | 파일 편집 |
| Bash | 터미널 명령 실행 |
| Glob | 파일 패턴 검색 |
| Grep | 내용 검색 |
| Task | 서브에이전트 실행 |
| WebSearch | 웹 검색 |

## 멀티에이전트 패턴
- **파이프라인**: 순차 실행 (분석 → 설계 → 구현 → 테스트)
- **병렬 실행**: 독립적인 작업 동시 처리
- **컨텍스트 격리**: 서브에이전트별 독립 컨텍스트 윈도우

## 참고 링크
- 공식 문서: https://platform.claude.com/docs/en/agent-sdk/overview
- GitHub (Python): https://github.com/anthropics/claude-agent-sdk-python
- GitHub (TypeScript): https://github.com/anthropics/claude-agent-sdk-typescript
`,
    resources: {
      references: ['/onesaas-core/agents/index.ts'],
    },
  },
]

// ============================================================
// 스킬 유틸리티 함수
// ============================================================

export function getSkillById(id: string): Skill | undefined {
  return builtInSkills.find(s => s.metadata.id === id)
}

export function getSkillsByCategory(category: Skill['metadata']['category']): Skill[] {
  return builtInSkills.filter(s => s.metadata.category === category)
}

export function searchSkills(query: string): Skill[] {
  const q = query.toLowerCase()
  return builtInSkills.filter(s =>
    s.metadata.name.toLowerCase().includes(q) ||
    s.metadata.nameKo.includes(q) ||
    s.metadata.description.toLowerCase().includes(q) ||
    s.metadata.keywords.some(k => k.toLowerCase().includes(q))
  )
}

export function getAllSkillMetadata(): SkillMetadata[] {
  return builtInSkills.map(s => s.metadata)
}
