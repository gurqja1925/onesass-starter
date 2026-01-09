/**
 * OneSaaS MCP (Model Context Protocol) 서버 설정
 *
 * Claude Code에서 사용하는 필수 MCP 서버들
 *
 * @see https://github.com/modelcontextprotocol/servers
 * @see https://mcpcat.io/guides/best-mcp-servers-for-claude-code/
 */

// ============================================================
// MCP 서버 타입 정의
// ============================================================

export interface MCPServer {
  id: string
  name: string
  nameKo: string
  description: string
  category: 'core' | 'cloud' | 'analytics' | 'design' | 'project' | 'database'
  installCommand: string
  configExample?: string
  envVars?: { key: string; description: string }[]
  features: string[]
  priority: 'essential' | 'recommended' | 'optional'
  docs?: string
}

// ============================================================
// 필수 MCP 서버 목록
// ============================================================

export const essentialMCPServers: MCPServer[] = [
  // 1. Context7 - 실시간 문서 제공 (필수!)
  {
    id: 'context7',
    name: 'Context7',
    nameKo: 'Context7',
    description: '실시간으로 최신 라이브러리 문서와 코드 예시를 제공하는 MCP 서버',
    category: 'core',
    installCommand: 'claude mcp add --transport http context7 https://mcp.context7.com/mcp',
    features: [
      '최신 라이브러리 문서 실시간 조회',
      '버전별 정확한 API 정보',
      '코드 예시 자동 주입',
      '훈련 데이터 오류 방지',
    ],
    priority: 'essential',
    docs: 'https://context7.com',
  },

  // 2. Playwright - 브라우저 자동화
  {
    id: 'playwright',
    name: 'Playwright',
    nameKo: 'Playwright',
    description: '웹 자동화 및 E2E 테스트를 위한 브라우저 제어 MCP 서버',
    category: 'core',
    installCommand: 'claude mcp add playwright npx -- @playwright/mcp@latest',
    features: [
      '웹 페이지 탐색 및 상호작용',
      '스크린샷 캡처',
      'E2E 테스트 자동화',
      '접근성 트리 기반 요소 선택',
    ],
    priority: 'essential',
    docs: 'https://github.com/microsoft/playwright-mcp',
  },

  // 3. GitHub - 저장소 관리
  {
    id: 'github',
    name: 'GitHub',
    nameKo: 'GitHub',
    description: 'GitHub 저장소, PR, 이슈, CI/CD를 관리하는 MCP 서버',
    category: 'core',
    installCommand: 'claude mcp add --transport http github https://api.githubcopilot.com/mcp/',
    envVars: [
      { key: 'GITHUB_TOKEN', description: 'GitHub Personal Access Token' },
    ],
    features: [
      '저장소 생성 및 관리',
      'PR 생성 및 리뷰',
      '이슈 관리',
      'CI/CD 워크플로우 실행',
    ],
    priority: 'essential',
    docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
  },

  // 4. Sequential Thinking - 구조화된 사고
  {
    id: 'sequential-thinking',
    name: 'Sequential Thinking',
    nameKo: '순차적 사고',
    description: '복잡한 문제를 단계별로 분석하는 구조화된 사고 MCP 서버',
    category: 'core',
    installCommand: 'claude mcp add sequential-thinking npx -- -y @modelcontextprotocol/server-sequential-thinking',
    features: [
      '단계별 문제 분석',
      '반성적 추론',
      '복잡한 작업 분해',
      '체계적 해결 방안 도출',
    ],
    priority: 'essential',
    docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking',
  },

  // 5. Puppeteer - 헤드리스 브라우저
  {
    id: 'puppeteer',
    name: 'Puppeteer',
    nameKo: 'Puppeteer',
    description: '헤드리스 Chrome을 제어하는 브라우저 자동화 MCP 서버',
    category: 'core',
    installCommand: 'claude mcp add puppeteer npx -- -y @anthropic-ai/mcp-puppeteer',
    features: [
      '웹 스크래핑',
      'PDF 생성',
      '폼 자동 입력',
      '스크린샷 및 녹화',
    ],
    priority: 'recommended',
    docs: 'https://github.com/anthropics/mcp-puppeteer',
  },

  // 6. Supabase - 데이터베이스
  {
    id: 'supabase',
    name: 'Supabase',
    nameKo: 'Supabase',
    description: 'Supabase 데이터베이스와 인증을 관리하는 MCP 서버',
    category: 'database',
    installCommand: 'claude mcp add supabase npx -- -y @supabase/mcp-server',
    envVars: [
      { key: 'SUPABASE_URL', description: 'Supabase 프로젝트 URL' },
      { key: 'SUPABASE_SERVICE_KEY', description: 'Supabase 서비스 역할 키' },
    ],
    features: [
      'SQL 쿼리 실행',
      '테이블 CRUD',
      'RLS 정책 관리',
      '스토리지 관리',
    ],
    priority: 'essential',
    docs: 'https://github.com/supabase-community/mcp-server-supabase',
  },

  // 7. Sentry - 에러 추적
  {
    id: 'sentry',
    name: 'Sentry',
    nameKo: 'Sentry',
    description: '에러 추적 및 성능 모니터링 MCP 서버',
    category: 'analytics',
    installCommand: 'claude mcp add sentry npx -- -y @sentry/mcp-server',
    envVars: [
      { key: 'SENTRY_AUTH_TOKEN', description: 'Sentry 인증 토큰' },
      { key: 'SENTRY_ORG', description: 'Sentry 조직 슬러그' },
    ],
    features: [
      '에러 이슈 조회',
      '스택 트레이스 분석',
      '성능 메트릭',
      '릴리즈 추적',
    ],
    priority: 'recommended',
    docs: 'https://docs.sentry.io/product/integrations/mcp/',
  },

  // 8. Notion - 문서 관리
  {
    id: 'notion',
    name: 'Notion',
    nameKo: 'Notion',
    description: '노션 워크스페이스와 문서를 관리하는 MCP 서버',
    category: 'project',
    installCommand: 'claude mcp add notion npx -- -y @notionhq/mcp-server',
    envVars: [
      { key: 'NOTION_API_KEY', description: 'Notion 통합 API 키' },
    ],
    features: [
      '페이지 생성 및 편집',
      '데이터베이스 쿼리',
      '블록 콘텐츠 관리',
      '검색',
    ],
    priority: 'optional',
    docs: 'https://developers.notion.com/',
  },

  // 9. Slack - 팀 커뮤니케이션
  {
    id: 'slack',
    name: 'Slack',
    nameKo: 'Slack',
    description: 'Slack 메시지 및 채널을 관리하는 MCP 서버',
    category: 'project',
    installCommand: 'claude mcp add slack npx -- -y @anthropic-ai/mcp-slack',
    envVars: [
      { key: 'SLACK_BOT_TOKEN', description: 'Slack Bot OAuth 토큰' },
    ],
    features: [
      '메시지 전송',
      '채널 목록 조회',
      '파일 업로드',
      '스레드 응답',
    ],
    priority: 'optional',
    docs: 'https://api.slack.com/',
  },

  // 10. Figma - 디자인 연동
  {
    id: 'figma',
    name: 'Figma',
    nameKo: 'Figma',
    description: 'Figma 디자인 파일을 분석하고 코드로 변환하는 MCP 서버',
    category: 'design',
    installCommand: 'claude mcp add figma npx -- -y @anthropic-ai/mcp-figma',
    envVars: [
      { key: 'FIGMA_ACCESS_TOKEN', description: 'Figma Personal Access Token' },
    ],
    features: [
      '디자인 파일 분석',
      '컴포넌트 추출',
      '스타일 정보 조회',
      '디자인-코드 변환',
    ],
    priority: 'optional',
    docs: 'https://www.figma.com/developers/',
  },
]

