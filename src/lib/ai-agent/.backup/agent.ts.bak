// AI Agent 메인 오케스트레이터

import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { GitHubClient } from './github'
import { createTools, getToolsSchema } from './tools'
import type {
  AgentTask,
  AgentPlan,
  AgentStep,
  AgentContext,
  AgentConfig,
  AgentEvent,
  AgentLog,
  Tool,
  FileOperation,
} from './types'

const DEFAULT_CONFIG: AgentConfig = {
  model: 'gemini-2.0-flash',
  maxSteps: 50,
  maxFileSize: 100000, // 100KB
  allowedExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.html', '.yaml', '.yml'],
  githubToken: '',
}

export class AIAgent {
  private config: AgentConfig
  private github: GitHubClient
  private tools: Tool[]
  private eventHandler?: (event: AgentEvent) => void

  constructor(config: Partial<AgentConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.github = new GitHubClient(this.config.githubToken)
    this.tools = createTools(this.github)
  }

  // 이벤트 핸들러 설정
  onEvent(handler: (event: AgentEvent) => void) {
    this.eventHandler = handler
  }

  private emit(event: AgentEvent) {
    this.eventHandler?.(event)
  }

  private log(level: AgentLog['level'], message: string, details?: unknown) {
    const log: AgentLog = { timestamp: new Date(), level, message, details }
    this.emit({ type: 'log', data: log })
  }

  // AI 모델 가져오기
  private getModel() {
    const [provider, modelName] = this.config.model.includes('/')
      ? this.config.model.split('/')
      : ['google', this.config.model]

    switch (provider) {
      case 'openai':
        return openai(modelName)
      case 'anthropic':
        return anthropic(modelName)
      case 'google':
      default:
        return google(modelName)
    }
  }

