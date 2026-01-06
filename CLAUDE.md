# OneSaaS Starter - Claude Code 가이드

> 이 파일은 Claude Code가 프로젝트를 이해하고 효과적으로 도와주도록 안내합니다.

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

## 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
pnpm dev

# 프로덕션 빌드
pnpm build

# 데이터베이스 마이그레이션
pnpm db:push

# 데이터베이스 GUI
pnpm db:studio
```

---

## 폴더 구조 (중요!)

```
src/
├── app/
│   ├── templates/          # 템플릿 쇼케이스 페이지
│   │   ├── page.tsx        # 12개 템플릿 목록
│   │   └── [id]/page.tsx   # 개별 템플릿 미리보기
│   └── ...
│
├── onesaas-core/          # 🔒 공통 모듈 (수정 금지!)
│   ├── templates/          # 🎨 랜딩 템플릿 (12개)
│   │   └── landing/
│   │       ├── LandingSaaS.tsx
│   │       ├── LandingStartup.tsx
│   │       ├── LandingRealEstate.tsx    # 부동산
│   │       ├── LandingEducation.tsx     # 교육/학원
│   │       ├── LandingFitness.tsx       # 피트니스
│   │       ├── LandingRestaurant.tsx    # 레스토랑
│   │       ├── LandingHealthcare.tsx    # 의료/병원
│   │       ├── LandingTravel.tsx        # 여행
│   │       ├── LandingFinance.tsx       # 금융/핀테크
│   │       ├── LandingAgency.tsx        # 에이전시
│   │       ├── LandingEcommerce.tsx     # 이커머스
│   │       └── LandingEvent.tsx         # 이벤트/웨딩
│   │
│   ├── themes/             # 테마 (10개)
│   ├── ui/                 # UI 컴포넌트 (400+)
│   │   ├── primitives/     # 기본 (Button, Input, etc.)
│   │   ├── marketing/      # 마케팅 (Hero, Features, Pricing, FAQ)
│   │   ├── charts/         # 차트 (Chart.js)
│   │   └── korean/         # 한국 특화
│   │
│   ├── auth/               # 인증 시스템
│   ├── payment/            # 결제 시스템
│   └── admin/              # 관리자 대시보드
│
├── onesaas-custom/        # ✅ 비즈니스 영역 (자유롭게 수정!)
│   ├── landing/           # 커스텀 랜딩 페이지
│   ├── pages/             # 커스텀 페이지
│   └── components/        # 커스텀 컴포넌트
│
└── onesaas-bridge/        # 🔗 연결 레이어 (설정 파일)
    ├── config.ts          # 서비스 설정
    ├── routes.ts          # 라우팅 설정
    └── theme.ts           # 테마 설정
```

---

## 영역 구분 규칙

### 🔒 onesaas-core (절대 수정 금지)

이 폴더는 OneSaaS 템플릿의 핵심 기능입니다.
**직접 수정하면 향후 업데이트 시 충돌이 발생합니다!**

```
❌ 금지: onesaas-core 내 파일 직접 수정
✅ 허용: onesaas-core 컴포넌트/함수 가져다 사용
```

### ✅ onesaas-custom (자유롭게 수정)

비즈니스 로직과 커스텀 페이지를 이 폴더에 추가하세요.
**이 폴더는 업데이트 시에도 절대 덮어쓰지 않습니다.**

```tsx
// 예시: 커스텀 페이지 만들기
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

### 🔗 onesaas-bridge (설정 변경만)

서비스 설정, 기능 플래그 등을 관리합니다.
파일 내용을 수정할 수 있지만, 파일을 추가/삭제하지 마세요.

---

## 설정 파일

### onesaas.json (프로젝트 루트)

프로젝트의 핵심 설정 파일입니다:

```json
{
  "project": {
    "name": "내 SaaS",
    "slug": "my-saas"
  },
  "design": {
    "theme": "midnight"
  },
  "features": {
    "auth": {
      "enabled": true,
      "providers": ["email", "google", "kakao"]
    },
    "payment": {
      "enabled": true,
      "provider": "portone"
    },
    "admin": {
      "enabled": true
    }
  }
}
```

### 기능 활성화/비활성화

`onesaas.json`의 `features` 섹션을 수정하면 됩니다:

```json
{
  "features": {
    "auth": {
      "enabled": false  // 인증 비활성화
    }
  }
}
```

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

12개 업종별 템플릿 중 선택하여 사용:

```tsx
// src/app/page.tsx에서 템플릿 적용
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

**템플릿 미리보기:** `/templates` 페이지에서 확인

### 3. 커스텀 랜딩 페이지

`src/onesaas-custom/landing/` 폴더에서 작업하세요.

### 4. 색상/테마 변경

`src/app/globals.css`의 CSS 변수를 수정하세요:

```css
:root {
  --color-accent: #00ff88;  /* 강조색 변경 */
}
```

### 5. 새 API 엔드포인트

```tsx
// src/app/api/my-api/route.ts
export async function GET() {
  return Response.json({ message: 'Hello' })
}
```

### 6. 데이터베이스 스키마 변경

`prisma/schema.prisma` 수정 후:
```bash
pnpm db:push
```

---

## 환경 변수

`.env` 파일에 설정:

```
# 데이터베이스
DATABASE_URL=postgresql://...

# 인증 (Supabase)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 결제 (PortOne)
PORTONE_API_KEY=...

# AI (선택)
OPENAI_API_KEY=...
```

---

## Claude에게 요청하는 방법

### 좋은 요청 예시

```
✅ "로그인 페이지에 GitHub 로그인 버튼 추가해줘"
✅ "가격표 페이지에 연간 결제 옵션 추가해줘"
✅ "관리자 대시보드에 최근 가입자 목록 보여줘"
✅ "상품 목록 페이지 만들어줘"
```

### 주의할 요청

```
⚠️ "onesaas-core 폴더의 인증 로직 바꿔줘"
   → onesaas-custom에 새 로직을 추가하는 것을 권장

⚠️ "전체 구조를 바꿔줘"
   → 구체적인 요청으로 나눠서 진행하는 것을 권장
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
# Supabase 대시보드에서 연결 문자열 복사
```

### 스타일이 적용 안됨

```bash
# Tailwind CSS 클래스 확인
# globals.css의 CSS 변수 확인
```

---

## 참고 링크

- [Next.js 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
