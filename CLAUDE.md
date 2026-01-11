# OneSaaS Starter - AI 개발 가이드

> AI와 함께 한국어로 개발하세요!

---

## AI 개발 도구 선택

OneSaaS는 두 가지 AI 코딩 도구를 지원합니다. 원하는 방식을 선택하세요!

### 옵션 1: K-Code (내장) - 권장

**K-Code**는 OneSaaS에 내장된 한국어 특화 AI 코딩 어시스턴트입니다.

```bash
# 설치 필요 없음! 바로 사용
pnpm kcode "로그인 페이지에 네이버 로그인 추가해줘"
pnpm kcode "관리자에 상품 관리 페이지 만들어줘"
pnpm kcode "결제 완료 후 이메일 발송 기능 추가해줘"

# Smart 모드 (복잡한 작업)
pnpm kcode "복잡한 API 설계하고 구현해줘" --smart

# 원스탑 가이드
pnpm kcode --guide
```

**장점:**
- 설치 불필요 (내장)
- OneSaaS 구조 완벽 이해
- DeepSeek V3 기반 (저렴하고 빠름)
- 한국어 최적화

**API 키 설정:**
```bash
pnpm kcode --key YOUR_DEEPSEEK_API_KEY
```

---

### 옵션 2: Claude Code (설치형)

**Claude Code**는 Anthropic의 공식 AI 코딩 도구입니다.

```bash
# 1. Claude Code 설치
npm install -g @anthropic-ai/claude-code

# 2. 프로젝트에서 실행
cd my-saas
claude

# 3. 요청하기
> "로그인 페이지에 네이버 로그인 추가해줘"
> "관리자에 상품 관리 페이지 만들어줘"
```

**장점:**
- Claude Opus/Sonnet 모델 사용
- 복잡한 추론 능력
- 대화형 인터페이스

**API 키 설정:**
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

---

### 옵션 3: Cursor IDE

**Cursor**는 AI가 내장된 VS Code 포크입니다.

```bash
# 1. Cursor 설치 (https://cursor.sh)

# 2. 프로젝트 열기
cursor .

# 3. Cmd+K (Mac) / Ctrl+K (Windows)로 AI에게 요청
```

---

## 어떤 도구를 선택할까요?

| 도구 | 비용 | 추천 작업 | 필요한 것 |
|-----|------|---------|----------|
| **K-Code** | 💰 매우 저렴 | 간단한 수정, 파일 추가, 빠른 개발 | DeepSeek API 키 |
| **Claude Code** | 💰💰💰 비쌈 | 복잡한 로직, 고난이도 개발, 대규모 리팩토링 | Anthropic API 키 |
| **Cursor** | 💰💰 중간 | 실시간 편집, 비주얼 작업 | Cursor 구독 |

### K-Code vs Claude Code 상세 비교

| 항목 | K-Code | Claude Code |
|-----|--------|-------------|
| **비용** | ~$0.001/작업 (매우 저렴) | ~$0.10/작업 (100배 비쌈) |
| **속도** | 빠름 | 보통 |
| **적합한 작업** | 버튼 추가, 페이지 생성, 간단한 API | 복잡한 알고리즘, 대규모 리팩토링 |
| **OneSaaS 이해도** | 완벽 (전용 설계) | 좋음 |
| **한국어** | 최적화됨 | 지원됨 |

### 추천 워크플로우

```
일반 작업 (90%) → K-Code 사용
  "버튼 추가해줘"
  "새 페이지 만들어줘"
  "API 엔드포인트 추가해줘"

복잡한 작업 (10%) → Claude Code 사용
  "전체 인증 시스템 리팩토링해줘"
  "복잡한 결제 로직 설계해줘"
  "대규모 마이그레이션 진행해줘"
```

**초보자 추천:** K-Code로 시작하세요! 이미 설치되어 있고, 저렴하며, OneSaaS 구조를 완벽히 이해합니다.

---

## 프로젝트 개요

**OneSaaS Starter**는 한국 초보자를 위한 SaaS 템플릿입니다.

### 핵심 기능
- **12개 업종별 랜딩 템플릿** - SaaS, 부동산, 교육, 피트니스, 레스토랑, 의료, 여행, 금융, 에이전시, 이커머스, 이벤트
- **인증 시스템** - 이메일, Google, 카카오, GitHub
- **결제 시스템** - PortOne, TossPayments (한국형)
- **관리자 대시보드** - 통계, 사용자 관리, Chart.js
- **400+ UI 컴포넌트** - 버튼, 카드, 모달, 폼 등
- **10개 테마** - 다크/라이트 모드 지원

---

## 원스탑 가이드

### 1. 코드 수정하기
```bash
pnpm dev                    # 개발 서버 실행
# http://localhost:3000 에서 확인
# src/onesaas-custom/ 에서 자유롭게 수정
```

### 2. Git 커밋하기
```bash
git status                  # 변경사항 확인
git add .                   # 스테이징
git commit -m "feat: 설명"  # 커밋
git push                    # 푸시 → 자동 배포!
```

### 3. 프로젝트 업데이트
```bash
onesaas update              # OneSaaS CLI로 업데이트
# 또는 수동으로:
git fetch origin
git merge origin/main
```

### 4. Vercel 배포
```bash
git push                    # 자동 배포 (권장)
# 또는 수동:
vercel
```

### 5. 데이터베이스 변경
```bash
pnpm db:push                # 개발용 (빠른 적용)
pnpm db:migrate             # 프로덕션 (마이그레이션 기록)
pnpm db:studio              # DB GUI 열기
```

