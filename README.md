# OneSaaS Starter Kit

> 인증, 결제, 관리자 대시보드 + **12개 업종별 랜딩 템플릿**이 포함된 한국형 SaaS 스타터 킷

Next.js 16 + Supabase + Tailwind CSS 기반

## ✨ 주요 기능

| 기능 | 설명 |
|-----|------|
| **🎨 12개 랜딩 템플릿** | SaaS, 부동산, 교육, 피트니스, 레스토랑, 의료, 여행, 금융, 에이전시, 이커머스, 이벤트 |
| **🔐 인증** | 이메일, Google, 카카오, GitHub 로그인 |
| **💳 결제** | PortOne, TossPayments 연동 (한국형) |
| **📊 관리자** | 대시보드, 사용자 관리, 통계, Chart.js |
| **🎯 UI 컴포넌트** | 400+ 컴포넌트 (버튼, 카드, 모달, 폼 등) |
| **🌓 테마** | 10개 테마 + 다크/라이트 모드 |
| **🤖 AI** | OpenAI, Anthropic SDK 연동 |

## 🏢 업종별 랜딩 템플릿

각 업종에 최적화된 프리미엄 랜딩 페이지:

| 템플릿 | 설명 | 미리보기 |
|-------|------|---------|
| **SaaS** | 소프트웨어 서비스 | `/templates/saas` |
| **Startup** | 스타트업/테크 기업 | `/templates/startup` |
| **부동산** | 중개, 분양, 임대 | `/templates/real-estate` |
| **교육/학원** | 온라인 강의, 학원 | `/templates/education` |
| **피트니스** | 헬스장, PT, 요가 | `/templates/fitness` |
| **레스토랑** | 카페, 다이닝 | `/templates/restaurant` |
| **의료/병원** | 클리닉, 헬스케어 | `/templates/healthcare` |
| **여행** | 여행사, 투어, 숙박 | `/templates/travel` |
| **금융/핀테크** | 은행, 투자 | `/templates/finance` |
| **에이전시** | 디자인, 마케팅 | `/templates/agency` |
| **이커머스** | 온라인 쇼핑몰 | `/templates/ecommerce` |
| **이벤트/웨딩** | 웨딩홀, 이벤트 | `/templates/event` |

**템플릿 쇼케이스**: `/templates` 에서 모든 템플릿 미리보기

## 빠른 시작

```bash
# 1. 클론
git clone https://github.com/johunsang/onesass-starter.git my-saas
cd my-saas

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정
cp .env.example .env
# .env 파일에 Supabase, 결제 API 키 입력

# 4. DB 스키마 적용
pnpm db:push

# 5. 개발 서버 실행
pnpm dev
```

http://localhost:3000 에서 확인

## 설정 파일 (onesaas.json)

기능 활성화/비활성화:

```json
{
  "project": {
    "name": "내 SaaS",
    "slug": "my-saas"
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

## 환경 변수

`.env` 파일 설정:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# 결제 (PortOne)
NEXT_PUBLIC_PORTONE_MERCHANT_ID=imp...
PORTONE_API_KEY=...

# 결제 (TossPayments) - 선택
NEXT_PUBLIC_TOSS_CLIENT_KEY=...
TOSS_SECRET_KEY=...

# AI - 선택
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## 스크립트

```bash
pnpm dev          # 개발 서버 (http://localhost:3000)
pnpm build        # 프로덕션 빌드
pnpm db:push      # DB 스키마 적용
pnpm db:studio    # Prisma Studio (DB GUI)
```

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack)
- **스타일**: Tailwind CSS + CSS Variables
- **데이터베이스**: Prisma + Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **결제**: PortOne / TossPayments (한국형)
- **차트**: Chart.js + react-chartjs-2
- **AI**: Vercel AI SDK (OpenAI, Anthropic)
- **아이콘**: Lucide React

## 폴더 구조 (상세)

```
src/
├── app/
│   ├── templates/          # 템플릿 쇼케이스
│   │   ├── page.tsx        # 템플릿 목록
│   │   └── [id]/page.tsx   # 개별 템플릿 미리보기
│   └── ...
│
├── onesaas-core/
│   ├── templates/          # 🎨 랜딩 템플릿 (12개)
│   │   └── landing/
│   │       ├── LandingSaaS.tsx
│   │       ├── LandingStartup.tsx
│   │       ├── LandingRealEstate.tsx
│   │       ├── LandingEducation.tsx
│   │       ├── LandingFitness.tsx
│   │       ├── LandingRestaurant.tsx
│   │       ├── LandingHealthcare.tsx
│   │       ├── LandingTravel.tsx
│   │       ├── LandingFinance.tsx
│   │       ├── LandingAgency.tsx
│   │       ├── LandingEcommerce.tsx
│   │       └── LandingEvent.tsx
│   │
│   ├── themes/             # 🌓 테마 (10개)
│   ├── ui/                 # 🎯 UI 컴포넌트 (400+)
│   │   ├── primitives/     # 기본 (Button, Input, etc.)
│   │   ├── layout/         # 레이아웃
│   │   ├── navigation/     # 네비게이션
│   │   ├── feedback/       # 피드백
│   │   ├── data-display/   # 데이터 표시
│   │   ├── forms/          # 폼
│   │   ├── charts/         # 차트
│   │   ├── marketing/      # 마케팅 (Hero, Features, Pricing)
│   │   └── korean/         # 한국 특화
│   │
│   ├── auth/               # 🔐 인증
│   ├── payment/            # 💳 결제
│   └── admin/              # 📊 관리자
│
├── onesaas-custom/         # ✅ 커스텀 영역
└── onesaas-bridge/         # 🔗 설정
```

## Claude Code 사용

이 프로젝트는 Claude Code와 함께 사용하도록 설계되었습니다.

```bash
# Claude Code 설치 후
cd my-saas
claude

# 예시 요청
> "로그인 페이지에 GitHub 로그인 추가해줘"
> "가격 페이지에 연간 결제 옵션 추가해줘"
> "상품 목록 페이지 만들어줘"
```

자세한 가이드: [CLAUDE.md](./CLAUDE.md)

## 배포

### Vercel (권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/johunsang/onesass-starter)

### 수동 배포

```bash
pnpm build
# .next 폴더를 Vercel/AWS/GCP에 배포
```

## 문서

- [CLAUDE.md](./CLAUDE.md) - Claude Code 사용 가이드
- [MAINTENANCE.md](./MAINTENANCE.md) - 유지보수 가이드
- [onesaas-core/README.md](./src/onesaas-core/README.md) - 공통 모듈 문서

## 라이선스

MIT
