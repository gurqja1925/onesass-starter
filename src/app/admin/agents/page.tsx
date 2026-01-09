'use client'

import { useState } from 'react'
import { AdminLayout } from '@/onesaas-core/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/onesaas-core/ui/Card'
import {
  onesaasAgents,
  predefinedPipelines,
  availableTools,
  AgentDefinition,
  AgentPipeline,
} from '@/onesaas-core/agents'

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(null)
  const [selectedPipeline, setSelectedPipeline] = useState<AgentPipeline | null>(null)
  const [activeTab, setActiveTab] = useState<'agents' | 'pipelines' | 'tools'>('agents')

  const categories = [
    { value: 'development', label: '개발', icon: '💻' },
    { value: 'review', label: '리뷰', icon: '🔍' },
    { value: 'testing', label: '테스팅', icon: '🧪' },
    { value: 'documentation', label: '문서', icon: '📝' },
    { value: 'support', label: '지원', icon: '💬' },
    { value: 'analysis', label: '분석', icon: '📊' },
  ]

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.value === category)?.icon || '🤖'
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            AI 에이전트
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Claude Agent SDK 기반의 전문 AI 에이전트들
          </p>
        </div>

        {/* SDK 정보 배너 */}
        <Card style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid #0f3460' }}>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🤖</span>
              <div className="flex-1">
                <h3 className="font-bold text-white">Claude Agent SDK</h3>
                <p className="text-sm text-gray-400">
                  서브에이전트와 멀티에이전트 워크플로우를 지원하는 Anthropic의 공식 SDK
                </p>
              </div>
              <a
                href="https://platform.claude.com/docs/en/agent-sdk/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ background: 'white', color: '#1a1a2e' }}
              >
                문서 보기
              </a>
            </div>
          </CardContent>
        </Card>

        {/* 탭 */}
        <div className="flex gap-2">
          {[
            { value: 'agents', label: '에이전트', count: onesaasAgents.length },
            { value: 'pipelines', label: '파이프라인', count: predefinedPipelines.length },
            { value: 'tools', label: '도구', count: Object.keys(availableTools).length },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as typeof activeTab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.value ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: activeTab === tab.value ? 'var(--color-bg)' : 'var(--color-text)',
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* 에이전트 탭 */}
        {activeTab === 'agents' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 에이전트 목록 */}
            <div className="lg:col-span-1 space-y-3">
              {categories.map(cat => {
                const catAgents = onesaasAgents.filter(a => a.category === cat.value)
                if (catAgents.length === 0) return null

                return (
                  <div key={cat.value}>
                    <h4 className="text-xs font-medium mb-2 uppercase" style={{ color: 'var(--color-text-secondary)' }}>
                      {cat.icon} {cat.label}
                    </h4>
                    <div className="space-y-2">
                      {catAgents.map(agent => (
                        <button
                          key={agent.id}
                          onClick={() => setSelectedAgent(agent)}
                          className="w-full text-left p-3 rounded-lg transition-all"
                          style={{
                            background: selectedAgent?.id === agent.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                            color: selectedAgent?.id === agent.id ? 'var(--color-bg)' : 'var(--color-text)',
                          }}
                        >
                          <p className="font-medium text-sm">{agent.nameKo}</p>
                          <p
                            className="text-xs truncate"
                            style={{
                              color: selectedAgent?.id === agent.id ? 'rgba(0,0,0,0.6)' : 'var(--color-text-secondary)',
                            }}
                          >
                            {agent.tools.length}개 도구
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 에이전트 상세 */}
            <div className="lg:col-span-2">
              {selectedAgent ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{getCategoryIcon(selectedAgent.category)}</span>
                      <div>
                        <CardTitle>{selectedAgent.nameKo}</CardTitle>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {selectedAgent.name}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        설명
                      </h4>
                      <p style={{ color: 'var(--color-text)' }}>{selectedAgent.description}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        사용 도구
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        {selectedAgent.tools.map(tool => (
                          <span
                            key={tool}
                            className="px-2 py-1 rounded text-xs font-mono"
                            style={{ background: 'var(--color-bg)', color: 'var(--color-accent)' }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        시스템 프롬프트
                      </h4>
                      <div
                        className="p-4 rounded-lg overflow-auto max-h-64"
                        style={{ background: 'var(--color-bg)' }}
                      >
                        <pre
                          className="text-sm whitespace-pre-wrap"
                          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}
                        >
                          {selectedAgent.prompt}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        TypeScript 사용 예시
                      </h4>
                      <div
                        className="p-4 rounded-lg overflow-auto"
                        style={{ background: 'var(--color-bg)' }}
                      >
                        <pre
                          className="text-sm"
                          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}
                        >
{`import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "이 코드베이스를 검토해주세요",
  options: {
    allowedTools: ${JSON.stringify(selectedAgent.tools)},
    agents: {
      "${selectedAgent.id}": {
        description: "${selectedAgent.description}",
        prompt: "...",
        tools: ${JSON.stringify(selectedAgent.tools)}
      }
    }
  }
})) {
  console.log(message);
}`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <span className="text-6xl mb-4 block">🤖</span>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                      에이전트를 선택하세요
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      왼쪽 목록에서 에이전트를 선택하면 상세 정보를 확인할 수 있습니다
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* 파이프라인 탭 */}
        {activeTab === 'pipelines' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              {predefinedPipelines.map(pipeline => (
                <button
                  key={pipeline.id}
                  onClick={() => setSelectedPipeline(pipeline)}
                  className="w-full text-left p-4 rounded-lg transition-all"
                  style={{
                    background: selectedPipeline?.id === pipeline.id ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                    color: selectedPipeline?.id === pipeline.id ? 'var(--color-bg)' : 'var(--color-text)',
                  }}
                >
                  <p className="font-medium">{pipeline.nameKo}</p>
                  <p
                    className="text-sm"
                    style={{
                      color: selectedPipeline?.id === pipeline.id ? 'rgba(0,0,0,0.6)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {pipeline.steps.length}단계
                  </p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedPipeline ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedPipeline.nameKo}</CardTitle>
                    <p style={{ color: 'var(--color-text-secondary)' }}>{selectedPipeline.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedPipeline.steps.map((step, index) => {
                        const agent = onesaasAgents.find(a => a.id === step.agentId)
                        return (
                          <div key={index} className="flex items-center gap-4">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1 p-4 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                              <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                                {agent?.nameKo || step.agentId}
                              </p>
                              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                {step.input}
                              </p>
                              {step.dependsOn && (
                                <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                                  의존: {step.dependsOn.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <span className="text-6xl mb-4 block">🔄</span>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                      파이프라인을 선택하세요
                    </h3>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* 도구 탭 */}
        {activeTab === 'tools' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(availableTools).map(([tool, description]) => (
              <Card key={tool}>
                <CardContent className="py-4">
                  <p className="font-mono font-bold" style={{ color: 'var(--color-accent)' }}>{tool}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 통계 */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {onesaasAgents.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>전문 에이전트</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {predefinedPipelines.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>파이프라인</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-4xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {Object.keys(availableTools).length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>내장 도구</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
