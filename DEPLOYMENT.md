# OneSaaS Starter 배포 및 운영 가이드

## 배포 URL
- **Production**: https://onesass-starter.vercel.app
- **GitHub**: https://github.com/johunsang/onesass-starter

---

## 1. Vercel 배포 관리

### 1.1 자동 배포 (권장)
GitHub에 push하면 자동으로 Vercel에 배포됩니다.

```bash
# 코드 수정 후
git add .
git commit -m "feat: 새 기능 추가"
git push origin main
```

- `main` 브랜치 push → Production 배포
- PR 생성 → Preview 배포 (테스트용 URL 생성)

### 1.2 수동 배포

```bash
# Vercel CLI로 배포
vercel --prod

# 프리뷰 배포 (테스트용)
vercel
```

### 1.3 Vercel 대시보드
https://vercel.com/dashboard 에서 관리 가능:

- **Deployments**: 배포 이력 확인, 롤백
- **Logs**: 실시간 로그 확인
- **Analytics**: 트래픽, 성능 분석
- **Settings**: 도메인, 환경변수 설정

### 1.4 롤백 방법
```bash
# 이전 배포로 롤백
vercel rollback

# 특정 배포로 롤백
vercel rollback <deployment-url>
```

또는 Vercel 대시보드 → Deployments → 원하는 배포 → "Promote to Production"

---

## 2. 환경 변수 관리

### 2.1 Vercel 환경변수 설정
Vercel 대시보드 → Settings → Environment Variables

```
# 필수 환경변수
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# 소셜 로그인 (선택)
# ✅ 이메일 로그인: 별도 설정 없이 바로 사용 가능
# 🎉 OneSaaS 빌더 사용 시: OAuth 자동 설정 (Google, 카카오, GitHub)
# ⚠️ 수동 배포 시: Supabase에서 OAuth 설정 필요 (OAUTH-SETUP.md 참고)
NEXT_PUBLIC_AUTH_PROVIDERS=email,google,kakao,github

# 결제 (선택)
TOSS_API_KEY=xxx
TOSS_API_SECRET=xxx

# AI (선택)
OPENAI_API_KEY=xxx

# 운영 모드
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
```

### 2.2 환경변수 타입
- **Production**: 운영 환경 전용
- **Preview**: PR 배포 전용
- **Development**: 로컬 개발 전용

---

## 2.3 배포 전 체크리스트

배포하기 전에 다음 항목을 확인하세요:

### 환경변수 확인
- [ ] `DATABASE_URL` 설정됨
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정됨
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정됨

### 소셜 로그인 (OAuth) 확인
- [ ] 이메일 로그인 테스트 완료 (기본 제공)
- [ ] Google 로그인 사용 시:
  - [ ] Google Cloud Console에서 OAuth 클라이언트 생성
  - [ ] Supabase에 Client ID/Secret 등록
  - [ ] 프로덕션 도메인을 승인된 자바스크립트 원본에 추가
- [ ] 카카오 로그인 사용 시:
  - [ ] 카카오 Developers에서 앱 생성
  - [ ] Supabase에 REST API 키 등록
  - [ ] 프로덕션 도메인을 플랫폼 설정에 추가
- [ ] GitHub 로그인 사용 시:
  - [ ] GitHub OAuth App 생성
  - [ ] Supabase에 Client ID/Secret 등록
  - [ ] Homepage URL을 프로덕션 도메인으로 변경

**상세 가이드:** [OAUTH-SETUP.md](./OAUTH-SETUP.md) 참고

### 기타 설정 확인
- [ ] `NEXT_PUBLIC_SITE_URL`을 프로덕션 도메인으로 변경
- [ ] `NEXT_PUBLIC_ADMIN_EMAILS` 설정
- [ ] 결제 API 키 설정 (사용 시)
- [ ] SEO 메타데이터 설정
- [ ] 사업자 정보 설정 (전자상거래 시)

---

## 3. 도메인 설정

### 3.1 커스텀 도메인 연결
Vercel 대시보드 → Settings → Domains

1. 도메인 추가: `myservice.com`
2. DNS 설정 (도메인 제공업체에서):
   - A 레코드: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

### 3.2 SSL 인증서
- Vercel에서 자동으로 Let's Encrypt SSL 인증서 발급
- 커스텀 도메인 연결 시 자동 HTTPS 적용

---

## 4. 데이터베이스 관리

### 4.1 Supabase 대시보드
https://supabase.com/dashboard

- **Table Editor**: 데이터 직접 편집
- **SQL Editor**: SQL 쿼리 실행
- **Auth**: 사용자 관리
- **Storage**: 파일 저장소

### 4.2 Prisma 마이그레이션

