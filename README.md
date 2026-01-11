# OneSaaS Starter

> AI와 함께 개발하는 한국형 SaaS 템플릿

Next.js 16 + Supabase + Tailwind CSS 기반의 SaaS 스타터 킷입니다.
**K-Code AI 코딩 도구가 내장**되어 있어 한국어로 자연스럽게 개발할 수 있습니다.

## 빠른 시작

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

# 5. K-Code CLI 빌드
pnpm cli:build

# 6. 개발 서버 실행
pnpm dev
```

http://localhost:3000 에서 확인

---

## K-Code: AI 코딩 어시스턴트

이 템플릿에는 **K-Code**가 내장되어 있습니다. 한국어로 코딩 작업을 요청하세요!

### 사용법

```bash
# 기본 사용
pnpm kcode "로그인 페이지에 네이버 로그인 추가해줘"

# Smart 모드 (분석 → 구현)
pnpm kcode "복잡한 API 설계해줘" --smart

# 원스탑 가이드 보기
pnpm kcode --guide

# 도움말
pnpm kcode --help
```

### K-Code 기능

| 기능 | 설명 |
|-----|------|
| **자연어 코딩** | 한국어로 요청하면 자동으로 코드 수정 |
| **프로젝트 분석** | OneSaaS 구조를 이해하고 올바른 위치에 코드 작성 |
| **Smart 모드** | DeepSeek Reasoner로 분석 후 구현 |
| **원스탑 가이드** | 개발→커밋→배포 전 과정 안내 |

### API 키 설정

```bash
# DeepSeek API 키 저장 (한 번만)
pnpm kcode --key YOUR_DEEPSEEK_API_KEY

# 또는 다른 모델
pnpm kcode --key openai sk-...
pnpm kcode --key anthropic sk-ant-...
```

---

## AI 도구 비교: K-Code vs Claude Code

| 항목 | K-Code (내장) | Claude Code (설치형) |
|-----|--------------|---------------------|
| **비용** | 💰 매우 저렴 (~$0.001/작업) | 💰💰💰 비쌈 (~$0.10/작업) |
| **추천 작업** | 간단한 수정, 페이지 추가, API | 복잡한 로직, 대규모 리팩토링 |
| **설치** | 불필요 (내장) | npm 설치 필요 |
| **OneSaaS 특화** | 완벽 | 좋음 |

**추천:** 일반 작업은 K-Code, 복잡한 작업만 Claude Code 사용

---

## 원스탑 가이드

### 1. 코드 수정
```bash
pnpm dev                    # 개발 서버 실행
# src/onesaas-custom/ 에서 자유롭게 수정
```

### 2. Git 커밋
```bash
git add .
git commit -m "feat: 새 기능 추가"
git push                    # 자동 배포!
```

### 3. 배포
Git push하면 Vercel이 자동으로 배포합니다.

### 4. DB 변경
```bash
pnpm db:push                # 개발용
pnpm db:migrate             # 프로덕션용
```

---

## 포함된 기능

| 기능 | 설명 |
|-----|------|
| **인증** | 이메일, Google, 카카오, GitHub 로그인 |
| **결제** | PortOne, TossPayments 연동 (한국형) |
| **관리자** | 대시보드, 사용자 관리, 통계, Chart.js |
| **AI 기능** | AI 글쓰기, 이미지 생성 샘플 |
| **테마** | 11개 테마 + 다크/라이트 모드 |
| **K-Code** | 한국어 AI 코딩 어시스턴트 |

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

## 환경 변수

`.env` 파일:

```bash
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://...

# K-Code AI (선택 - 하나 이상 필요)
DEEPSEEK_API_KEY=sk-...          # 권장 (가성비 최고)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# 결제 - PortOne (선택)
NEXT_PUBLIC_PORTONE_MERCHANT_ID=imp...
PORTONE_API_KEY=...

# 결제 - TossPayments (선택)
NEXT_PUBLIC_TOSS_CLIENT_KEY=...
TOSS_SECRET_KEY=...
```

## 스크립트

```bash
# 개발
pnpm dev              # 개발 서버
pnpm build            # 프로덕션 빌드

# 데이터베이스
pnpm db:push          # DB 스키마 적용 (개발)
pnpm db:migrate       # DB 마이그레이션 (프로덕션)
pnpm db:studio        # Prisma Studio (DB GUI)

# K-Code
pnpm cli:build        # K-Code CLI 빌드
pnpm kcode "작업"     # K-Code 실행
pnpm kcode --guide    # 원스탑 가이드
pnpm ai "작업"        # kcode 별칭
```

## 폴더 구조

```
my-saas/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── onesaas-core/           # 핵심 모듈
│   │   ├── admin/              # 관리자 기능
│   │   ├── auth/               # 인증
│   │   ├── payment/            # 결제
│   │   ├── themes/             # 테마
│   │   └── ui/                 # UI 컴포넌트
│   ├── onesaas-custom/         # 커스텀 코드 (자유롭게 수정)
│   ├── onesaas-managed/        # 관리 코드
│   └── onesaas-bridge/         # 설정 연결
├── cli/                        # K-Code CLI 소스
├── cli-dist/                   # K-Code 빌드 결과
├── prisma/                     # DB 스키마
└── public/                     # 정적 파일
```

## 배포

### Vercel (권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/johunsang/onesass-starter)

Git push하면 자동 배포됩니다!

### 수동 배포

```bash
pnpm build
# .next 폴더를 Vercel/AWS/GCP에 배포
```

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **스타일**: Tailwind CSS
- **데이터베이스**: Prisma + Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **결제**: PortOne / TossPayments
- **차트**: Chart.js
- **AI 코딩**: K-Code (DeepSeek, OpenAI, Anthropic)
- **AI SDK**: Vercel AI SDK

## 링크

- **OneSaaS 빌더**: https://onesaas.kr
- **GitHub**: https://github.com/johunsang/onesass-starter
- **K-Code 문서**: https://onesaas.kr/docs/kcode

## 라이선스

MIT