  // 작업 실행
  async execute(task: AgentTask): Promise<{ success: boolean; prUrl?: string; message: string }> {
    const [owner, repo] = task.repository.split('/')

    try {
      // 1. 저장소 정보 가져오기
      this.log('info', `저장소 정보 가져오는 중: ${task.repository}`)
      const repoInfo = await this.github.getRepositoryInfo(owner, repo)

      // 2. 브랜치 생성
      const branchName = task.branch || `ai-agent/${task.id}`
      this.log('info', `브랜치 생성: ${branchName}`)

      const branchExists = await this.github.branchExists(owner, repo, branchName)
      if (!branchExists) {
        await this.github.createBranch(owner, repo, branchName, repoInfo.defaultBranch)
      }

      // 3. 컨텍스트 초기화
      const context: AgentContext = {
        task,
        repository: repoInfo,
        files: new Map(),
        changes: [],
        currentBranch: branchName,
        logs: [],
      }

      // 4. 프로젝트 구조 분석
      this.log('info', '프로젝트 구조 분석 중...')
      const structure = await this.github.getFullStructure(owner, repo, branchName, 2)
      context.repository.structure = structure

      // 5. 계획 수립
      this.log('info', '작업 계획 수립 중...')
      const plan = await this.createPlan(task, context)
      this.emit({ type: 'plan', data: plan })

      // 6. 계획 실행
      this.log('info', '계획 실행 중...')
      await this.executePlan(plan, context)

      // 7. 변경 사항 커밋
      if (context.changes.length > 0) {
        this.log('info', `변경 사항 커밋 중... (${context.changes.length}개 파일)`)
        await this.commitChanges(context)

        // 8. PR 생성
        this.log('info', 'Pull Request 생성 중...')
        const pr = await this.createPR(task, plan, context)
        this.emit({ type: 'pr_created', data: pr })

        this.emit({ type: 'complete', data: { success: true, message: 'PR이 생성되었습니다.' } })
        return { success: true, prUrl: pr.url, message: 'PR이 성공적으로 생성되었습니다.' }
      } else {
        this.log('warn', '변경 사항이 없습니다.')
        this.emit({ type: 'complete', data: { success: true, message: '변경 사항이 없습니다.' } })
        return { success: true, message: '변경 사항이 없습니다.' }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류'
      this.log('error', `실행 실패: ${message}`)
      this.emit({ type: 'error', data: { message } })
      return { success: false, message }
    }
  }

  // 계획 수립
  private async createPlan(task: AgentTask, context: AgentContext): Promise<AgentPlan> {
    const structureText = this.formatStructure(context.repository.structure || [])

    const prompt = `당신은 소프트웨어 개발 전문가입니다. 다음 작업을 수행하기 위한 계획을 세워주세요.

## 작업 설명
${task.description}

## 프로젝트 구조
${structureText}

## 지침
1. 작업을 완료하기 위해 필요한 단계를 나열해주세요.
2. 각 단계에서 어떤 파일을 읽거나 수정해야 하는지 명시해주세요.
3. 새로운 파일이 필요한 경우 어디에 생성할지 명시해주세요.
4. 기존 코드 패턴과 스타일을 따라주세요.

## 응답 형식 (JSON)
{
  "summary": "작업 요약 (한 줄)",
  "steps": [
    {
      "description": "단계 설명",
      "files_to_read": ["읽을 파일 경로"],
      "files_to_modify": ["수정할 파일 경로"],
      "files_to_create": ["생성할 파일 경로"]
    }
  ],
  "estimated_files": ["관련된 모든 파일 목록"]
}

JSON만 응답해주세요.`

    const result = await generateText({
      model: this.getModel(),
      prompt,
    })

    try {
      const planData = JSON.parse(result.text.replace(/```json\n?|\n?```/g, ''))

      const plan: AgentPlan = {
        taskId: task.id,
        summary: planData.summary,
        steps: planData.steps.map((step: { description: string }, index: number) => ({
          id: `step-${index + 1}`,
          type: 'analyze' as const,
          description: step.description,
          status: 'pending' as const,
          params: step,
        })),
        estimatedFiles: planData.estimated_files || [],
      }

      return plan
    } catch {
      throw new Error('계획 파싱 실패: AI 응답이 올바르지 않습니다.')
    }
  }

  // 계획 실행
  private async executePlan(plan: AgentPlan, context: AgentContext): Promise<void> {
    // 에이전트 루프 - AI가 도구를 사용하여 작업 수행
    const toolsSchema = getToolsSchema(this.tools)

    const systemPrompt = `당신은 코드 작업을 수행하는 AI 에이전트입니다.
주어진 작업 계획을 단계별로 실행하세요.

## 작업 계획
${plan.summary}

## 단계
${plan.steps.map((s, i) => `${i + 1}. ${s.description}`).join('\n')}

## 규칙
1. 먼저 관련 파일을 읽어서 현재 코드를 파악하세요.
2. 기존 코드 스타일과 패턴을 따르세요.
3. TypeScript를 사용하는 경우 타입을 정확히 지정하세요.
4. 한 번에 하나의 도구만 사용하세요.
5. 작업이 완료되면 "TASK_COMPLETE"라고 응답하세요.

사용 가능한 도구를 활용하여 작업을 완료하세요.`

    const messages: Array<{ role: 'user' | 'assistant' | 'tool'; content: string; tool_call_id?: string }> = [
      { role: 'user', content: `작업을 시작하세요. 작업 내용: ${context.task.description}` },
    ]

    let stepCount = 0
    const maxSteps = this.config.maxSteps

    while (stepCount < maxSteps) {
      stepCount++
      this.log('info', `에이전트 단계 ${stepCount}/${maxSteps}`)

      const result = await generateText({
        model: this.getModel(),
        system: systemPrompt,
        messages,
        tools: Object.fromEntries(
          this.tools.map((tool) => [
            tool.name,
            {
              description: tool.description,
              parameters: {
                type: 'object' as const,
                properties: Object.fromEntries(
                  tool.parameters.map((p) => [
                    p.name,
                    { type: p.type, description: p.description },
                  ])
                ),
                required: tool.parameters.filter((p) => p.required).map((p) => p.name),
              },
            },
          ])
        ),
      })

      // 텍스트 응답 확인
      if (result.text) {
        messages.push({ role: 'assistant', content: result.text })

        if (result.text.includes('TASK_COMPLETE')) {
          this.log('success', '작업 완료')
          break
        }
      }

      // 도구 호출 처리
      if (result.toolCalls && result.toolCalls.length > 0) {
        for (const toolCall of result.toolCalls) {
          const tool = this.tools.find((t) => t.name === toolCall.toolName)
          if (!tool) {
            this.log('warn', `알 수 없는 도구: ${toolCall.toolName}`)
            continue
          }

          this.log('info', `도구 실행: ${toolCall.toolName}`, toolCall.args)

          try {
            const toolResult = await tool.execute(toolCall.args as Record<string, unknown>, context)

            if (toolResult.success) {
              this.log('success', `도구 성공: ${toolCall.toolName}`)
            } else {
              this.log('error', `도구 실패: ${toolCall.toolName} - ${toolResult.message}`)
            }

            // 파일 변경 이벤트
            if (toolCall.toolName === 'write_file' || toolCall.toolName === 'delete_file') {
              const lastChange = context.changes[context.changes.length - 1]
              if (lastChange) {
                this.emit({ type: 'file_change', data: lastChange })
              }
            }

            messages.push({
              role: 'tool',
              content: JSON.stringify(toolResult),
              tool_call_id: toolCall.toolName,
            })
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '도구 실행 오류'
            this.log('error', `도구 오류: ${toolCall.toolName} - ${errorMsg}`)
            messages.push({
              role: 'tool',
              content: JSON.stringify({ success: false, message: errorMsg }),
              tool_call_id: toolCall.toolName,
            })
          }
        }
      } else if (!result.text) {
        // 도구 호출도 텍스트도 없으면 종료
        this.log('warn', 'AI 응답 없음, 종료')
        break
      }
    }

    if (stepCount >= maxSteps) {
      this.log('warn', '최대 단계 수 초과')
    }
  }

  // 변경 사항 커밋
  private async commitChanges(context: AgentContext): Promise<void> {
    const [owner, repo] = context.task.repository.split('/')

    const commitMessage = `feat: ${context.task.description.slice(0, 50)}

AI Agent에 의해 자동 생성됨
- 변경된 파일: ${context.changes.length}개`

    await this.github.commitMultipleFiles(
      owner,
      repo,
      context.currentBranch,
      commitMessage,
      context.changes
    )
  }

  // PR 생성
  private async createPR(
    task: AgentTask,
    plan: AgentPlan,
    context: AgentContext
  ): Promise<{ url: string; number: number }> {
    const [owner, repo] = task.repository.split('/')

    const title = `[AI Agent] ${plan.summary}`
    const body = `## 작업 설명
${task.description}

## 변경 사항
${context.changes.map((c) => `- ${c.action === 'create' ? '✨' : c.action === 'update' ? '📝' : '🗑️'} \`${c.path}\``).join('\n')}

## 실행 계획
${plan.steps.map((s, i) => `${i + 1}. ${s.description}`).join('\n')}

---
*이 PR은 AI Agent에 의해 자동 생성되었습니다.*`

    return await this.github.createPullRequest(
      owner,
      repo,
      title,
      body,
      context.currentBranch,
      context.repository.defaultBranch
    )
  }

  // 구조 포맷팅
  private formatStructure(entries: { name: string; path: string; type: string; children?: unknown[] }[], indent = ''): string {
    return entries
      .map((entry) => {
        const icon = entry.type === 'dir' ? '📁' : '📄'
        const line = `${indent}${icon} ${entry.name}`
        if (entry.children && Array.isArray(entry.children) && entry.children.length > 0) {
          return line + '\n' + this.formatStructure(entry.children as typeof entries, indent + '  ')
        }
        return line
      })
      .join('\n')
  }
}
