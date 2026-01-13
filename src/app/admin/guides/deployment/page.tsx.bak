'use client'

import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'

export default function DeploymentGuidePage() {
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
            <span className="text-5xl">🚀</span>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                배포 가이드
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Vercel로 서비스를 배포하고 관리하는 방법
              </p>
            </div>
          </div>
        </div>

        {/* 이미 배포됨 안내 */}
        <Card style={{ background: '#dcfce7', border: '2px solid #10b981' }}>
          <CardContent>
            <div className="flex items-start gap-4">
              <span className="text-4xl">✅</span>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#166534' }}>
                  이미 배포되어 있어요!
                </h3>
                <p style={{ color: '#166534' }}>
                  축하해요! 이 서비스는 <strong>이미 Vercel에 배포</strong>되어 있어요.
                  <br />
                  초기 설정도 완료된 상태라서 바로 사용할 수 있어요! 🎉
                </p>
                <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <p className="font-mono text-sm" style={{ color: '#166534' }}>
                    <strong>현재 주소:</strong> https://onesass-starter.vercel.app
                  </p>
                </div>
                <p className="mt-3 text-sm" style={{ color: '#166534' }}>
                  아래 내용은 코드를 수정한 후 <strong>다시 배포할 때</strong> 참고하세요!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 배포가 뭐예요? */}
        <Card>
          <CardHeader>
            <CardTitle>🤔 배포가 뭐예요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p style={{ color: 'var(--color-text)' }}>
                <strong>배포</strong>는 여러분이 만든 웹사이트를 <strong>전 세계 누구나</strong> 볼 수 있게 인터넷에 올리는 것이에요!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4">
                <span className="text-4xl">💻</span>
                <p className="mt-2 font-medium" style={{ color: 'var(--color-text)' }}>1. 내 컴퓨터</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  지금은 나만 볼 수 있어요
                </p>
              </div>
              <div className="text-center p-4">
                <span className="text-4xl">→</span>
              </div>
              <div className="text-center p-4">
                <span className="text-4xl">🌍</span>
                <p className="mt-2 font-medium" style={{ color: 'var(--color-text)' }}>2. 인터넷</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  전 세계가 볼 수 있어요!
                </p>
              </div>
            </div>

            <p style={{ color: 'var(--color-text-secondary)' }}>
              마치 집에서 만든 케이크를 🎂 빵집에 진열하는 것과 비슷해요!
            </p>
          </CardContent>
        </Card>

        {/* Vercel이 뭐예요? */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Vercel이 뭐예요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#000', color: '#fff' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">▲</span>
                <span className="font-bold text-xl">Vercel</span>
              </div>
              <p className="mt-2 text-sm opacity-80">
                Next.js를 만든 회사에서 운영하는 배포 서비스
              </p>
            </div>

            <p style={{ color: 'var(--color-text)' }}>
              <strong>Vercel</strong>은 웹사이트를 쉽게 배포할 수 있게 도와주는 서비스예요.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-2xl">✨</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>무료로 시작할 수 있어요</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>개인 프로젝트는 무료!</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-2xl">🔄</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>자동으로 배포해줘요</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>GitHub에 코드를 올리면 자동으로 배포!</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <span className="text-2xl">🌐</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--color-text)' }}>전 세계에서 빠르게</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>어느 나라에서 접속해도 빠르게!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 자동 배포 */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 자동 배포 (가장 쉬운 방법!)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg" style={{ background: '#dcfce7', border: '2px solid #10b981' }}>
              <p style={{ color: '#166534' }}>
                <strong>💡 가장 추천하는 방법!</strong> GitHub에 코드를 올리면 자동으로 배포됩니다.
              </p>
            </div>

            <div className="space-y-6">
              {/* 단계 1 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    코드를 수정해요
                  </h4>
                  <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    원하는 대로 코드를 수정하세요. 예: 색깔 변경, 글자 수정 등
                  </p>
                </div>
              </div>

              {/* 단계 2 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    터미널에서 이 명령어를 입력해요
                  </h4>
                  <div className="p-4 rounded-lg font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                    <p className="text-green-400"># 1. 변경사항 저장하기</p>
                    <p>git add .</p>
                    <br />
                    <p className="text-green-400"># 2. 무엇을 바꿨는지 메모하기</p>
                    <p>git commit -m &quot;내가 바꾼 내용 설명&quot;</p>
                    <br />
                    <p className="text-green-400"># 3. GitHub에 올리기</p>
                    <p>git push origin main</p>
                  </div>
                  <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    💡 &quot;내가 바꾼 내용 설명&quot; 부분에 뭘 바꿨는지 적어주세요!
                  </p>
                </div>
              </div>

              {/* 단계 3 */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    자동으로 배포돼요! 🎉
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    GitHub에 올리면 Vercel이 자동으로 감지해서 배포해줘요.
                    <br />
                    보통 <strong>1~2분</strong> 정도 걸려요.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 수동 배포 */}
        <Card>
          <CardHeader>
            <CardTitle>🖐️ 수동 배포 (직접 하고 싶을 때)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              자동 배포 말고 직접 배포하고 싶다면 이 명령어를 사용하세요:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  🚀 운영 서버에 배포하기
                </p>
                <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                  vercel --prod
                </div>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  실제 사용자들이 보는 사이트에 배포돼요
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  🧪 테스트 서버에 배포하기
                </p>
                <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                  vercel
                </div>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  테스트용 URL이 생겨요. 실제 사이트에는 영향 없어요!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 롤백 */}
        <Card>
          <CardHeader>
            <CardTitle>⏪ 이전 버전으로 돌아가기 (롤백)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg" style={{ background: '#fef2f2', border: '2px solid #ef4444' }}>
              <p style={{ color: '#991b1b' }}>
                <strong>😱 앗! 배포했는데 문제가 생겼어요!</strong>
                <br />
                걱정 마세요. 이전 버전으로 쉽게 돌아갈 수 있어요.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  방법 1: 명령어로 롤백
                </p>
                <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                  vercel rollback
                </div>
              </div>

              <div>
                <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  방법 2: Vercel 대시보드에서 롤백 (더 쉬움!)
                </p>
                <ol className="list-decimal list-inside space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <li><a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>vercel.com/dashboard</a> 접속</li>
                  <li>프로젝트 클릭</li>
                  <li>&quot;Deployments&quot; 탭 클릭</li>
                  <li>돌아가고 싶은 배포의 &quot;...&quot; 클릭</li>
                  <li>&quot;Promote to Production&quot; 클릭</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 배포 상태 확인 */}
        <Card>
          <CardHeader>
            <CardTitle>👀 배포 상태 확인하기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              배포가 잘 됐는지 확인하는 방법이에요:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg text-center" style={{ background: '#dcfce7' }}>
                <span className="text-3xl">🟢</span>
                <p className="font-medium mt-2" style={{ color: '#166534' }}>Ready</p>
                <p className="text-sm" style={{ color: '#166534' }}>배포 성공!</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ background: '#fef3c7' }}>
                <span className="text-3xl">🟡</span>
                <p className="font-medium mt-2" style={{ color: '#92400e' }}>Building</p>
                <p className="text-sm" style={{ color: '#92400e' }}>배포 중...</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ background: '#fef2f2' }}>
                <span className="text-3xl">🔴</span>
                <p className="font-medium mt-2" style={{ color: '#991b1b' }}>Error</p>
                <p className="text-sm" style={{ color: '#991b1b' }}>문제 발생!</p>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                로그 확인하기
              </p>
              <div className="p-3 rounded font-mono text-sm" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
                vercel logs
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                무슨 일이 일어나고 있는지 실시간으로 볼 수 있어요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 현재 배포 정보 */}
        <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent>
            <div className="text-white">
              <h3 className="text-xl font-bold mb-4">🌐 현재 배포된 사이트</h3>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <p className="font-mono text-lg">https://onesass-starter.vercel.app</p>
              </div>
              <p className="mt-4 opacity-80">
                위 주소로 접속하면 여러분의 서비스를 볼 수 있어요!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 다음 단계 */}
        <div className="flex justify-between">
          <Link
            href="/admin/guides"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
          >
            ← 가이드 목록
          </Link>
          <Link
            href="/admin/guides/database"
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            다음: 데이터베이스 가이드 →
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
