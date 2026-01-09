'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

interface AgentLog {
  timestamp: Date
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
  details?: unknown
}

interface AgentPlan {
  summary: string
  steps: Array<{ id: string; description: string; status: string }>
}

interface FileChange {
  path: string
  action: 'create' | 'update' | 'delete'
}

type AgentStatus = 'idle' | 'running' | 'completed' | 'failed'

export default function AIAgentPage() {
  const [task, setTask] = useState('')
  const [repository, setRepository] = useState('')
  const [githubToken, setGithubToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [status, setStatus] = useState<AgentStatus>('idle')
  const [logs, setLogs] = useState<AgentLog[]>([])
  const [plan, setPlan] = useState<AgentPlan | null>(null)
  const [changes, setChanges] = useState<FileChange[]>([])
  const [prUrl, setPrUrl] = useState<string | null>(null)
  const [model, setModel] = useState('gemini-2.0-flash')
  const logsEndRef = useRef<HTMLDivElement>(null)

  const models = [
    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', price: '가성비 최고' },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini', price: '빠르고 저렴' },
    { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', price: '고성능' },
  ]

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  // 저장된 토큰 로드
  useEffect(() => {
    const savedToken = localStorage.getItem('github_token')
    if (savedToken) {
      setGithubToken(savedToken)
    }
  }, [])

  // 토큰 저장
  const saveToken = () => {
    if (githubToken) {
      localStorage.setItem('github_token', githubToken)
      addLog('success', 'GitHub 토큰이 저장되었습니다')
    }
  }

  const addLog = (level: AgentLog['level'], message: string, details?: unknown) => {
    setLogs((prev) => [...prev, { timestamp: new Date(), level, message, details }])
  }

  const handleExecute = async () => {
    if (!task.trim() || !repository.trim() || !githubToken) {
      addLog('error', '작업 설명, 저장소, GitHub 토큰이 모두 필요합니다')
      return
    }

    setStatus('running')
    setLogs([])
    setPlan(null)
    setChanges([])
    setPrUrl(null)
    addLog('info', '에이전트 시작...')

    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, repository, githubToken, model }),
      })

      if (!response.ok) {
        throw new Error('API 오류')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('스트림 읽기 실패')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter((line) => line.startsWith('data: '))

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6))
            handleEvent(data)
          } catch {
            // 파싱 실패 무시
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류'
      addLog('error', `실행 실패: ${message}`)
      setStatus('failed')
    }
  }

  const handleEvent = (event: { type: string; data: unknown }) => {
    switch (event.type) {
      case 'log': {
        const log = event.data as AgentLog
        addLog(log.level, log.message, log.details)
        break
      }
      case 'plan': {
        const planData = event.data as AgentPlan
        setPlan(planData)
        addLog('info', `계획 수립 완료: ${planData.summary}`)
        break
      }
      case 'file_change': {
        const change = event.data as FileChange
        setChanges((prev) => [...prev, change])
        break
      }
      case 'pr_created': {
        const pr = event.data as { url: string; number: number }
        setPrUrl(pr.url)
        addLog('success', `PR #${pr.number} 생성됨`)
        break
      }
      case 'complete': {
        const result = event.data as { success: boolean; message: string }
        if (result.success) {
          setStatus('completed')
          addLog('success', result.message)
        } else {
          setStatus('failed')
          addLog('error', result.message)
        }
        break
      }
      case 'error': {
        const error = event.data as { message: string }
        addLog('error', error.message)
        setStatus('failed')
        break
      }
      case 'result': {
        const result = event.data as { success: boolean; prUrl?: string; message: string }
        if (result.success) {
          setStatus('completed')
          if (result.prUrl) {
            setPrUrl(result.prUrl)
          }
        } else {
          setStatus('failed')
        }
        break
      }
    }
  }

  const getLogIcon = (level: AgentLog['level']) => {
    switch (level) {
      case 'info': return '📋'
      case 'warn': return '⚠️'
      case 'error': return '❌'
      case 'success': return '✅'
    }
  }

  const getLogColor = (level: AgentLog['level']) => {
    switch (level) {
      case 'info': return 'var(--color-text-secondary)'
      case 'warn': return '#f59e0b'
      case 'error': return '#ef4444'
      case 'success': return '#10b981'
    }
  }

  return (
    <DashboardLayout title="AI Agent">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">AI Agent</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            AI가 자동으로 코드를 분석하고 수정하여 PR을 생성합니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 입력 패널 */}
          <div className="space-y-4">
            {/* 작업 설명 */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              <label className="block text-sm font-medium mb-2">작업 설명</label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="예: 로그인 페이지에 비밀번호 찾기 기능 추가해줘"
                rows={4}
                className="w-full px-4 py-3 rounded-xl resize-none"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                disabled={status === 'running'}
              />

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">저장소</label>
                <input
                  type="text"
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  placeholder="owner/repo (예: username/my-project)"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  disabled={status === 'running'}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">AI 모델</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  disabled={status === 'running'}
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} ({m.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* GitHub 토큰 */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
            >
              <label className="block text-sm font-medium mb-2">GitHub 토큰</label>
              <div className="flex gap-2">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="flex-1 px-4 py-3 rounded-xl"
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="px-4 py-3 rounded-xl"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                >
                  {showToken ? '🙈' : '👁️'}
                </button>
                <button
                  onClick={saveToken}
                  className="px-4 py-3 rounded-xl"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                >
                  저장
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                💡 <a href="https://github.com/settings/tokens" target="_blank" className="underline">GitHub Settings</a>에서 토큰 생성 (repo 권한 필요)
              </p>
            </div>

            {/* 실행 버튼 */}
            <button
              onClick={handleExecute}
              disabled={status === 'running' || !task.trim() || !repository.trim() || !githubToken}
              className="w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              {status === 'running' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> 실행 중...
                </span>
              ) : (
                '🚀 에이전트 실행'
              )}
            </button>

            {/* 계획 표시 */}
            {plan && (
              <div
                className="rounded-2xl p-6"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <h3 className="font-bold mb-4">📋 실행 계획</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {plan.summary}
                </p>
                <div className="space-y-2">
                  {plan.steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-2 text-sm">
                      <span>{index + 1}.</span>
                      <span>{step.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 변경 파일 */}
            {changes.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              >
                <h3 className="font-bold mb-4">📁 변경된 파일</h3>
                <div className="space-y-2">
                  {changes.map((change, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span>
                        {change.action === 'create' ? '✨' : change.action === 'update' ? '📝' : '🗑️'}
                      </span>
                      <code className="px-2 py-1 rounded" style={{ background: 'var(--color-bg)' }}>
                        {change.path}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 로그 패널 */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h3 className="font-bold">실행 로그</h3>
              <div className="flex items-center gap-2">
                {status === 'running' && (
                  <span className="flex items-center gap-1 text-sm" style={{ color: '#f59e0b' }}>
                    <span className="animate-pulse">●</span> 실행 중
                  </span>
                )}
                {status === 'completed' && (
                  <span className="flex items-center gap-1 text-sm" style={{ color: '#10b981' }}>
                    ● 완료
                  </span>
                )}
                {status === 'failed' && (
                  <span className="flex items-center gap-1 text-sm" style={{ color: '#ef4444' }}>
                    ● 실패
                  </span>
                )}
              </div>
            </div>

            <div className="h-[500px] overflow-y-auto p-4 space-y-2 font-mono text-sm" style={{ background: '#1e1e1e' }}>
              {logs.length === 0 ? (
                <p className="text-gray-500">로그가 여기에 표시됩니다...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="opacity-50">
                      {log.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span>{getLogIcon(log.level)}</span>
                    <span style={{ color: getLogColor(log.level) }}>{log.message}</span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>

            {/* PR 링크 */}
            {prUrl && (
              <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <a
                  href={prUrl}
                  target="_blank"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium"
                  style={{ background: '#10b981', color: 'white' }}
                >
                  🎉 Pull Request 보기
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 사용 가이드 */}
        <div
          className="mt-6 p-6 rounded-2xl"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          <h3 className="font-bold mb-4">💡 사용 가이드</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">1. GitHub 토큰 준비</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Settings → Developer settings → Personal access tokens에서 repo 권한이 있는 토큰 생성
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">2. 작업 설명 입력</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                구체적으로 설명할수록 정확한 결과를 얻을 수 있습니다
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">3. PR 확인 및 머지</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                생성된 PR을 검토하고 문제가 없으면 머지하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