// ============================================================
// 유틸리티 함수
// ============================================================

export function getMCPServerById(id: string): MCPServer | undefined {
  return essentialMCPServers.find(s => s.id === id)
}

export function getMCPServersByCategory(category: MCPServer['category']): MCPServer[] {
  return essentialMCPServers.filter(s => s.category === category)
}

export function getEssentialMCPServers(): MCPServer[] {
  return essentialMCPServers.filter(s => s.priority === 'essential')
}

export function getRecommendedMCPServers(): MCPServer[] {
  return essentialMCPServers.filter(s => s.priority === 'recommended')
}

// ============================================================
// Claude Code 설정 생성
// ============================================================

export function generateClaudeCodeConfig(serverIds: string[]): string {
  const servers: Record<string, unknown> = {}

  for (const id of serverIds) {
    const server = getMCPServerById(id)
    if (!server) continue

    // 서버별 설정 생성
    if (id === 'context7') {
      servers[id] = {
        transport: 'http',
        url: 'https://mcp.context7.com/mcp',
      }
    } else if (id === 'playwright') {
      servers[id] = {
        command: 'npx',
        args: ['@playwright/mcp@latest'],
      }
    } else if (id === 'github') {
      servers[id] = {
        transport: 'http',
        url: 'https://api.githubcopilot.com/mcp/',
      }
    } else if (id === 'sequential-thinking') {
      servers[id] = {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
      }
    } else if (id === 'supabase') {
      servers[id] = {
        command: 'npx',
        args: ['-y', '@supabase/mcp-server'],
        env: {
          SUPABASE_URL: '${SUPABASE_URL}',
          SUPABASE_SERVICE_KEY: '${SUPABASE_SERVICE_KEY}',
        },
      }
    }
  }

  return JSON.stringify({ mcpServers: servers }, null, 2)
}

// ============================================================
// 설치 스크립트 생성
// ============================================================

export function generateInstallScript(serverIds: string[]): string {
  const commands: string[] = [
    '#!/bin/bash',
    '',
    '# OneSaaS MCP 서버 설치 스크립트',
    '# Claude Code에서 필수 MCP 서버들을 설치합니다.',
    '',
  ]

  for (const id of serverIds) {
    const server = getMCPServerById(id)
    if (!server) continue

    commands.push(`# ${server.nameKo} - ${server.description}`)
    commands.push(server.installCommand)
    commands.push('')
  }

  commands.push('echo "MCP 서버 설치 완료!"')

  return commands.join('\n')
}