```bash
# 스키마 변경 후 마이그레이션 생성
npx prisma migrate dev --name "변경_설명"

# 운영 DB에 마이그레이션 적용
npx prisma migrate deploy

# DB 스키마 확인
npx prisma studio
```

### 4.3 데이터 백업
Supabase 대시보드 → Settings → Database → Backups

- 자동 백업: 매일 (Pro 플랜)
- 수동 백업: pg_dump 사용

---

## 5. 모니터링 및 로깅

### 5.1 Vercel 로그 확인

```bash
# 실시간 로그 확인
vercel logs onesass-starter.vercel.app

# 특정 배포 로그
vercel logs <deployment-url>
```

### 5.2 에러 트래킹
Vercel 대시보드 → Logs → Error 필터

에러 발생 시:
1. 로그에서 에러 메시지 확인
2. 스택 트레이스로 원인 파악
3. 코드 수정 후 재배포

### 5.3 성능 모니터링
Vercel 대시보드 → Analytics

- Web Vitals (LCP, FID, CLS)
- Real User Monitoring
- 페이지별 로딩 시간

---

## 6. 보안 관리

### 6.1 환경변수 보안
- 절대 `.env` 파일을 Git에 커밋하지 마세요
- Vercel 환경변수 사용
- 민감한 키는 서버 사이드에서만 사용

### 6.2 API 보안 (적용됨)
- 모든 관리자 API: `requireAdmin` 인증
- Rate Limiting: 분당 요청 제한
- 결제 API: 금액 검증, 중복 방지

### 6.3 접근 제어
- 관리자 이메일: `NEXT_PUBLIC_ADMIN_EMAILS`에 설정
- 데모 모드: `NEXT_PUBLIC_DEMO_MODE=true`로 테스트

---

## 7. 업데이트 및 유지보수

### 7.1 의존성 업데이트

```bash
# 업데이트 확인
pnpm outdated

# 패치 업데이트 (안전)
pnpm update

# 메이저 업데이트 (주의 필요)
pnpm update --latest
```

### 7.2 Next.js 업데이트
```bash
pnpm add next@latest react@latest react-dom@latest
```

### 7.3 정기 점검 체크리스트
- [ ] 보안 업데이트 확인 (npm audit)
- [ ] 의존성 업데이트
- [ ] 데이터베이스 백업 확인
- [ ] 에러 로그 검토
- [ ] 성능 지표 확인
- [ ] OAuth 제공자 설정 확인 (Google, 카카오, GitHub)
- [ ] 사용자 로그인 테스트 (이메일, OAuth)

---

## 8. 트러블슈팅

### 8.1 빌드 실패
```bash
# 로컬에서 빌드 테스트
pnpm build

# 타입 체크
npx tsc --noEmit
```

### 8.2 환경변수 문제
- Vercel에 환경변수가 설정되어 있는지 확인
- `NEXT_PUBLIC_` 접두사: 클라이언트에서 사용
- 접두사 없음: 서버에서만 사용

### 8.3 DB 연결 실패
- `DATABASE_URL` 확인
- Supabase 대시보드에서 연결 풀링 URL 사용
- IP 화이트리스트 확인 (Supabase Settings → Database)

### 8.4 캐시 문제
```bash
# Vercel 캐시 삭제 후 재배포
vercel --force

# 로컬 캐시 삭제
rm -rf .next node_modules
pnpm install
pnpm build
```

---

## 9. 유용한 명령어 모음

```bash
# 배포
vercel --prod              # 프로덕션 배포
vercel                     # 프리뷰 배포
vercel rollback            # 롤백

# 로그
vercel logs                # 실시간 로그
vercel inspect <url> --logs # 배포 로그

# 환경변수
vercel env pull            # 환경변수 다운로드
vercel env add             # 환경변수 추가

# 프로젝트
vercel link                # 프로젝트 연결
vercel projects            # 프로젝트 목록

# DB
npx prisma studio          # DB GUI
npx prisma migrate deploy  # 마이그레이션 적용
npx prisma generate        # 클라이언트 생성
```

---

## 10. 연락처 및 지원

### 공식 문서
- **Vercel 문서**: https://vercel.com/docs
- **Supabase 문서**: https://supabase.com/docs
- **Next.js 문서**: https://nextjs.org/docs
- **Prisma 문서**: https://prisma.io/docs

### OneSaaS 가이드
- **OAuth 설정 가이드**: [OAUTH-SETUP.md](./OAUTH-SETUP.md)
- **개발 가이드**: [CLAUDE.md](./CLAUDE.md)
- **유지보수 가이드**: [MAINTENANCE.md](./MAINTENANCE.md)
