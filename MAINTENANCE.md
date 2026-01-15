# OneSaaS 유지보수 완전 가이드

> 코딩을 전혀 몰라도 따라할 수 있는 가이드입니다.

---

## 0단계: Claude Code 설치 (AI 도우미)

> Clde Code를 설치하면 AI가 코드 수정을 도와줍니다!

### Claude Code 설치

1. https://claude.ai/claude-code 접속
2. 운영체제에 맞는 설치 파일 다운로드
3. 설치 후 실행

### 프로젝트 열기

터미널에서:
```bash
cd 내프로젝트폴더
claude
```

### MCP 서버 설정 (AI 기능 확장)

Claude Code에서 다음 명령어 실행:

```bash
# Context7 MCP 설치 (문서 검색 기능)
claude mcp add context7 -- npx -y @upstash/context7-mcp
```

### Claude Code 사용법

프로젝트 폴더에서 `claude` 실행 후:

```
> 메인 페이지 제목을 "우리 서비스"로 바꿔줘
> 가격표에 새 플랜 추가해줘
> 로그인 버튼 색상을 파란색으로 바꿔줘
> 문의 폼 페이지 만들어줘
```

AI가 자동으로 코드를 수정해줍니다!

---

## 1단계: 터미널 열기

### Mac에서 터미널 열기

1. `Command(⌘) + Space` 누르기
2. "터미널" 또는 "Terminal" 입력
3. Enter 누르기

또는:
1. Finder 열기
2. 응용 프로그램 → 유틸리티 → 터미널

### Windows에서 터미널 열기

1. `Windows 키 + R` 누르기
2. "cmd" 입력
3. Enter 누르기

또는:
1. 시작 메뉴 클릭
2. "명령 프롬프트" 또는 "PowerShell" 검색
3. 클릭해서 열기

---

## 2단계: 필수 프로그램 설치

### Node.js 설치

1. https://nodejs.org 접속
2. **LTS 버전** 다운로드 (왼쪽 초록색 버튼)
3. 설치 파일 실행 → 다음 → 다음 → 완료

설치 확인 (터미널에서):
```
node --version
```
`v20.x.x` 같은 숫자가 나오면 성공!

### pnpm 설치

터미널에서 복사해서 붙여넣기:
```
npm install -g pnpm
```

설치 확인:
```
pnpm --version
```

### Git 설치

**Mac**: 터미널에서 `git` 입력하면 자동 설치 안내

**Windows**: https://git-scm.com 에서 다운로드 후 설치

---

## 3단계: 내 프로젝트 가져오기

### 처음 한 번만 하면 됩니다

터미널에서:

```bash
# 1. 프로젝트 다운로드 (GitHub 주소를 복사해서 붙여넣기)
git clone https://github.com/내아이디/내프로젝트이름

# 2. 프로젝트 폴더로 이동
cd 내프로젝트이름

# 3. 필요한 파일들 설치 (1-2분 소요)
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 http://localhost:3000 열기

> 종료하려면: `Ctrl + C`

---

## 4단계: 소스 수정하기

### 코드 편집 프로그램 설치 (VS Code 추천)

1. https://code.visualstudio.com 접속
2. 다운로드 후 설치
3. VS Code 실행
4. 파일 → 폴더 열기 → 내 프로젝트 폴더 선택

### 파일 구조

```
내프로젝트/
├── src/app/
│   ├── page.tsx          ← 메인 페이지
│   ├── globals.css       ← 디자인 (색상, 폰트)
│   ├── about/page.tsx    ← /about 페이지
│   └── pricing/page.tsx  ← /pricing 페이지
│
├── src/onesaas-custom/   ← ✅ 여기에 내 코드 추가!
└── onesaas.json          ← 프로젝트 설정
```

### 메인 페이지 수정 예시

`src/app/page.tsx` 파일 열기:

```tsx
export default function Home() {
  return (
    <div>
      <h1>내 서비스에 오신 것을 환영합니다!</h1>  {/* ← 이 부분 수정 */}
      <p>최고의 SaaS 서비스</p>
    </div>
  )
}
```

저장: `Ctrl + S` (Mac: `Cmd + S`)

브라우저에서 바로 확인! (자동 새로고침)

---

## 5단계: 변경사항 배포하기

### 웹사이트에 반영하기

터미널에서:

```bash
# 1. 어떤 파일이 바뀌었는지 확인
git status

# 2. 모든 변경사항 준비
git add .

# 3. 변경 내용 설명 작성
git commit -m "메인 페이지 문구 수정"

