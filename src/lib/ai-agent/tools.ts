// AI Agent가 사용할 수 있는 도구들

import type { Tool, AgentContext, StepResult } from './types'
import { GitHubClient } from './github'

export function createTools(github: GitHubClient): Tool[] {
  return [
    // 파일 읽기
    {
      name: 'read_file',
      description: '저장소에서 파일 내용을 읽습니다.',
      parameters: [
        { name: 'path', type: 'string', description: '파일 경로', required: true },
      ],
      execute: async (params, context) => {
        const path = params.path as string
        try {
          // 캐시 확인
          if (context.files.has(path)) {
            return { success: true, data: context.files.get(path) }
          }

          const content = await github.getFileContent(
            context.repository.owner,
            context.repository.repo,
            path,
            context.currentBranch
          )

          // 캐시에 저장
          context.files.set(path, content)

          return { success: true, data: content }
        } catch (error) {
          return { success: false, message: `파일 읽기 실패: ${error}` }
        }
      },
    },

    // 파일 쓰기
    {
      name: 'write_file',
      description: '파일을 생성하거나 수정합니다.',
      parameters: [
        { name: 'path', type: 'string', description: '파일 경로', required: true },
        { name: 'content', type: 'string', description: '파일 내용', required: true },
      ],
      execute: async (params, context) => {
        const path = params.path as string
        const content = params.content as string

        const originalContent = context.files.get(path)
        const action = originalContent ? 'update' : 'create'

        // 변경 사항 기록
        context.changes.push({
          path,
          action,
          content,
          originalContent,
        })

        // 캐시 업데이트
        context.files.set(path, content)

        return {
          success: true,
          message: `파일 ${action === 'create' ? '생성' : '수정'} 예정: ${path}`,
        }
      },
    },

    // 파일 삭제
    {
      name: 'delete_file',
      description: '파일을 삭제합니다.',
      parameters: [
        { name: 'path', type: 'string', description: '파일 경로', required: true },
      ],
      execute: async (params, context) => {
        const path = params.path as string

        context.changes.push({
          path,
          action: 'delete',
          originalContent: context.files.get(path),
        })

        context.files.delete(path)

        return { success: true, message: `파일 삭제 예정: ${path}` }
      },
    },

    // 디렉토리 구조 보기
    {
      name: 'list_directory',
      description: '디렉토리 내용을 나열합니다.',
      parameters: [
        { name: 'path', type: 'string', description: '디렉토리 경로 (빈 문자열은 루트)', required: false },
      ],
      execute: async (params, context) => {
        const path = (params.path as string) || ''
        try {
          const entries = await github.getDirectoryStructure(
            context.repository.owner,
            context.repository.repo,
            path,
            context.currentBranch
          )

          return {
            success: true,
            data: entries.map((e) => `${e.type === 'dir' ? '📁' : '📄'} ${e.name}`).join('\n'),
          }
        } catch (error) {
          return { success: false, message: `디렉토리 읽기 실패: ${error}` }
        }
      },
    },

    // 코드 검색
    {
      name: 'search_code',
      description: '저장소에서 코드를 검색합니다.',
      parameters: [
        { name: 'query', type: 'string', description: '검색어', required: true },
      ],
      execute: async (params, context) => {
        const query = params.query as string
        try {
          const results = await github.searchCode(
            context.repository.owner,
            context.repository.repo,
            query
          )

          if (results.length === 0) {
            return { success: true, data: '검색 결과 없음' }
          }

          const formatted = results.slice(0, 10).map((r) => `📄 ${r.path}`).join('\n')
          return { success: true, data: formatted }
        } catch (error) {
          return { success: false, message: `검색 실패: ${error}` }
        }
      },
    },

    // 파일 이름으로 검색
    {
      name: 'find_file',
      description: '파일 이름으로 파일을 찾습니다.',
      parameters: [
        { name: 'filename', type: 'string', description: '파일 이름 (부분 일치)', required: true },
      ],
      execute: async (params, context) => {
        const filename = params.filename as string
        try {
          const files = await github.searchFiles(
            context.repository.owner,
            context.repository.repo,
            filename
          )

          if (files.length === 0) {
            return { success: true, data: '파일을 찾을 수 없음' }
          }

          return { success: true, data: files.slice(0, 20).join('\n') }
        } catch (error) {
          return { success: false, message: `파일 검색 실패: ${error}` }
        }
      },
    },

    // 프로젝트 구조 보기
    {
      name: 'get_project_structure',
      description: '전체 프로젝트 구조를 가져옵니다.',
      parameters: [
        { name: 'max_depth', type: 'number', description: '최대 깊이 (기본 2)', required: false },
      ],
      execute: async (params, context) => {
        const maxDepth = (params.max_depth as number) || 2
        try {
          const structure = await github.getFullStructure(
            context.repository.owner,
            context.repository.repo,
            context.currentBranch,
            maxDepth
          )

          const formatTree = (entries: typeof structure, indent = ''): string => {
            return entries
              .map((entry) => {
                const icon = entry.type === 'dir' ? '📁' : '📄'
                const line = `${indent}${icon} ${entry.name}`
                if (entry.children && entry.children.length > 0) {
                  return line + '\n' + formatTree(entry.children, indent + '  ')
                }
                return line
              })
              .join('\n')
          }

          return { success: true, data: formatTree(structure) }
        } catch (error) {
          return { success: false, message: `구조 가져오기 실패: ${error}` }
        }
      },
    },
  ]
}

// 도구 스키마를 AI에게 전달하기 위한 형식으로 변환
export function getToolsSchema(tools: Tool[]): Array<{
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, { type: string; description: string }>
      required: string[]
    }
  }
}> {
  return tools.map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: 'object',
        properties: Object.fromEntries(
          tool.parameters.map((p) => [
            p.name,
            { type: p.type, description: p.description },
          ])
        ),
        required: tool.parameters.filter((p) => p.required).map((p) => p.name),
      },
    },
  }))
}
