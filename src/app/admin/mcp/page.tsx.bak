'use client'

import { useState } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import { Button } from '@/onesaas-core/ui/Button'
import {
  essentialMCPServers,
  getEssentialMCPServers,
  getRecommendedMCPServers,
  generateInstallScript,
  MCPServer,
} from '@/onesaas-core/mcp'

export default function MCPPage() {
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null)
  const [selectedServers, setSelectedServers] = useState<string[]>(
    getEssentialMCPServers().map(s => s.id)
  )

  const categories = [
    { value: 'core', label: '핵심', icon: '⚡' },
    { value: 'database', label: '데이터베이스', icon: '🗄️' },
    { value: 'analytics', label: '분석', icon: '📊' },
    { value: 'project', label: '프로젝트', icon: '📋' },
    { value: 'design', label: '디자인', icon: '🎨' },
    { value: 'cloud', label: '클라우드', icon: '☁️' },
  ]

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.value === category)?.icon || '📦'
  }

  const getPriorityBadge = (priority: MCPServer['priority']) => {
    const styles = {
      essential: { bg: '#ef4444', label: '필수' },
      recommended: { bg: '#f59e0b', label: '권장' },
      optional: { bg: '#6b7280', label: '선택' },
    }
    return styles[priority]
  }

  const toggleServer = (id: string) => {
    setSelectedServers(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const copyInstallScript = () => {
    const script = generateInstallScript(selectedServers)
    navigator.clipboard.writeText(script)
    alert('설치 스크립트가 클립보드에 복사되었습니다!')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            MCP 서버
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Claude Code의 기능을 확장하는 Model Context Protocol 서버들
          </p>
        </div>

        {/* 필수 MCP 안내 */}
        <Card style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)', border: 'none' }}>
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <span className="text-5xl">🔌</span>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">MCP (Model Context Protocol)</h3>
                <p className="text-gray-300 mb-4">
                  MCP는 Claude Code가 외부 시스템과 상호작용할 수 있게 해주는 프로토콜입니다.
                  데이터베이스, 브라우저, API, GitHub 등 다양한 서비스와 연동할 수 있습니다.
                </p>
                <div className="flex gap-4 text-sm">
                  <div className="px-3 py-1 rounded bg-red-500/20 text-red-300">
                    {getEssentialMCPServers().length}개 필수
                  </div>
                  <div className="px-3 py-1 rounded bg-yellow-500/20 text-yellow-300">
                    {getRecommendedMCPServers().length}개 권장
                  </div>
                  <div className="px-3 py-1 rounded bg-gray-500/20 text-gray-300">
                    {essentialMCPServers.length - getEssentialMCPServers().length - getRecommendedMCPServers().length}개 선택
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* MCP 서버 목록 */}
          <div className="lg:col-span-1 space-y-4">
            {categories.map(cat => {
              const catServers = essentialMCPServers.filter(s => s.category === cat.value)
              if (catServers.length === 0) return null

              return (
                <div key={cat.value}>
                  <h4 className="text-xs font-medium mb-2 uppercase" style={{ color: 'var(--color-text-secondary)' }}>
                    {cat.icon} {cat.label}
                  </h4>
                  <div className="space-y-2">
                    {catServers.map(server => {
                      const badge = getPriorityBadge(server.priority)
                      const isSelected = selectedServers.includes(server.id)

                      return (
                        <div
                          key={server.id}
                          className="p-3 rounded-lg transition-all cursor-pointer"
                          style={{
                            background: selectedServer?.id === server.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                          }}
                          onClick={() => setSelectedServer(server)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  toggleServer(server.id)
                                }}
                                className="w-4 h-4"
                              />
                              <span
                                className="font-medium text-sm"
                                style={{
                                  color: selectedServer?.id === server.id ? 'var(--color-bg)' : 'var(--color-text)',
                                }}
                              >
                                {server.nameKo}
                              </span>
                            </div>
                            <span
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ background: badge.bg, color: 'white' }}
                            >
                              {badge.label}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* 설치 버튼 */}
            <div className="pt-4">
              <Button onClick={copyInstallScript} className="w-full">
                📋 설치 스크립트 복사 ({selectedServers.length}개)
              </Button>
            </div>
          </div>

          {/* 서버 상세 */}
          <div className="lg:col-span-2">
            {selectedServer ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{getCategoryIcon(selectedServer.category)}</span>
                      <div>
                        <CardTitle>{selectedServer.name}</CardTitle>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {selectedServer.nameKo}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded text-sm font-medium"
                      style={{ background: getPriorityBadge(selectedServer.priority).bg, color: 'white' }}
                    >
                      {getPriorityBadge(selectedServer.priority).label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 설명 */}
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      설명
                    </h4>
                    <p style={{ color: 'var(--color-text)' }}>{selectedServer.description}</p>
                  </div>

                  {/* 기능 */}
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      주요 기능
                    </h4>
                    <ul className="space-y-1">
                      {selectedServer.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
                          <span style={{ color: 'var(--color-accent)' }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 설치 명령어 */}
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                      설치 명령어
                    </h4>
                    <div
                      className="p-4 rounded-lg overflow-x-auto"
                      style={{ background: 'var(--color-bg)' }}
                    >
                      <code
                        className="text-sm whitespace-nowrap"
                        style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}
                      >
                        {selectedServer.installCommand}
                      </code>
                    </div>
                  </div>

                  {/* 환경 변수 */}
                  {selectedServer.envVars && selectedServer.envVars.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        필요한 환경 변수
                      </h4>
                      <div className="space-y-2">
                        {selectedServer.envVars.map(env => (
                          <div
                            key={env.key}
                            className="p-3 rounded-lg"
                            style={{ background: 'var(--color-bg)' }}
                          >
                            <code
                              className="text-sm font-bold"
                              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}
                            >
                              {env.key}
                            </code>
                            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                              {env.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 문서 링크 */}
                  {selectedServer.docs && (
                    <div>
                      <a
                        href={selectedServer.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                      >
                        📖 공식 문서 보기
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <span className="text-6xl mb-4 block">🔌</span>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    MCP 서버를 선택하세요
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    왼쪽 목록에서 MCP 서버를 선택하면 상세 정보를 확인할 수 있습니다
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 통계 */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {essentialMCPServers.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>총 MCP 서버</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold" style={{ color: '#ef4444' }}>
                {getEssentialMCPServers().length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>필수</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold" style={{ color: '#f59e0b' }}>
                {getRecommendedMCPServers().length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>권장</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {selectedServers.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>선택됨</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
