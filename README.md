# OneSaaS Starter Kit

SaaS 프로젝트를 빠르게 시작할 수 있는 스타터 킷입니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/johunsang/onesass-starter&env=DATABASE_URL,DIRECT_URL,OPENAI_API_KEY&envDescription=Supabase%20DB%20URL%20and%20AI%20API%20Keys&project-name=my-saas&repository-name=my-saas)

## 원클릭 배포

위 버튼을 클릭하면:
1. GitHub 저장소 자동 생성
2. Vercel 프로젝트 자동 생성
3. 환경변수 설정 화면으로 이동
4. 배포 완료!

## 기술 스택

- **Next.js 14** - App Router
- **Tailwind CSS** - 스타일링
- **Supabase** - PostgreSQL 데이터베이스
- **Prisma** - ORM
- **Vercel AI SDK** - OpenAI, Anthropic, Google
- **Claude Code + MCP** - AI 개발 도구

## 로컬 개발

```bash
git clone https://github.com/johunsang/onesass-starter.git my-app
cd my-app
pnpm install
pnpm setup    # 자동 설정 마법사
pnpm dev
```

## 환경변수

```env
# Supabase
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# AI (선택)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 빌드 |
| `pnpm setup` | 자동 설정 |
| `pnpm db:push` | DB 스키마 적용 |

## 라이선스

MIT
