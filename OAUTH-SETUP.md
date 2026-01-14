# OAuth 설정 가이드

> OneSaaS에서 Google, 카카오, GitHub 소셜 로그인을 설정하는 방법

## 목차

- [시작하기 전에](#시작하기-전에)
- [1. Google OAuth 설정](#1-google-oauth-설정)
- [2. 카카오 OAuth 설정](#2-카카오-oauth-설정)
- [3. GitHub OAuth 설정](#3-github-oauth-설정)
- [4. Supabase에 OAuth 연동](#4-supabase에-oauth-연동)
- [5. 환경 변수 설정 (선택)](#5-환경-변수-설정-선택)
- [6. 로그인 제공자 활성화/비활성화](#6-로그인-제공자-활성화비활성화)
- [7. 문제 해결](#7-문제-해결)

---

## 시작하기 전에

### 필요한 정보

OAuth 설정을 위해 다음 정보가 필요합니다:

1. **Supabase 프로젝트 URL**
   - `.env` 파일의 `NEXT_PUBLIC_SUPABASE_URL` 값
   - 예: `https://xxx.supabase.co`

2. **Supabase Callback URL**
   - 형식: `https://YOUR_SUPABASE_URL/auth/v1/callback`
   - 예: `https://xxx.supabase.co/auth/v1/callback`

### 중요 사항

- 이메일 로그인은 **별도 설정 없이 바로 사용 가능**합니다
- OAuth는 Supabase에서 제공자별로 활성화해야 합니다
- 각 OAuth 제공자는 독립적으로 설정 가능합니다 (전부 안 해도 됨)
- **처음 가입한 사용자는 자동으로 관리자 권한을 받습니다**

---

## 1. Google OAuth 설정

Google 로그인을 사용하려면 Google Cloud Console에서 OAuth 클라이언트를 생성해야 합니다.

### 1.1 Google Cloud Console 프로젝트 생성

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com 방문
   - Google 계정으로 로그인

2. **새 프로젝트 생성**
   - 상단의 프로젝트 선택 드롭다운 클릭
   - "새 프로젝트" 클릭
   - 프로젝트 이름 입력 (예: "OneSaaS")
   - "만들기" 클릭

### 1.2 OAuth 동의 화면 구성

1. **OAuth 동의 화면 메뉴로 이동**
   - 좌측 메뉴 → "API 및 서비스" → "OAuth 동의 화면"

2. **User Type 선택**
   - "외부" 선택 (일반 사용자용)
   - "만들기" 클릭

3. **앱 정보 입력**
   ```
   앱 이름: OneSaaS (또는 서비스 이름)
   사용자 지원 이메일: 본인 이메일
   앱 로고: (선택사항)
   앱 도메인: (선택사항)
   개발자 연락처 정보: 본인 이메일
   ```

4. **범위 추가 (Scopes)**
   - "범위 추가 또는 삭제" 클릭
   - 다음 범위 선택:
     - `userinfo.email`
     - `userinfo.profile`
   - "저장 후 계속" 클릭

5. **테스트 사용자 추가 (개발 중)**
   - "테스트 사용자 추가" 클릭
   - 테스트할 Google 계정 이메일 입력
   - "저장 후 계속" 클릭

6. **요약 확인**
   - "대시보드로 돌아가기" 클릭

### 1.3 OAuth 클라이언트 ID 생성

1. **사용자 인증 정보 메뉴로 이동**
   - 좌측 메뉴 → "API 및 서비스" → "사용자 인증 정보"

2. **OAuth 클라이언트 ID 만들기**
   - "사용자 인증 정보 만들기" → "OAuth 클라이언트 ID" 클릭

3. **애플리케이션 유형 선택**
   - "웹 애플리케이션" 선택

4. **클라이언트 정보 입력**
   ```
   이름: OneSaaS Web Client

   승인된 자바스크립트 원본:
   - http://localhost:3000 (로컬 개발용)
   - https://your-domain.com (프로덕션용)

   승인된 리디렉션 URI:
   - https://YOUR_SUPABASE_URL/auth/v1/callback

   예시:
   - https://fiqfptaopumstvtxasjm.supabase.co/auth/v1/callback
   ```

5. **클라이언트 ID 및 Secret 복사**
   - "만들기" 클릭 후 표시되는 팝업에서:
     - **Client ID** 복사 (예: `123456789-abc.apps.googleusercontent.com`)
     - **Client Secret** 복사 (예: `GOCSPX-xxxxx`)
   - 안전한 곳에 보관

### 1.4 Supabase에 Google OAuth 연동

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 방문
   - 프로젝트 선택

2. **Authentication 설정**
   - 좌측 메뉴 → "Authentication" → "Providers"

3. **Google 제공자 활성화**
   - "Google" 찾기
   - "Enabled" 토글 ON

4. **Google OAuth 정보 입력**
   ```
   Client ID: (1.3에서 복사한 Client ID)
   Client Secret: (1.3에서 복사한 Client Secret)
   ```

5. **저장**
   - "Save" 클릭

### 1.5 테스트

1. 로컬 개발 서버 실행:
   ```bash
   pnpm dev
   ```

2. http://localhost:3000/auth/signin 접속

3. "Google로 로그인" 버튼 클릭

4. Google 계정 선택 및 권한 승인

5. 로그인 성공 확인

---

## 2. 카카오 OAuth 설정

카카오 로그인을 사용하려면 카카오 Developers에서 애플리케이션을 생성해야 합니다.

### 2.1 카카오 Developers 애플리케이션 생성

1. **카카오 Developers 접속**
   - https://developers.kakao.com 방문
   - 카카오 계정으로 로그인

2. **내 애플리케이션 메뉴로 이동**
   - 상단 메뉴 → "내 애플리케이션"
   - "애플리케이션 추가하기" 클릭

3. **애플리케이션 정보 입력**
   ```
   앱 이름: OneSaaS (또는 서비스 이름)
   사업자명: 개인 또는 회사명
   카테고리: 서비스에 맞게 선택
   ```

4. **저장** 클릭

### 2.2 플랫폼 설정

1. **앱 설정 → 플랫폼 메뉴**
   - 좌측 메뉴 → "앱 설정" → "플랫폼"

2. **Web 플랫폼 등록**
   - "Web 플랫폼 등록" 클릭
   - 사이트 도메인 입력:
     ```
     http://localhost:3000 (로컬 개발용)
     https://your-domain.com (프로덕션용)
     ```

### 2.3 카카오 로그인 활성화

1. **제품 설정 → 카카오 로그인 메뉴**
   - 좌측 메뉴 → "제품 설정" → "카카오 로그인"

2. **카카오 로그인 활성화**
   - "카카오 로그인 활성화" 상태를 ON

3. **Redirect URI 등록**
   - "Redirect URI" 섹션에서 "Redirect URI 등록" 클릭
   - 다음 URI 등록:
     ```
     https://YOUR_SUPABASE_URL/auth/v1/callback

     예시:
     https://fiqfptaopumstvtxasjm.supabase.co/auth/v1/callback
     ```

### 2.4 동의 항목 설정

1. **제품 설정 → 카카오 로그인 → 동의 항목**
   - "동의 항목" 탭 클릭

2. **필수 동의 항목 설정**
   - 다음 항목을 필수 동의로 설정:
     - 닉네임
     - 프로필 사진 (선택사항)
     - 카카오계정(이메일)

3. **저장**

### 2.5 앱 키 확인

1. **앱 설정 → 앱 키 메뉴**
   - 좌측 메뉴 → "앱 설정" → "앱 키"

2. **REST API 키 복사**
   - "REST API 키" 값 복사 (예: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
   - 안전한 곳에 보관

### 2.6 Supabase에 카카오 OAuth 연동

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 방문
   - 프로젝트 선택

2. **Authentication 설정**
   - 좌측 메뉴 → "Authentication" → "Providers"

3. **Kakao 제공자 활성화**
   - "Kakao" 찾기
   - "Enabled" 토글 ON

4. **Kakao OAuth 정보 입력**
   ```
   Client ID: (2.5에서 복사한 REST API 키)
   Client Secret: (비워둠 - 카카오는 Secret 불필요)
   ```

5. **저장**
   - "Save" 클릭

### 2.7 테스트

1. 로컬 개발 서버 실행:
   ```bash
   pnpm dev
   ```

2. http://localhost:3000/auth/signin 접속

3. "카카오로 로그인" 버튼 클릭

4. 카카오 계정 로그인 및 권한 동의

5. 로그인 성공 확인

---

## 3. GitHub OAuth 설정

GitHub 로그인을 사용하려면 GitHub OAuth App을 생성해야 합니다.

### 3.1 GitHub OAuth App 생성

1. **GitHub Settings 접속**
   - https://github.com/settings/developers 방문
   - GitHub 계정으로 로그인

2. **OAuth Apps 메뉴**
   - 좌측 메뉴 → "Developer settings" → "OAuth Apps"
   - "New OAuth App" 클릭

3. **OAuth App 정보 입력**
   ```
   Application name: OneSaaS (또는 서비스 이름)
   Homepage URL: http://localhost:3000 (로컬 개발용)
                 https://your-domain.com (프로덕션용)
   Application description: (선택사항) 서비스 설명
   Authorization callback URL: https://YOUR_SUPABASE_URL/auth/v1/callback

   예시:
   https://fiqfptaopumstvtxasjm.supabase.co/auth/v1/callback
   ```

4. **Register application** 클릭

### 3.2 Client Secret 생성

1. **OAuth App 상세 페이지**
   - 생성된 OAuth App 클릭

2. **Client ID 확인**
   - "Client ID" 값 복사 (예: `Iv1.a1b2c3d4e5f6g7h8`)
   - 안전한 곳에 보관

3. **Client Secret 생성**
   - "Generate a new client secret" 클릭
   - 표시되는 Secret 값 복사 (예: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`)
   - **주의: Secret은 한 번만 표시됩니다! 반드시 복사해두세요**

### 3.3 Supabase에 GitHub OAuth 연동

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 방문
   - 프로젝트 선택

2. **Authentication 설정**
   - 좌측 메뉴 → "Authentication" → "Providers"

3. **GitHub 제공자 활성화**
   - "GitHub" 찾기
   - "Enabled" 토글 ON

4. **GitHub OAuth 정보 입력**
   ```
   Client ID: (3.2에서 복사한 Client ID)
   Client Secret: (3.2에서 복사한 Client Secret)
   ```

5. **저장**
   - "Save" 클릭

### 3.4 테스트

1. 로컬 개발 서버 실행:
   ```bash
   pnpm dev
   ```

2. http://localhost:3000/auth/signin 접속

3. "GitHub으로 로그인" 버튼 클릭

4. GitHub 계정 권한 승인

5. 로그인 성공 확인

---

## 4. Supabase에 OAuth 연동

위 섹션에서 각 제공자별로 Supabase 연동을 했다면, 이 섹션은 건너뛰어도 됩니다.

### 4.1 Supabase Dashboard 접속

1. https://supabase.com/dashboard 접속
2. 본인 프로젝트 선택
3. 좌측 메뉴 → "Authentication" → "Providers"

### 4.2 OAuth 제공자별 설정 확인

각 제공자를 클릭하면 다음 정보를 입력해야 합니다:

| 제공자 | Client ID | Client Secret | 비고 |
|--------|-----------|---------------|------|
| Google | Google Cloud Console에서 발급 | Google Cloud Console에서 발급 | 필수 |
| Kakao  | 카카오 REST API 키 | 불필요 (비워둠) | Client ID만 입력 |
| GitHub | GitHub OAuth App Client ID | GitHub OAuth App Secret | 필수 |

### 4.3 Redirect URL 확인

모든 OAuth 제공자는 동일한 Redirect URL을 사용합니다:
```
https://YOUR_SUPABASE_URL/auth/v1/callback
```

예시:
```
https://fiqfptaopumstvtxasjm.supabase.co/auth/v1/callback
```

---

## 5. 환경 변수 설정 (선택)

### 5.1 로컬 개발 환경

OAuth 설정은 Supabase에서 관리되므로, 추가 환경 변수는 **필요 없습니다**.

현재 `.env` 파일에 있는 Supabase 설정만 있으면 됩니다:

```bash
# Supabase 인증용 (Settings > API에서 확인)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

### 5.2 Vercel 배포 환경

Vercel 배포 시에도 마찬가지로 추가 환경 변수는 **필요 없습니다**.

`vercel env pull` 명령어로 가져온 환경 변수면 충분합니다.

### 5.3 프로덕션 배포 체크리스트

배포하기 전에 확인해야 할 사항:

1. **OAuth 제공자 설정 확인**
   - [ ] Supabase에서 원하는 OAuth 제공자 활성화
   - [ ] 각 OAuth 제공자에서 Callback URL 등록

2. **도메인 설정 확인**
   - [ ] Google: 승인된 자바스크립트 원본에 프로덕션 도메인 추가
   - [ ] 카카오: 플랫폼 설정에 프로덕션 도메인 추가
   - [ ] GitHub: Homepage URL을 프로덕션 도메인으로 변경

3. **Supabase 설정 확인**
   - [ ] Site URL을 프로덕션 도메인으로 변경
   - [ ] Redirect URLs에 프로덕션 도메인 추가

---

## 6. 로그인 제공자 활성화/비활성화

### 6.1 onesaas.json 파일 수정

프로젝트에서 사용할 로그인 제공자를 선택할 수 있습니다.

`onesaas.json` 파일 편집:

```json
{
  "features": {
    "auth": {
      "enabled": true,
      "providers": [
        "email",    // 이메일/비밀번호 로그인
        "google",   // Google 로그인
        "kakao",    // 카카오 로그인
        "github"    // GitHub 로그인
      ]
    }
  }
}
```

### 6.2 제공자 추가/제거

원하지 않는 제공자는 배열에서 제거하면 됩니다:

```json
// 예: 이메일과 Google만 사용
{
  "features": {
    "auth": {
      "enabled": true,
      "providers": ["email", "google"]
    }
  }
}
```

### 6.3 변경 사항 적용

1. 파일 수정 후 저장
2. 개발 서버 재시작:
   ```bash
   pnpm dev
   ```

---

## 7. 문제 해결

### 7.1 "OAuth provider not found" 오류

**원인:** Supabase에서 해당 OAuth 제공자가 활성화되지 않음

**해결:**
1. Supabase Dashboard → Authentication → Providers
2. 해당 제공자 "Enabled" 토글 ON
3. Client ID/Secret 올바르게 입력했는지 확인

### 7.2 "Redirect URI mismatch" 오류

**원인:** OAuth 제공자에 등록한 Redirect URI와 실제 URI가 다름

**해결:**
1. OAuth 제공자 설정에서 Redirect URI 확인
2. 다음 형식이 맞는지 확인:
   ```
   https://YOUR_SUPABASE_URL/auth/v1/callback
   ```
3. URI가 정확히 일치하는지 확인 (끝에 `/` 없어야 함)

### 7.3 Google OAuth "403: access_denied" 오류

**원인:** Google OAuth 동의 화면이 "테스트" 모드이고, 테스트 사용자에 추가되지 않음

**해결:**
1. Google Cloud Console → OAuth 동의 화면
2. "테스트 사용자" 섹션에 로그인할 Google 계정 추가
3. 또는 "게시 상태"를 "프로덕션"으로 변경 (검토 필요)

### 7.4 카카오 "invalid_client" 오류

**원인:** REST API 키가 잘못 입력되었거나, Redirect URI가 등록되지 않음

**해결:**
1. 카카오 Developers → 앱 설정 → 앱 키
2. REST API 키 다시 복사
3. 제품 설정 → 카카오 로그인 → Redirect URI 확인
4. Supabase에 키 다시 입력

### 7.5 GitHub "redirect_uri_mismatch" 오류

**원인:** GitHub OAuth App의 Callback URL이 잘못됨

**해결:**
1. GitHub Settings → Developer settings → OAuth Apps
2. 해당 OAuth App 클릭
3. "Authorization callback URL" 확인 및 수정:
   ```
   https://YOUR_SUPABASE_URL/auth/v1/callback
   ```

### 7.6 로컬에서는 되는데 배포 후 안 됨

**원인:** 프로덕션 도메인이 OAuth 제공자에 등록되지 않음

**해결:**
1. **Google:** 승인된 자바스크립트 원본에 프로덕션 도메인 추가
2. **카카오:** 플랫폼 설정에 프로덕션 도메인 추가
3. **GitHub:** Homepage URL을 프로덕션 도메인으로 변경
4. **Supabase:** Settings → Authentication → Site URL을 프로덕션 도메인으로 변경

### 7.7 "Email not verified" 오류

**원인:** Supabase에서 이메일 인증을 요구하도록 설정됨

**해결:**
1. Supabase Dashboard → Authentication → Settings
2. "Confirm email" 옵션 확인
3. 필요시 OFF로 변경 (개발 중)
4. 프로덕션에서는 ON 권장

### 7.8 로그인 버튼이 표시되지 않음

**원인:** `onesaas.json`에 해당 제공자가 포함되지 않음

**해결:**
1. `onesaas.json` 파일 열기
2. `features.auth.providers` 배열 확인
3. 원하는 제공자 추가:
   ```json
   "providers": ["email", "google", "kakao", "github"]
   ```
4. 개발 서버 재시작

### 7.9 여러 OAuth 제공자로 로그인했는데 계정이 분리됨

**설명:** 이는 정상 동작입니다. Supabase는 각 OAuth 제공자를 별도 계정으로 취급합니다.

**해결:**
- 동일한 이메일이더라도 OAuth 제공자가 다르면 별도 계정
- 계정 통합이 필요하면 커스텀 로직 구현 필요

---

## 추가 리소스

### 공식 문서
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Google OAuth 문서](https://developers.google.com/identity/protocols/oauth2)
- [카카오 로그인 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [GitHub OAuth 문서](https://docs.github.com/en/apps/oauth-apps)

### OneSaaS 관련 문서
- [README.md](./README.md) - 프로젝트 소개
- [CLAUDE.md](./CLAUDE.md) - 개발 가이드
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 배포 가이드

---

## 도움이 필요하신가요?

문제가 해결되지 않거나 추가 도움이 필요하시면:

1. GitHub Issues: https://github.com/johunsang/onesaas-starter/issues
2. Supabase Discord: https://discord.supabase.com
3. OneSaaS 커뮤니티: https://onesaas.kr

---

**마지막 업데이트:** 2026-01-13
