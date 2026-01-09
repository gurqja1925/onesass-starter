// AI Agent 타입 정의

export interface AgentTask {
  id: string
  description: string
  repository: string  // owner/repo
  branch?: string     // 작업 브랜치 (없으면 자동 생성)
  status: 'pending' | 'planning' | 'executing' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
}

export interface AgentPlan {
  taskId: string
  summary: string
  steps: AgentStep[]
  estimatedFiles: string[]
}

export interface AgentStep {
  id: string
  type: 'analyze' | 'read' | 'write' | 'delete' | 'search' | 'create_branch' | 'commit' | 'create_pr'
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  params: Record<string, unknown>
  result?: StepResult
  error?: string
}

export interface StepResult {
  success: boolean
  data?: unknown
  message?: string
}

export interface FileOperation {
  path: string
  action: 'create' | 'update' | 'delete'
  content?: string
  originalContent?: string
}

export interface AgentContext {
  task: AgentTask
  repository: RepositoryInfo
  files: Map<string, string>  // 읽은 파일 캐시
  changes: FileOperation[]    // 변경 사항
  currentBranch: string
  logs: AgentLog[]
}

export interface RepositoryInfo {
  owner: string
  repo: string
  defaultBranch: string
  structure?: DirectoryEntry[]
}

export interface DirectoryEntry {
  name: string
  path: string
  type: 'file' | 'dir'
  children?: DirectoryEntry[]
}

export interface AgentLog {
  timestamp: Date
  level: 'info' | 'warn' | 'error' | 'success'
  message: string
  details?: unknown
}

export interface AgentConfig {
  model: string
  maxSteps: number
  maxFileSize: number  // bytes
  allowedExtensions: string[]
  githubToken: string
}

// Tool 정의
export interface Tool {
  name: string
  description: string
  parameters: ToolParameter[]
  execute: (params: Record<string, unknown>, context: AgentContext) => Promise<StepResult>
}

export interface ToolParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array'
  description: string
  required: boolean
}

// AI 메시지 타입
export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  toolCalls?: ToolCall[]
  toolCallId?: string
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
}

// 스트리밍 이벤트
export type AgentEvent =
  | { type: 'log'; data: AgentLog }
  | { type: 'plan'; data: AgentPlan }
  | { type: 'step_start'; data: { stepId: string } }
  | { type: 'step_complete'; data: { stepId: string; result: StepResult } }
  | { type: 'step_error'; data: { stepId: string; error: string } }
  | { type: 'file_change'; data: FileOperation }
  | { type: 'pr_created'; data: { url: string; number: number } }
  | { type: 'complete'; data: { success: boolean; message: string } }
  | { type: 'error'; data: { message: string } }
