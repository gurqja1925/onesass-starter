'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

interface Note {
  id: string
  title: string
  content: string
  color: string
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: '프로젝트 아이디어',
      content: '새로운 SaaS 서비스 아이디어:\n\n1. AI 기반 콘텐츠 생성기\n2. 소셜 미디어 자동화 도구\n3. 팀 협업 플랫폼',
      color: '#fef3c7',
      isPinned: true,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      title: '회의 노트',
      content: '오늘 회의 내용:\n- 마케팅 전략 논의\n- Q1 목표 설정\n- 신규 기능 우선순위 결정',
      color: '#dbeafe',
      isPinned: true,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      title: '읽을 책 목록',
      content: '- 린 스타트업\n- 제로 투 원\n- 좋은 전략 나쁜 전략\n- 스프린트',
      color: '#dcfce7',
      isPinned: false,
      createdAt: new Date(Date.now() - 259200000),
      updatedAt: new Date(Date.now() - 172800000),
    },
    {
      id: '4',
      title: '주간 할 일',
      content: '[ ] 블로그 글 작성\n[ ] 코드 리뷰\n[ ] 미팅 준비\n[x] 이메일 정리',
      color: '#fce7f3',
      isPinned: false,
      createdAt: new Date(Date.now() - 345600000),
      updatedAt: new Date(Date.now() - 259200000),
    },
  ])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const colors = ['#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3', '#e9d5ff', '#fef2f2']

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned)
  const otherNotes = filteredNotes.filter((n) => !n.isPinned)

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '새 노트',
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes((prev) => [newNote, ...prev])
    setSelectedNote(newNote)
    setEditTitle(newNote.title)
    setEditContent(newNote.content)
    setIsEditing(true)
  }

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    setEditTitle(note.title)
    setEditContent(note.content)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (!selectedNote) return
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNote.id
          ? { ...n, title: editTitle, content: editContent, updatedAt: new Date() }
          : n
      )
    )
    setSelectedNote({ ...selectedNote, title: editTitle, content: editContent })
    setIsEditing(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('이 노트를 삭제하시겠습니까?')) return
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
  }

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    )
  }

  const handleChangeColor = (id: string, color: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, color } : n))
    )
  }

  return (
    <DashboardLayout title="노트">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">노트</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              아이디어와 메모를 정리하세요
            </p>
          </div>
          <button
            onClick={handleNewNote}
            className="px-6 py-3 rounded-xl font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            + 새 노트
          </button>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="노트 검색..."
            className="w-full px-4 py-3 rounded-xl"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 노트 목록 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 고정된 노트 */}
            {pinnedNotes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  📌 고정됨
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      isSelected={selectedNote?.id === note.id}
                      onSelect={() => handleSelectNote(note)}
                      onTogglePin={() => handleTogglePin(note.id)}
                      onDelete={() => handleDelete(note.id)}
                      onChangeColor={(color) => handleChangeColor(note.id, color)}
                      colors={colors}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 다른 노트 */}
            <div>
              {pinnedNotes.length > 0 && (
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  기타
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isSelected={selectedNote?.id === note.id}
                    onSelect={() => handleSelectNote(note)}
                    onTogglePin={() => handleTogglePin(note.id)}
                    onDelete={() => handleDelete(note.id)}
                    onChangeColor={(color) => handleChangeColor(note.id, color)}
                    colors={colors}
                  />
                ))}
              </div>
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="text-4xl mb-4 block">📝</span>
                <p>노트가 없습니다</p>
                <button
                  onClick={handleNewNote}
                  className="mt-4 px-4 py-2 rounded-lg"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  첫 노트 만들기
                </button>
              </div>
            )}
          </div>

          {/* 노트 에디터 */}
          <div className="lg:col-span-1">
            {selectedNote ? (
              <div
                className="rounded-2xl p-6 sticky top-24"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xl font-bold mb-4 px-0 bg-transparent border-none outline-none"
                      style={{ color: 'var(--color-text)' }}
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-64 px-0 bg-transparent border-none outline-none resize-none"
                      style={{ color: 'var(--color-text)' }}
                      placeholder="내용을 입력하세요..."
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 py-2 rounded-lg font-medium"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2 rounded-lg"
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-4">{selectedNote.title}</h2>
                    <p
                      className="whitespace-pre-wrap mb-4"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {selectedNote.content || '(내용 없음)'}
                    </p>
                    <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      수정: {selectedNote.updatedAt.toLocaleDateString('ko-KR')}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2 rounded-lg font-medium"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      수정하기
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span className="text-4xl mb-4 block">👈</span>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  노트를 선택하면 여기서 편집할 수 있습니다
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function NoteCard({
  note,
  isSelected,
  onSelect,
  onTogglePin,
  onDelete,
  onChangeColor,
  colors,
}: {
  note: Note
  isSelected: boolean
  onSelect: () => void
  onTogglePin: () => void
  onDelete: () => void
  onChangeColor: (color: string) => void
  colors: string[]
}) {
  const [showColors, setShowColors] = useState(false)

  return (
    <div
      className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02]"
      style={{
        background: note.color,
        border: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
      }}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-gray-800 line-clamp-1">{note.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin() }}
            className="p-1 rounded hover:bg-black/10"
          >
            {note.isPinned ? '📌' : '📍'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowColors(!showColors) }}
            className="p-1 rounded hover:bg-black/10"
          >
            🎨
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-1 rounded hover:bg-black/10"
          >
            🗑️
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3 mb-2">{note.content || '(내용 없음)'}</p>
      <p className="text-xs text-gray-500">
        {note.updatedAt.toLocaleDateString('ko-KR')}
      </p>
      {showColors && (
        <div className="flex gap-1 mt-2 pt-2 border-t border-black/10">
          {colors.map((color) => (
            <button
              key={color}
              onClick={(e) => { e.stopPropagation(); onChangeColor(color); setShowColors(false) }}
              className="w-6 h-6 rounded-full border-2 border-white shadow"
              style={{ background: color }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
