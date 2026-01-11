'use client'

import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'

export default function CommandsGuidePage() {
  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        {/* 뒤로가기 */}
        <Link
          href="/admin/guides"
          className="inline-flex items-center gap-2 text-sm"
          style={{ color: 'var(--color-accent)' }}
        >
          ← 가이드 목록으로
        </Link>

        {/* 헤더 */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">💻</span>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                명령어 모음
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                자주 사용하는 명령어 총정리
              </p>
            </div>
          </div>
        </div>

        {/* 터미널 사용법 */}
        <Card style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
          <CardContent>
            <div className="flex items-start gap-4">
              <span className="text-4xl">💡</span>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#92400e' }}>
                  터미널이 뭐예요?
                </h3>
                <p style={{ color: '#92400e' }}>
                  터미널은 <strong>컴퓨터에게 명령을 내리는 창</strong>이에요!
                  <br />
                  글자를 입력해서 컴퓨터에게 일을 시킬 수 있어요.
                </p>
                <div className="mt-3 p-2 rounded" style={{ background: '#fef9c3' }}>
                  <p className="text-sm" style={{ color: '#92400e' }}>
                    <strong>터미널 여는 방법:</strong>
                    <br />
                    Windows: &quot;명령 프롬프트&quot; 또는 &quot;PowerShell&quot; 검색
                    <br />
                    Mac: &quot;터미널&quot; 검색
                    <br />
                    VS Code: Ctrl+` (백틱) 또는 View → Terminal
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개발 명령어 */}
        <Card>
          <CardHeader>
            <CardTitle>🛠️ 개발 명령어</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              개발할 때 자주 사용하는 명령어들이에요:
            </p>

            {/* 개발 서버 시작 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold" style={{ color: 'var(--color-text)' }}>개발 서버 시작</p>
                <span className="text-xs px-2 py-1 rounded" style={{ background: '#dcfce7', color: '#166534' }}>자주 사용</span>
              </div>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                pnpm dev
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                내 컴퓨터에서 서비스를 실행해요. http://localhost:3000에서 확인 가능!
              </p>
            </div>

            {/* 빌드 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>빌드 (배포 전 테스트)</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                pnpm build
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                배포하기 전에 문제가 없는지 확인해요
              </p>
            </div>

            {/* 패키지 설치 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>패키지 설치</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                pnpm install
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                프로젝트에 필요한 모든 도구들을 설치해요
              </p>
            </div>

            {/* 린트 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>코드 검사</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                pnpm lint
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                코드에 문제가 없는지 검사해요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 배포 명령어 */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 배포 명령어 (Vercel)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              서비스를 인터넷에 올릴 때 사용해요:
            </p>

            {/* 프로덕션 배포 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold" style={{ color: 'var(--color-text)' }}>실제 배포</p>
                <span className="text-xs px-2 py-1 rounded" style={{ background: '#dcfce7', color: '#166534' }}>자주 사용</span>
              </div>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                vercel --prod
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                실제 서비스에 배포해요. 모든 사람이 볼 수 있어요!
              </p>
            </div>

            {/* 테스트 배포 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>테스트 배포 (프리뷰)</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                vercel
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                테스트용 URL을 만들어요. 확인 후 실제 배포할 수 있어요
              </p>
            </div>

            {/* 롤백 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>이전 버전으로 돌아가기</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                vercel rollback
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                문제가 생기면 이전 버전으로 빠르게 돌아갈 수 있어요
              </p>
            </div>

            {/* 로그 확인 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>로그 확인</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                vercel logs
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                서비스에서 무슨 일이 일어나고 있는지 볼 수 있어요
              </p>
            </div>

            {/* 강제 재배포 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>캐시 삭제 후 재배포</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                vercel --force --prod
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                변경사항이 반영 안 될 때 사용해요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 데이터베이스 명령어 */}
        <Card>
          <CardHeader>
            <CardTitle>🗄️ 데이터베이스 명령어 (Prisma)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              데이터베이스를 관리할 때 사용해요:
            </p>

            {/* Prisma Studio */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold" style={{ color: 'var(--color-text)' }}>데이터 보기 (Prisma Studio)</p>
                <span className="text-xs px-2 py-1 rounded" style={{ background: '#dcfce7', color: '#166534' }}>자주 사용</span>
              </div>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                npx prisma studio
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                브라우저에서 모든 데이터를 볼 수 있는 창이 열려요!
              </p>
            </div>

            {/* 마이그레이션 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>스키마 변경 적용 (개발용)</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                npx prisma migrate dev --name &quot;설명&quot;
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                schema.prisma 파일을 수정한 후 실행해요
              </p>
            </div>

            {/* 배포 마이그레이션 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>스키마 변경 적용 (운영용)</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                npx prisma migrate deploy
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                실제 서비스 데이터베이스에 변경사항 적용
              </p>
            </div>

            {/* 클라이언트 생성 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>Prisma 클라이언트 생성</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                npx prisma generate
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                스키마 변경 후 코드에서 사용할 수 있게 해요
              </p>
            </div>

            {/* DB Push */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>빠른 스키마 적용 (테스트용)</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                npx prisma db push
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                마이그레이션 파일 없이 빠르게 적용 (개발용으로만 사용!)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Git 명령어 */}
        <Card>
          <CardHeader>
            <CardTitle>📦 Git 명령어</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              코드를 저장하고 관리할 때 사용해요:
            </p>

            {/* git add & commit & push */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold" style={{ color: 'var(--color-text)' }}>변경사항 저장하고 올리기</p>
                <span className="text-xs px-2 py-1 rounded" style={{ background: '#dcfce7', color: '#166534' }}>자주 사용</span>
              </div>
              <div className="p-3 rounded font-mono text-sm space-y-1" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                <p>git add .</p>
                <p>git commit -m &quot;변경 내용 설명&quot;</p>
                <p>git push</p>
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                코드 수정 후 이 세 명령어를 순서대로 실행하면 GitHub에 올라가요
              </p>
            </div>

            {/* git status */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>현재 상태 확인</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                git status
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                어떤 파일이 수정되었는지 볼 수 있어요
              </p>
            </div>

            {/* git pull */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>최신 코드 받기</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                git pull
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                GitHub에 있는 최신 코드를 내 컴퓨터로 가져와요
              </p>
            </div>

            {/* git log */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>변경 기록 보기</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                git log --oneline
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                지금까지 저장한 변경 기록을 볼 수 있어요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* K-Code AI 명령어 */}
        <Card>
          <CardHeader>
            <CardTitle>🤖 K-Code AI 명령어</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              AI에게 코딩을 시킬 때 사용해요:
            </p>

            {/* 기본 실행 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold" style={{ color: 'var(--color-text)' }}>AI에게 코딩 시키기</p>
                <span className="text-xs px-2 py-1 rounded" style={{ background: '#dcfce7', color: '#166534' }}>자주 사용</span>
              </div>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                pnpm kcode &quot;로그인 폼에 유효성 검사 추가해줘&quot;
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                한국어로 원하는 작업을 말하면 AI가 코드를 수정해요!
              </p>
            </div>

            {/* 대화형 모드 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>AI와 대화하며 코딩</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                pnpm kcode -i
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                터미널에서 AI와 실시간으로 대화하며 코딩할 수 있어요
              </p>
            </div>

            {/* API 키 설정 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>API 키 설정</p>
              <div className="p-3 rounded font-mono text-sm space-y-1" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                <p>pnpm kcode --key qwen YOUR_API_KEY</p>
                <p>pnpm kcode --key deepseek YOUR_API_KEY</p>
                <p>pnpm kcode --key groq YOUR_API_KEY</p>
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                AI를 사용하려면 API 키가 필요해요 (Groq은 무료 티어 제공!)
              </p>
            </div>

            {/* 모델 선택 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>다른 AI 모델 사용</p>
              <div className="p-3 rounded font-mono text-sm space-y-1" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                <p>pnpm kcode -m deepseek &quot;버그 수정해줘&quot;</p>
                <p>pnpm kcode --list</p>
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                -m 옵션으로 모델 선택, --list로 사용 가능한 모델 확인
              </p>
            </div>

            {/* 개발 모드 */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>복잡한 작업 (개발 모드)</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                pnpm kcode --dev &quot;인증 시스템 리팩토링해줘&quot;
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                복잡한 작업은 --dev 옵션으로 더 꼼꼼하게 처리해요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 환경변수 명령어 */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ 환경변수 명령어</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              환경변수를 관리할 때 사용해요:
            </p>

            {/* env pull */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>Vercel 환경변수 다운로드</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                vercel env pull
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Vercel에 설정된 환경변수를 .env 파일로 가져와요
              </p>
            </div>

            {/* env add */}
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>환경변수 추가</p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                vercel env add
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                새로운 환경변수를 Vercel에 추가해요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 한 눈에 보기 */}
        <Card>
          <CardHeader>
            <CardTitle>📋 한 눈에 보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <th className="text-left py-3 px-2" style={{ color: 'var(--color-text)' }}>하고 싶은 일</th>
                    <th className="text-left py-3 px-2" style={{ color: 'var(--color-text)' }}>명령어</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--color-text-secondary)' }}>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-3 px-2">개발 서버 시작</td>
                    <td className="py-3 px-2 font-mono" style={{ color: 'var(--color-accent)' }}>pnpm dev</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-3 px-2">빌드 테스트</td>
                    <td className="py-3 px-2 font-mono" style={{ color: 'var(--color-accent)' }}>pnpm build</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-3 px-2">실제 배포</td>
                    <td className="py-3 px-2 font-mono" style={{ color: 'var(--color-accent)' }}>vercel --prod</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-3 px-2">이전 버전으로</td>
                    <td className="py-3 px-2 font-mono" style={{ color: 'var(--color-accent)' }}>vercel rollback</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-3 px-2">데이터 보기</td>
                    <td className="py-3 px-2 font-mono" style={{ color: 'var(--color-accent)' }}>npx prisma studio</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-3 px-2">코드 저장</td>
                    <td className="py-3 px-2 font-mono" style={{ color: 'var(--color-accent)' }}>git add . && git commit -m &quot;...&quot;</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-3 px-2">GitHub에 올리기</td>
                    <td className="py-3 px-2 font-mono" style={{ color: 'var(--color-accent)' }}>git push</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-3 px-2">AI에게 코딩 시키기</td>
                    <td className="py-3 px-2 font-mono" style={{ color: 'var(--color-accent)' }}>pnpm kcode &quot;작업 내용&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2">AI와 대화형 코딩</td>
                    <td className="py-3 px-2 font-mono" style={{ color: 'var(--color-accent)' }}>pnpm kcode -i</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 다음 단계 */}
        <div className="flex justify-between">
          <Link
            href="/admin/guides/troubleshooting"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
          >
            ← 문제 해결 가이드
          </Link>
          <Link
            href="/admin/guides"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            가이드 목록으로 →
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