---

## 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
pnpm dev

# 프로덕션 빌드
pnpm build

# 데이터베이스
pnpm db:push                # 스키마 적용
pnpm db:migrate             # 마이그레이션
pnpm db:studio              # Prisma Studio

# K-Code
pnpm kcode "작업"           # AI 코딩
pnpm kcode --guide          # 가이드
pnpm kcode --smart "작업"   # Smart 모드
```

---

## 폴더 구조 (중요!)

```
my-saas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 홈페이지
│   │   ├── api/               # API 라우트
│   │   └── (routes)/          # 페이지들
│   │
│   ├── onesaas-core/          # 핵심 모듈 (수정 주의)
│   │   ├── templates/         # 랜딩 템플릿 (12개)
│   │   ├── themes/            # 테마 (10개)
│   │   ├── ui/                # UI 컴포넌트 (400+)
│   │   ├── auth/              # 인증 시스템
│   │   ├── payment/           # 결제 시스템
│   │   └── admin/             # 관리자 대시보드
│   │
│   ├── onesaas-custom/        # 커스텀 영역 (자유롭게 수정!)
│   │   ├── landing/           # 커스텀 랜딩 페이지
│   │   ├── pages/             # 커스텀 페이지
│   │   └── components/        # 커스텀 컴포넌트
│   │
│   └── onesaas-bridge/        # 설정 연결
│       ├── config.ts          # 서비스 설정
│       ├── routes.ts          # 라우팅 설정
│       └── theme.ts           # 테마 설정
│
├── cli/                       # K-Code CLI 소스
├── cli-dist/                  # K-Code 빌드 결과
├── prisma/                    # DB 스키마
└── public/                    # 정적 파일
```

---

## 영역 구분 규칙

### onesaas-core (주의해서 수정)

핵심 기능이 들어있습니다. 가능하면 onesaas-custom에 새 코드를 추가하세요.

```
⚠️ 주의: 향후 업데이트 시 충돌 가능
✅ 권장: onesaas-core 컴포넌트를 가져다 사용
```

### onesaas-custom (자유롭게 수정!)

비즈니스 로직과 커스텀 페이지를 여기에 추가하세요.
**이 폴더는 업데이트 시에도 절대 덮어쓰지 않습니다.**

```tsx
// 예시: 커스텀 페이지
// src/onesaas-custom/pages/MyPage.tsx

import { Button } from '@/onesaas-core/ui'

export function MyPage() {
  return (
    <div>
      <h1>내 페이지</h1>
      <Button>클릭</Button>
    </div>
  )
}
```

### onesaas-bridge (설정 변경)

서비스 설정, 기능 플래그 등을 관리합니다.

---

## 자주 하는 작업

### 1. 새 페이지 추가

```tsx
// src/app/my-page/page.tsx 생성
export default function MyPage() {
  return <div>새 페이지</div>
}
```

### 2. 업종별 랜딩 템플릿 사용

```tsx
// src/app/page.tsx
import { LandingFitness } from '@/onesaas-core/templates/landing'

export default function HomePage() {
  return <LandingFitness />
}
```

**사용 가능한 템플릿:**
- `LandingSaaS`, `LandingStartup`
- `LandingRealEstate` (부동산)
- `LandingEducation` (교육/학원)
- `LandingFitness` (피트니스)
- `LandingRestaurant` (레스토랑)
- `LandingHealthcare` (의료/병원)
- `LandingTravel` (여행)
- `LandingFinance` (금융/핀테크)
- `LandingAgency` (에이전시)
- `LandingEcommerce` (이커머스)
- `LandingEvent` (이벤트/웨딩)

### 3. API 엔드포인트 추가

```tsx
// src/app/api/my-api/route.ts
export async function GET() {
  return Response.json({ message: 'Hello' })
}
```

### 4. 데이터베이스 스키마 변경

```bash
# prisma/schema.prisma 수정 후
pnpm db:push
```

---

## AI에게 요청하는 좋은 예시

```
✅ "로그인 페이지에 GitHub 로그인 버튼 추가해줘"
✅ "가격표 페이지에 연간 결제 옵션 추가해줘"
✅ "관리자 대시보드에 최근 가입자 목록 보여줘"
✅ "상품 목록 페이지 만들어줘"
✅ "결제 완료 후 이메일 발송 기능 추가해줘"
```

---

## 환경 변수

`.env` 파일:

```bash
# 데이터베이스 (필수)
DATABASE_URL=postgresql://...

# Supabase 인증 (필수)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# K-Code AI (선택 - 하나 이상)
DEEPSEEK_API_KEY=sk-...          # 권장
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# 결제 (선택)
PORTONE_API_KEY=...
TOSS_SECRET_KEY=...
```

---

## 문제 해결

### 빌드 에러
```bash
pnpm build
# 에러 메시지 확인 후 해당 파일 수정
```

### 데이터베이스 연결 안됨
```bash
# .env 파일의 DATABASE_URL 확인
# Supabase Connection Pooling URL 사용
```

### K-Code 실행 안됨
```bash
# CLI 빌드 필요
pnpm cli:build

# API 키 확인
pnpm kcode --list
```

---

## 참고 링크

- **OneSaaS 빌더**: https://onesaas.kr
- **K-Code 문서**: https://onesaas.kr/docs/kcode
- **Next.js 문서**: https://nextjs.org/docs
- **Prisma 문서**: https://www.prisma.io/docs
- **Supabase 문서**: https://supabase.com/docs
- **Tailwind CSS 문서**: https://tailwindcss.com/docs
