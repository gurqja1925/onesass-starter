'use client'

import { useState } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { builtInSkills, Skill } from '@/onesaas-core/skills'

export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const categories = [
    { value: 'all', label: '전체', icon: '📚' },
    { value: 'design', label: '디자인', icon: '🎨' },
    { value: 'development', label: '개발', icon: '💻' },
    { value: 'testing', label: '테스팅', icon: '🧪' },
    { value: 'documentation', label: '문서', icon: '📝' },
    { value: 'deployment', label: '배포', icon: '🚀' },
  ]

  const filteredSkills = filter === 'all'
    ? builtInSkills
    : builtInSkills.filter(s => s.metadata.category === filter)

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat?.icon || '📦'
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            스킬 가이드
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            OneSaaS에 통합된 스킬들을 확인하고 활용하세요
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === cat.value ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: filter === cat.value ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 스킬 목록 */}
          <div className="lg:col-span-1 space-y-3">
            {filteredSkills.map(skill => (
              <button
                key={skill.metadata.id}
                onClick={() => setSelectedSkill(skill)}
                className="w-full text-left p-4 rounded-lg transition-all hover:scale-102"
                style={{
                  background: selectedSkill?.metadata.id === skill.metadata.id
                    ? 'var(--color-accent)'
                    : 'var(--color-bg-secondary)',
                  color: selectedSkill?.metadata.id === skill.metadata.id
                    ? 'var(--color-bg)'
                    : 'var(--color-text)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(skill.metadata.category)}</span>
                  <div>
                    <p className="font-medium">{skill.metadata.nameKo}</p>
                    <p
                      className="text-xs"
                      style={{
                        color: selectedSkill?.metadata.id === skill.metadata.id
                          ? 'rgba(255,255,255,0.7)'
                          : 'var(--color-text-secondary)',
                      }}
                    >
                      v{skill.metadata.version}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 스킬 상세 */}
          <div className="lg:col-span-2">
            {selectedSkill ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getCategoryIcon(selectedSkill.metadata.category)}</span>
                    <div>
                      <CardTitle>{selectedSkill.metadata.nameKo}</CardTitle>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {selectedSkill.metadata.name} • v{selectedSkill.metadata.version}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 설명 */}
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      설명
                    </h4>
                    <p style={{ color: 'var(--color-text)' }}>
                      {selectedSkill.metadata.description}
                    </p>
                  </div>

                  {/* 키워드 */}
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      키워드
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedSkill.metadata.keywords.map(keyword => (
                        <span
                          key={keyword}
                          className="px-2 py-1 rounded text-xs"
                          style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 인스트럭션 */}
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      사용 가이드
                    </h4>
                    <div
                      className="p-4 rounded-lg overflow-auto max-h-96"
                      style={{ background: 'var(--color-bg)' }}
                    >
                      <pre
                        className="text-sm whitespace-pre-wrap"
                        style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono, monospace)' }}
                      >
                        {selectedSkill.instructions}
                      </pre>
                    </div>
                  </div>

                  {/* 리소스 */}
                  {selectedSkill.resources && (
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        관련 파일
                      </h4>
                      <div className="space-y-2">
                        {selectedSkill.resources.references?.map(ref => (
                          <div
                            key={ref}
                            className="p-2 rounded text-sm font-mono"
                            style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
                          >
                            📄 {ref}
                          </div>
                        ))}
                        {selectedSkill.resources.scripts?.map(script => (
                          <div
                            key={script}
                            className="p-2 rounded text-sm font-mono"
                            style={{ background: 'var(--color-bg)', color: '#10b981' }}
                          >
                            📜 {script}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <span className="text-6xl mb-4 block">📚</span>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    스킬을 선택하세요
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    왼쪽 목록에서 스킬을 선택하면 상세 정보를 확인할 수 있습니다
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 스킬 통계 */}
        <div className="grid md:grid-cols-5 gap-4">
          {categories.slice(1).map(cat => {
            const count = builtInSkills.filter(s => s.metadata.category === cat.value).length
            return (
              <Card key={cat.value}>
                <CardContent className="text-center py-4">
                  <span className="text-3xl block mb-2">{cat.icon}</span>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{count}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{cat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}