# 4. 서버에 업로드 (자동 배포됨!)
git push
```

> 🎉 1-2분 후 내 웹사이트에서 변경사항 확인!

### 배포 상태 확인

1. https://vercel.com 접속 (로그인)
2. 내 프로젝트 클릭
3. "Deployments" 탭에서 상태 확인
   - 🟢 Ready = 배포 완료
   - 🟡 Building = 배포 중
   - 🔴 Error = 오류 발생

---

## 6단계: 새 페이지 추가하기

### 예: "서비스 소개" 페이지 만들기

1. VS Code에서 `src/app/` 폴더 우클릭
2. "새 폴더" → `services` 입력
3. `services` 폴더 안에 `page.tsx` 파일 생성
4. 아래 코드 복사해서 붙여넣기:

```tsx
export default function ServicesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">서비스 소개</h1>

      <div className="space-y-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">기능 1</h2>
          <p className="text-gray-400">설명...</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">기능 2</h2>
          <p className="text-gray-400">설명...</p>
        </div>
      </div>
    </div>
  )
}
```

5. 저장 후 http://localhost:3000/services 에서 확인

### URL 규칙

| 폴더 위치 | 접속 주소 |
|----------|----------|
| `src/app/page.tsx` | yoursite.com |
| `src/app/about/page.tsx` | yoursite.com/about |
| `src/app/pricing/page.tsx` | yoursite.com/pricing |
| `src/app/blog/[id]/page.tsx` | yoursite.com/blog/123 |

---

## 7단계: 디자인 수정하기

### 색상 변경

`src/app/globals.css` 파일 열기:

```css
:root {
  --color-bg: #09090b;           /* 배경색 */
  --color-text: #fafafa;          /* 글자색 */
  --color-accent: #00ff88;        /* 강조색 ← 이거 바꾸면 버튼 색상 변경! */
}
```

### 자주 쓰는 색상 코드

| 색상 | 코드 |
|------|------|
| 초록 | `#00ff88` |
| 파랑 | `#3b82f6` |
| 보라 | `#8b5cf6` |
| 빨강 | `#ef4444` |
| 노랑 | `#eab308` |
| 흰색 | `#ffffff` |
| 검정 | `#000000` |

> 색상 찾기: https://colorhunt.co

---

## 8단계: 새 기능 추가하기

### 문의 폼 추가 예시

`src/app/contact/page.tsx`:

```tsx
'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 여기에 폼 전송 로직
    alert('문의가 접수되었습니다!')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">문의하기</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">문의 내용</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          보내기
        </button>
      </form>
    </div>
  )
}
```

---

## 9단계: 데이터베이스 사용하기

### Supabase 대시보드

1. https://supabase.com/dashboard 접속
2. 내 프로젝트 선택
3. 왼쪽 메뉴에서 "Table Editor" 클릭

### 데이터 추가/수정/삭제

- **추가**: "Insert" 버튼 → 값 입력 → Save
- **수정**: 행 클릭 → 값 수정 → Save
- **삭제**: 행 선택 → Delete

### 코드에서 데이터 가져오기

```tsx
// 데이터 가져오기
const { data } = await supabase
  .from('products')
  .select('*')

// 데이터 추가
await supabase
  .from('products')
  .insert({ name: '상품1', price: 10000 })

// 데이터 수정
await supabase
  .from('products')
  .update({ price: 15000 })
  .eq('id', 1)

// 데이터 삭제
await supabase
  .from('products')
  .delete()
  .eq('id', 1)
```

---

## 10단계: 환경변수 관리

### 환경변수란?

비밀번호, API 키 같은 민감한 정보를 안전하게 저장하는 방법

### 로컬 환경변수 (.env.local)

프로젝트 루트에 `.env.local` 파일:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=비밀키
```

### Vercel 환경변수

1. https://vercel.com → 내 프로젝트
2. Settings → Environment Variables
3. 변수 추가:
   - Name: `DATABASE_URL`
   - Value: `postgresql://...`
4. Save
5. "Redeploy" 클릭해서 적용

---

## 자주 하는 실수와 해결법

### "command not found" 오류

```
pnpm: command not found
```

**해결**: Node.js와 pnpm 설치 확인
```bash
npm install -g pnpm
```

### "Permission denied" 오류

**Mac 해결**:
```bash
sudo npm install -g pnpm
```
(비밀번호 입력)

### 푸시가 안 될 때

```
git push
# 오류 발생
```

**해결**:
```bash
git pull
# 충돌 해결 후
git push
```

### 빌드 에러

```bash
pnpm build
# 에러 메시지 확인
```

에러 메시지의 파일명과 줄 번호 확인 → 해당 위치 수정

### OAuth 로그인이 안 될 때

**증상**: Google/카카오/GitHub 로그인 버튼 클릭 시 "provider is not enabled" 오류

**OneSaaS 빌더 사용자**:
- 배포 과정에서 OAuth가 자동 설정되므로 문제가 없어야 합니다
- 문제 발생 시: 각 OAuth 플랫폼에서 Callback URL 확인
  - Google Cloud Console: 승인된 리디렉션 URI
  - Kakao Developers: Redirect URI
  - GitHub OAuth App: Authorization callback URL
- Callback URL 형식: `https://YOUR_SUPABASE_URL/auth/v1/callback`

**수동 배포 사용자**:
- `OAUTH-SETUP.md` 파일의 가이드를 따라 Supabase에서 OAuth 설정 필요

---

## 빠른 명령어 모음

```bash
# 개발 서버 실행
pnpm dev

# 변경사항 배포
git add . && git commit -m "수정" && git push

# 패키지 설치
pnpm install 패키지이름

# 빌드 테스트
pnpm build

# 최신 코드 가져오기
git pull
```

---

## 도움 받기

- **AI 도움**: Claude에게 물어보기
- **검색**: 에러 메시지 그대로 Google 검색
- **문서**: https://nextjs.org/docs

> 막히면 에러 메시지를 복사해서 AI에게 물어보세요!
