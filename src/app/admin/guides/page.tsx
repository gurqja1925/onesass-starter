'use client'

import Link from 'next/link'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent } from '@/onesaas-core/ui/Card'

const guides = [
  {
    id: 'deployment',
    title: '배포 가이드',
    description: 'Vercel로 서비스를 배포하고 관리하는 방법',
    icon: '🚀',
    color: '#3b82f6',
  },
  {
    id: 'database',
    title: '데이터베이스 가이드',
    description: 'Supabase와 Prisma로 데이터를 관리하는 방법',
    icon: '🗄️',
    color: '#10b981',
  },
  {
    id: 'environment',
    title: '환경변수 가이드',
    description: '환경변수 설정과 보안 관리 방법',
    icon: '⚙️',
    color: '#f59e0b',
  },
  {
    id: 'security',
    title: '보안 가이드',
    description: '서비스 보안을 강화하는 방법',
    icon: '🔒',
    color: '#ef4444',
  },
  {
    id: 'troubleshooting',
    title: '문제 해결 가이드',
    description: '자주 발생하는 문제와 해결 방법',
    icon: '🔧',
    color: '#8b5cf6',
  },
  {
    id: 'commands',
    title: '명령어 모음',
    description: '자주 사용하는 명령어 총정리',
    icon: '💻',
    color: '#06b6d4',
  },
]

export default function GuidesPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            📚 운영 가이드
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            초보자도 쉽게 따라할 수 있는 운영 가이드입니다
          </p>
        </div>

        {/* 안내 박스 */}
        <Card style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
          <CardContent>
            <div className="flex items-start gap-4">
              <span className="text-4xl">💡</span>
              <div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#92400e' }}>
                  처음이신가요?
                </h3>
                <p style={{ color: '#92400e' }}>
                  걱정하지 마세요! 이 가이드는 <strong>컴퓨터를 잘 모르는 분들도</strong> 쉽게 따라할 수 있도록 만들었습니다.
                  <br />
                  각 가이드에는 그림과 함께 <strong>하나하나 자세한 설명</strong>이 있어요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 가이드 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/admin/guides/${guide.id}`}>
              <Card hover className="h-full">
                <CardContent>
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
                    style={{ background: `${guide.color}20` }}
                  >
                    {guide.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    {guide.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {guide.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2" style={{ color: guide.color }}>
                    <span className="text-sm font-medium">자세히 보기</span>
                    <span>→</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* 도움말 */}
        <Card>
          <CardContent>
            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-text)' }}>
              🆘 도움이 더 필요하신가요?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://vercel.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg hover:opacity-80 transition-opacity"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-medium" style={{ color: 'var(--color-text)' }}>Vercel 공식 문서</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>배포 관련 자세한 정보</p>
              </a>
              <a
                href="https://supabase.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg hover:opacity-80 transition-opacity"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-medium" style={{ color: 'var(--color-text)' }}>Supabase 공식 문서</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>데이터베이스 관련 정보</p>
              </a>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg hover:opacity-80 transition-opacity"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                <p className="font-medium" style={{ color: 'var(--color-text)' }}>Next.js 공식 문서</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>프레임워크 관련 정보</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
