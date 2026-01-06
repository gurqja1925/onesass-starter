'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  type: '블로그' | '공지사항' | '페이지' | 'FAQ'
  status: '게시됨' | '임시저장' | '예약됨'
  author: string
  date: string
  views: number
}

const mockContents: ContentItem[] = [
  { id: '1', title: '서비스 이용 가이드', type: '블로그', status: '게시됨', author: '관리자', date: '2024-01-15', views: 1234 },
  { id: '2', title: '1월 업데이트 안내', type: '공지사항', status: '게시됨', author: '관리자', date: '2024-01-14', views: 892 },
  { id: '3', title: '자주 묻는 질문 모음', type: 'FAQ', status: '게시됨', author: '관리자', date: '2024-01-13', views: 567 },
  { id: '4', title: '새로운 기능 소개', type: '블로그', status: '임시저장', author: '작성자1', date: '2024-01-12', views: 0 },
  { id: '5', title: '2월 이벤트 예고', type: '공지사항', status: '예약됨', author: '관리자', date: '2024-02-01', views: 0 },
]

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('전체')

  const types = ['전체', '블로그', '공지사항', '페이지', 'FAQ']

  const filteredContents = mockContents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === '전체' || content.type === selectedType
    return matchesSearch && matchesType
  })

  const statusColors: Record<string, string> = {
    '게시됨': 'bg-green-500/20 text-green-400',
    '임시저장': 'bg-yellow-500/20 text-yellow-400',
    '예약됨': 'bg-blue-500/20 text-blue-400',
  }

  return (
    <DashboardLayout title="콘텐츠">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">콘텐츠 관리</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>블로그, 공지사항, FAQ 등 콘텐츠를 관리하세요</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            <Plus className="w-5 h-5" />
            새 콘텐츠
          </button>
        </div>

        {/* Filters */}
        <div
          className="p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              placeholder="콘텐츠 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg outline-none"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            />
          </div>
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="px-3 py-1 rounded-full text-sm transition-all"
                style={{
                  background: selectedType === type ? 'var(--color-accent)' : 'var(--color-bg)',
                  color: selectedType === type ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th className="text-left p-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>제목</th>
                <th className="text-left p-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>유형</th>
                <th className="text-left p-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>상태</th>
                <th className="text-left p-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>작성자</th>
                <th className="text-left p-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>날짜</th>
                <th className="text-left p-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>조회</th>
                <th className="text-right p-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.map((content) => (
                <tr key={content.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="p-4">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{content.title}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{content.type}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[content.status]}`}>
                      {content.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{content.author}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{content.date}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{content.views.toLocaleString()}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:opacity-70 transition-opacity text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {filteredContents.length}개 콘텐츠
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              이전
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              1
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
