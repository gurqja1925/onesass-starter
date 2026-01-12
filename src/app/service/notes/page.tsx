'use client'

import { DashboardLayout } from '@/components/layouts/DashboardLayout'

export default function NotesPage() {
  return (
    <DashboardLayout title="노트">
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">📝</span>
          <h2 className="text-2xl font-bold mb-4">노트 페이지</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            여기에 노트 기능을 구현하세요
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
