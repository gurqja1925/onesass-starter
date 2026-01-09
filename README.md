# OneSaaS Starter

> AI와 함께 개발하는 한국형 SaaS 템플릿

Next.js 16 + Supabase + Tailwind CSS 기반의 SaaS 스타터 킷입니다.
이 템플릿을 다운로드하고, Claude Code나 Cursor 같은 AI 코딩 도구로 커스터마이징하세요.

## 사용 방법

```bash
# 1. 템플릿 다운로드
git clone https://github.com/johunsang/onesass-starter.git my-saas
cd my-saas

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정
cp .env.example .env
# .env 파일에 Supabase 정보 입력

# 4. DB 스키마 적용
pnpm db:push

# 5. 개발 서버 실행
pnpm dev
```

http://localhost:3000 에서 확인

## 포함된 기능

| 기능 | 설명 |
|-----|------|
| **인증** | 이메일, Google, 카카오, GitHub 로그인 |
| **결제** | PortOne, TossPayments 연동 (한국형) |
| **관리자** | 대시보드, 사용자 관리, 통계, Chart.js |
| **AI 기능** | AI 글쓰기, 이미지 생성 샘플 |
| **12개 랜딩 템플릿** | 업종별 최적화 페이지 |
| **11개 테마** | 다크/라이트 모드 지원 |

## 랜딩 템플릿 (12종)

| 템플릿 | 업종 |
|-------|------|
| SaaS | 소프트웨어 서비스 |
| Startup | 스타트업/테크 기업 |
| Real Estate | 부동산 중개, 분양 |
| Education | 온라인 강의, 학원 |
| Fitness | 헬스장, PT, 요가 |
| Restaurant | 카페, 다이닝 |
| Healthcare | 클리닉, 병원 |
| Travel | 여행사, 투어 |
| Finance | 은행, 핀테크 |
| Agency | 디자인, 마케팅 에이전시 |
| Ecommerce | 온라인 쇼핑몰 |
| Event | 웨딩홀, 이벤트 |

## 테마 (11종)

- Base (기본)
- Minimal (미니멀)
- Startup (스타트업)
- Corporate (기업)
- Luxury (럭셔리)
- Playful (캐주얼)
- Brutalist (브루탈리스트)
- Neon (네온)
- Healthcare (헬스케어)
- Fintech (핀테크)
- Ecommerce (이커머스)

## 샘플 페이지

| 페이지 | 경로 | 설명 |
|-------|------|------|
| 홈 | `/` | 랜딩 페이지 |
| 로그인 | `/login` | 로그인 샘플 |
| 회원가입 | `/signup` | 회원가입 샘플 |
| 대시보드 | `/dashboard` | 사용자 대시보드 |
| AI 도구 | `/dashboard/ai` | AI 기능 샘플 |
| 관리자 | `/admin` | 관리자 대시보드 |
| 사용자 관리 | `/admin/users` | 사용자 CRUD |
| 결제 관리 | `/admin/payments` | 결제 내역 |
| 통계 | `/admin/analytics` | 통계 차트 |
| 쇼케이스 | `/showcase` | UI 컴포넌트 |
| 문서 | `/docs` | 사용 가이드 |

## 환경 변수

`.env` 파일:

```bash
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# 결제 - PortOne (선택)
NEXT_PUBLIC_PORTONE_MERCHANT_ID=imp...
PORTONE_API_KEY=...

# 결제 - TossPayments (선택)
NEXT_PUBLIC_TOSS_CLIENT_KEY=...
TOSS_SECRET_KEY=...

# AI (선택)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

## 스크립트

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm db:push      # DB 스키마 적용
pnpm db:studio    # Prisma Studio (DB GUI)
pnpm theme:list   # 테마 목록
pnpm theme:apply  # 테마 적용
```

## 폴더 구조

```
src/
├── app/                    # Next.js App Router
├── onesaas-core/           # 핵심 모듈
│   ├── admin/              # 관리자 기능
│   ├── auth/               # 인증
│   ├── payment/            # 결제
│   ├── templates/          # 랜딩 템플릿 (12개)
│   │   └── landing/
│   ├── themes/             # 테마 (11개)
│   └── ui/                 # UI 컴포넌트
├── onesaas-custom/         # 커스텀 코드 (수정 가능)
├── onesaas-managed/        # 관리 코드
└── onesaas-bridge/         # 설정 연결
```

## AI와 함께 개발하기

이 템플릿은 AI 코딩 도구와 함께 사용하도록 설계되었습니다.

**Claude Code 사용:**
```bash
cd my-saas
claude

# 예시 요청
> "로그인 페이지에 네이버 로그인 추가해줘"
> "관리자에 상품 관리 페이지 만들어줘"
> "결제 완료 후 이메일 발송 기능 추가해줘"
```

**Cursor 사용:**
```bash
cd my-saas
cursor .

# Cmd+K로 AI에게 요청
```

## 배포

### Vercel (권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/johunsang/onesass-starter)

### 수동 배포

```bash
pnpm build
# .next 폴더를 Vercel/AWS/GCP에 배포
```

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, Turbopack)
- **스타일**: Tailwind CSS
- **데이터베이스**: Prisma + Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **결제**: PortOne / TossPayments
- **차트**: Chart.js
- **AI**: Vercel AI SDK (OpenAI, Anthropic, Google)
- **아이콘**: Lucide React

## 문서

- [CLAUDE.md](./CLAUDE.md) - Claude Code 사용 가이드
- [onesaas-core/README.md](./src/onesaas-core/README.md) - 핵심 모듈 문서

## 링크

- **OneSaaS 빌더**: https://onesaas.kr
- **GitHub**: https://github.com/johunsang/onesass-starter

## 라이선스

MIT
