# OneSaaS Starter

> AI와 함께 개발하는 한국형 SaaS 템플릿

Next.js 16 + Supabase + Tailwind CSS 기반의 SaaS 스타터 킷입니다.
**K-Code AI 코딩 도구가 내장**되어 있어 한국어로 자연스럽게 개발할 수 있습니다.

## 빠른 시작

```bash
# 1. 템플릿 다운로드
git clone https://github.com/johunsang/onesass-starter.git my-saas
cd my-saas

# 2. 의존성 설치 (자동으로 안내 메시지 표시)
pnpm install

# 3. 설정 마법사 실행 ⭐ (단계별 안내)
pnpm setup
```

**`pnpm setup` 하나로 끝!** 마법사가 단계별로 안내해줍니다:
- **자동 설정 (추천)**: Access Token만 입력하면 프로젝트 선택 → 자동 완성!
- **수동 설정**: 직접 환경변수를 입력하고 싶다면 이 옵션
- Supabase 없으면? → 만드는 방법 상세 안내
- DB 스키마 적용 → 자동 실행 옵션
- 개발 서버 실행 → 자동 실행 옵션

> 💡 **Supabase가 뭔가요?**
> 무료 데이터베이스 서비스예요. https://supabase.com 에서 2분이면 만들 수 있어요.
> `pnpm setup` 실행하면 만드는 방법도 알려줍니다!

### Supabase 자동 설정 (추천)

Access Token 하나로 모든 환경변수가 자동 설정됩니다!

```bash
pnpm setup
# → "Access Token으로 자동 설정" 선택
# → Access Token 입력 (supabase.com/dashboard/account/tokens에서 발급)
# → 프로젝트 선택
# → DB 비밀번호 입력
# → 완료! 🎉
```

| 자동 설정되는 항목 | 설명 |
|------------------|------|
| DATABASE_URL | 데이터베이스 연결 URL |
| NEXT_PUBLIC_SUPABASE_URL | Supabase 프로젝트 URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | 공개 API 키 |

http://localhost:3000 에서 확인

---

## 🚨 OneSaaS로 배포한 후 로컬 개발 (필수!)

> **OneSaaS 빌더(onesaas.kr)로 이미 배포했다면 이 방법을 사용하세요!**

OneSaaS로 배포한 프로젝트를 로컬에서 개발하려면 환경변수가 필요합니다.
**Vercel CLI** 명령어 하나로 모든 환경변수를 가져올 수 있습니다.

```bash
# 1. 프로젝트 클론
git clone https://github.com/내계정/내프로젝트.git
cd 내프로젝트
pnpm install

# 2. Vercel CLI 설치 (처음 한 번만)
npm install -g vercel

# 3. Vercel 프로젝트 연결 (처음 한 번만)
vercel link

# 4. 환경변수 가져오기 (.env.local 자동 생성!)
vercel env pull .env.local

# 5. 개발 서버 실행
pnpm dev
```

**왜 이게 필요한가요?**
- **DATABASE_URL** - 24자리 랜덤 비밀번호가 포함된 DB 연결 주소
- **SUPABASE_URL/KEY** - 인증 시스템 연결 정보
- **결제 API 키** - 결제 시스템 연결 정보

이 모든 값이 Vercel에 안전하게 저장되어 있어서, `vercel env pull` 명령어로 한 번에 가져옵니다!

> 💡 **`pnpm setup`과 뭐가 다른가요?**
> - `pnpm setup`: 처음 템플릿을 클론해서 새 프로젝트를 만들 때
> - `vercel env pull`: OneSaaS로 이미 배포한 프로젝트를 로컬에서 개발할 때

---

## K-Code: AI 코딩 어시스턴트

이 템플릿에는 **K-Code**가 내장되어 있습니다. 한국어로 코딩 작업을 요청하세요!

### 사용법

```bash
# 기본 사용 - 한국어로 말하면 끝!
pnpm kcode "로그인 페이지에 유효성 검사 추가해줘"

# 대화형 모드 - AI와 실시간 대화
pnpm kcode -i

# 복잡한 작업 - 개발 모드
pnpm kcode --dev "인증 시스템 리팩토링해줘"

# 모델 선택
pnpm kcode -m deepseek "버그 수정해줘"
```

### 지원 AI 모델 (가격순)

| 모델 | 가격 (1M 토큰) | 특징 |
|-----|---------------|------|
| Qwen Turbo | $0.03 | 💰 **가장 저렴!** |
| MiniMax M2.1 | $0.07 | 코딩 특화 |
| Groq Qwen3 | $0.24 | ⚡ 초고속, **무료 티어** |
| DeepSeek V3.2 | $0.27 | 🔧 코딩 구현 |
| Gemini 3 Flash | $0.50 | 🌟 이미지 분석 |

### API 키 설정

```bash
# Groq (무료 티어 있음, 추천)
pnpm kcode --key groq YOUR_GROQ_API_KEY

# Qwen (가장 저렴)
pnpm kcode --key qwen YOUR_QWEN_API_KEY

# DeepSeek (코딩 특화)
pnpm kcode --key deepseek YOUR_DEEPSEEK_API_KEY

# 모델 목록 보기
pnpm kcode --list
```

> 💡 **어떤 API 키를 써야 하나요?**
> 처음이라면 **Groq** 추천! 무료 티어가 있어서 테스트하기 좋아요.
> https://console.groq.com 에서 가입하고 API 키 발급받으세요.

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

> 💡 **직접 설정하지 마세요!** `pnpm setup` 실행하면 알아서 만들어줍니다.

수동으로 설정하려면 `.env` 파일:

```bash
# Supabase (필수) - pnpm setup이 안내해줌
# Connection Pooler 사용 (포트 6543 + pgbouncer)
DATABASE_URL=postgresql://postgres.xxx:비밀번호@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:비밀번호@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# K-Code AI (선택) - pnpm kcode --key 명령어로 설정
GROQ_API_KEY=gsk_...             # 무료 티어 있음
QWEN_API_KEY=sk-...              # 가장 저렴
DEEPSEEK_API_KEY=sk-...          # 코딩 특화

# 결제 (선택)
NEXT_PUBLIC_PORTONE_MERCHANT_ID=imp...
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
```

## 스크립트

```bash
# 처음 시작할 때
pnpm setup            # ⭐ 설정 마법사 (이것만 하면 됨!)

# 개발
pnpm dev              # 개발 서버
pnpm build            # 프로덕션 빌드

# 데이터베이스
pnpm db:push          # DB 스키마 적용
pnpm db:studio        # DB 보기 (브라우저에서)

# K-Code AI
pnpm kcode "작업"     # AI에게 코딩 시키기
pnpm kcode -i         # AI와 대화형 코딩
pnpm kcode --list     # 모델 목록 보기
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
