## 프로젝트 개요

**OneSaaS Starter**는 한국 초보자를 위한 SaaS 템플릿입니다.

### 핵심 기능
- **인증 시스템** - 이메일, Google, 카카오, GitHub
- **결제 시스템** - Toss Payments, TossPayments (한국형)
- **관리자 대시보드** - 통계, 사용자 관리, Chart.js
- **400+ UI 컴포넌트** - 버튼, 카드, 모달, 폼 등
- **70개 테마** - 다크/라이트 모드 지원

---

## 🚨 로컬 개발 환경 설정 (필수!)

> **배포 후 로컬에서 개발하려면 반드시 먼저 해주세요!**

OneSaaS로 배포한 후 로컬에서 개발하려면 환경변수가 필요합니다.
Vercel CLI를 사용하면 **한 번에** 모든 환경변수를 가져올 수 있습니다.

### 0단계: 사전 준비사항

**필수: Node.js 20.9.0 이상**
```bash
# 버전 확인
node -v

# 업데이트 필요 시
# Windows: https://nodejs.org 에서 LTS 버전 다운로드
# Mac: nvm install 20 && nvm use 20
```

**선택: pnpm 설치** (npm도 가능)
```bash
npm install -g pnpm
```

**Private 리포지토리용: GitHub 인증**
```bash
# GitHub CLI 설치 및 로그인
# Windows: winget install --id GitHub.cli
# Mac: brew install gh
gh auth login

# 또는 OneSaaS 배포 페이지에서 ZIP 다운로드
```

### 1단계: 프로젝트 클론

```bash
git clone https://github.com/내계정/내프로젝트.git
cd 내프로젝트
pnpm install  # 또는 npm install
```

### 2단계: 환경변수 가져오기 (핵심!)

```bash
# Vercel CLI 설치 (처음 한 번만)
npm install -g vercel

# Vercel 계정 연결 (처음 한 번만)
vercel link
# Windows에서 에러 시: npx vercel link

# 환경변수 다운로드 (.env.local 자동 생성!)
vercel env pull .env.local
# Windows에서 에러 시: npx vercel env pull .env.local
```

**Windows 사용자 주의**

PowerShell에서 `vercel` 명령어를 찾을 수 없다면:
1. PowerShell 재시작 (가장 쉬움)
2. 또는 `npx vercel link` 사용

Windows ARM64 (Surface Pro X 등)에서 SWC 에러가 나면:
- `.env.local` 파일에 `NEXT_DISABLE_SWC=1` 추가

### 3단계: 개발 서버 실행

```bash
pnpm dev
# http://localhost:3000 에서 확인!
```

### 💡 왜 이게 필요한가요?

배포 시 자동 생성된 중요한 설정값들:
- **DATABASE_URL** - 데이터베이스 연결 주소 (24자리 랜덤 비밀번호 포함)
- **SUPABASE_URL/KEY** - 인증 시스템 연결 정보
- **결제 API 키** - 결제 시스템 연결 정보
- 기타 모든 설정값들...

이 모든 값이 Vercel에 안전하게 저장되어 있고, `vercel env pull` 명령어로 한 번에 가져옵니다!

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
|── prisma/                    # DB 스키마
└── public/                    # 정적 파일
```

---

## 디자인 정책 (중요!)

**OneSaaS의 디자인 테마와 컨셉은 절대 변경하지 마세요.**

### 핵심 원칙

```
⛔ 절대 금지:
- onesaas-core의 디자인 테마/색상/레이아웃 변경
- 기존 컴포넌트의 스타일 수정
- 전체 디자인 컨셉 변경

✅ 허용:
- onesaas-custom에 새로운 컴포넌트 추가
- 기존 컴포넌트 사용 (import해서 사용)
- 텍스트/문구 변경 (한글 번역 등)
```

### 디자인 가이드라인

1. **테마 일관성**: 기존 색상 팔레트와 스타일 유지
2. **컴포넌트 재사용**: 새로 만들지 말고 기존 UI 컴포넌트 활용
3. **레이아웃 유지**: 페이지 구조와 간격 변경 금지
4. **폰트/타이포그래피**: 기존 설정 유지

### 문구 변경 시

- 의미를 변경하지 않고 한글로만 번역
- 브랜딩 관련 텍스트는 설정 파일에서 변경
- 오류 메시지, 안내 문구만 수정 가능

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
TOSS_API_KEY=...
TOSS_SECRET_KEY=...
```

---

## 소셜 로그인 설정 (OAuth)

OneSaaS는 이메일, Google, 카카오, GitHub 로그인을 지원합니다.

### 🎉 OneSaaS 빌더 사용자라면?

**OAuth가 자동으로 설정됩니다!** 수동 설정이 필요 없습니다.

빌더 설정 화면에서 각 OAuth 앱의 인증 정보만 입력하면:
- ✅ Supabase OAuth 프로바이더 자동 활성화
- ✅ Client ID/Secret 자동 입력
- ✅ Callback URL 자동 설정
- ✅ 환경 변수 자동 구성

배포 후 바로 OAuth 로그인을 사용할 수 있습니다!

### 기본 제공되는 로그인

**이메일 로그인**은 별도 설정 없이 바로 사용 가능합니다.

```bash
# 이메일 로그인은 Supabase 설정만 있으면 작동
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 수동 OAuth 설정 (빌더 미사용 시)

Google, 카카오, GitHub 로그인을 수동으로 설정하려면:

**상세 가이드는 [OAUTH-SETUP.md](./OAUTH-SETUP.md) 문서를 참고하세요.**

간단 요약:

1. **Google 로그인**
   - Google Cloud Console에서 OAuth 클라이언트 생성
   - Supabase에 Client ID/Secret 등록

2. **카카오 로그인**
   - 카카오 Developers에서 앱 생성
   - Supabase에 REST API 키 등록

3. **GitHub 로그인**
   - GitHub에서 OAuth App 생성
   - Supabase에 Client ID/Secret 등록

### 로그인 제공자 활성화/비활성화

`onesaas.json` 파일에서 사용할 로그인 제공자를 선택:

```json
{
  "features": {
    "auth": {
      "enabled": true,
      "providers": ["email", "google", "kakao", "github"]
    }
  }
}
```

원하지 않는 제공자는 배열에서 제거하면 됩니다.

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
---

## 참고 링크

### 주요 가이드 문서
- **OAuth 설정 가이드**: [OAUTH-SETUP.md](./OAUTH-SETUP.md) - Google, 카카오, GitHub 로그인 설정 방법
- **배포 가이드**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Vercel 배포 가이드
- **유지보수 가이드**: [MAINTENANCE.md](./MAINTENANCE.md) - 프로젝트 유지보수 방법

### 공식 문서
- **OneSaaS 빌더**: https://onesaas.kr
- **K-Code 문서**: https://onesaas.kr/docs/kcode
- **Next.js 문서**: https://nextjs.org/docs
- **Prisma 문서**: https://www.prisma.io/docs
- **Supabase 문서**: https://supabase.com/docs
- **Tailwind CSS 문서**: https://tailwindcss.com/docs
