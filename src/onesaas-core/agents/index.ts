/**
 * OneSaaS Claude Agent SDK Integration
 *
 * Claude Agent SDK를 활용한 AI 에이전트 시스템
 * 서브에이전트, 멀티에이전트 워크플로우 지원
 *
 * @see https://platform.claude.com/docs/en/agent-sdk/overview
 * @see https://github.com/anthropics/claude-agent-sdk-python
 */

// ============================================================
// 타입 정의
// ============================================================

export interface AgentDefinition {
  id: string
  name: string
  nameKo: string
  description: string
  prompt: string
  tools: string[]
  category: 'development' | 'review' | 'testing' | 'documentation' | 'support' | 'analysis'
}

export interface AgentOptions {
  allowedTools?: string[]
  systemPrompt?: string
  maxTurns?: number
  permissionMode?: 'acceptEdits' | 'bypassPermissions' | 'default'
  agents?: Record<string, AgentDefinition>
}

export interface AgentMessage {
  type: 'system' | 'assistant' | 'user' | 'tool'
  content: string
  toolName?: string
  result?: string
}

// ============================================================
// 사용 가능한 도구들
// ============================================================

export const availableTools = {
  // 파일 시스템
  Read: '파일 읽기',
  Write: '파일 생성',
  Edit: '파일 편집',
  Glob: '파일 패턴 검색',
  Grep: '내용 검색 (정규식)',

  // 실행
  Bash: '터미널 명령 실행',
  Task: '서브에이전트 실행',

  // 웹
  WebSearch: '웹 검색',
  WebFetch: '웹 페이지 가져오기',

  // 사용자 상호작용
  AskUserQuestion: '사용자에게 질문',
  TodoWrite: '할일 목록 관리',
} as const

export type ToolName = keyof typeof availableTools

// ============================================================
// OneSaaS 전용 에이전트들
// ============================================================

export const onesaasAgents: AgentDefinition[] = [
  // 1. 코드 리뷰어
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    nameKo: '코드 리뷰어',
    description: '코드 품질, 보안, 스타일을 검토하는 전문 에이전트',
    prompt: `당신은 전문 코드 리뷰어입니다.

다음 관점에서 코드를 분석하세요:
1. **코드 품질**: 가독성, 유지보수성, 복잡도
2. **보안**: OWASP Top 10 취약점, 입력 검증
3. **성능**: 비효율적인 패턴, 메모리 누수
4. **스타일**: 일관성, 네이밍 컨벤션
5. **베스트 프랙티스**: TypeScript/React 패턴

리뷰 결과를 마크다운으로 정리하세요.`,
    tools: ['Read', 'Glob', 'Grep'],
    category: 'review',
  },

  // 2. 버그 픽서
  {
    id: 'bug-fixer',
    name: 'Bug Fixer',
    nameKo: '버그 수정자',
    description: '버그를 찾아 자동으로 수정하는 에이전트',
    prompt: `당신은 버그 수정 전문가입니다.

작업 순서:
1. 버그 증상 분석
2. 관련 코드 탐색
3. 근본 원인 식별
4. 수정 사항 구현
5. 수정 결과 검증

안전한 수정만 진행하고, 확실하지 않으면 사용자에게 확인하세요.`,
    tools: ['Read', 'Edit', 'Glob', 'Grep', 'Bash'],
    category: 'development',
  },

  // 3. 테스트 러너
  {
    id: 'test-runner',
    name: 'Test Runner',
    nameKo: '테스트 실행자',
    description: '테스트를 실행하고 결과를 분석하는 에이전트',
    prompt: `당신은 QA 엔지니어입니다.

역할:
1. 테스트 실행 (npm test, playwright test 등)
2. 실패한 테스트 분석
3. 테스트 커버리지 확인
4. 테스트 결과 리포트 생성

실패한 테스트의 원인과 해결 방안을 제시하세요.`,
    tools: ['Bash', 'Read', 'Glob'],
    category: 'testing',
  },

  // 4. 문서 생성자
  {
    id: 'doc-generator',
    name: 'Documentation Generator',
    nameKo: '문서 생성자',
    description: '코드에서 자동으로 문서를 생성하는 에이전트',
    prompt: `당신은 기술 문서 작성 전문가입니다.

문서 유형:
1. **API 문서**: 엔드포인트, 파라미터, 응답
2. **컴포넌트 문서**: Props, 사용 예시
3. **함수 문서**: 파라미터, 반환값, 예시
4. **README**: 설치, 사용법, 기여 가이드

한국어로 명확하고 친절한 문서를 작성하세요.`,
    tools: ['Read', 'Write', 'Glob', 'Grep'],
    category: 'documentation',
  },

  // 5. 성능 분석가
  {
    id: 'performance-analyzer',
    name: 'Performance Analyzer',
    nameKo: '성능 분석가',
    description: '코드 성능을 분석하고 최적화를 제안하는 에이전트',
    prompt: `당신은 성능 최적화 전문가입니다.

분석 항목:
1. **렌더링 성능**: 불필요한 리렌더링, 메모이제이션
2. **번들 크기**: 사용하지 않는 코드, 코드 스플리팅
3. **API 성능**: N+1 쿼리, 캐싱 기회
4. **메모리**: 메모리 누수, 큰 객체
5. **로딩 시간**: 레이지 로딩, 프리페칭

구체적인 개선 방안과 예상 효과를 제시하세요.`,
    tools: ['Read', 'Glob', 'Grep', 'Bash'],
    category: 'analysis',
  },

  // 6. 보안 감사자
  {
    id: 'security-auditor',
    name: 'Security Auditor',
    nameKo: '보안 감사자',
    description: '보안 취약점을 검사하는 에이전트',
    prompt: `당신은 보안 전문가입니다.

검사 항목:
1. **인증/인가**: 세션 관리, 권한 검증
2. **입력 검증**: SQL Injection, XSS, CSRF
3. **민감 데이터**: 하드코딩된 시크릿, 로그 노출
4. **의존성**: 취약한 패키지, CVE
5. **설정**: CORS, CSP, 보안 헤더

심각도(Critical/High/Medium/Low)와 함께 취약점을 보고하세요.`,
    tools: ['Read', 'Glob', 'Grep', 'Bash'],
    category: 'review',
  },

  // 7. 리팩토링 도우미
  {
    id: 'refactorer',
    name: 'Refactoring Helper',
    nameKo: '리팩토링 도우미',
    description: '코드를 깔끔하게 리팩토링하는 에이전트',
    prompt: `당신은 리팩토링 전문가입니다.

리팩토링 원칙:
1. **DRY**: 중복 코드 제거
2. **SOLID**: 단일 책임, 의존성 역전
3. **컴포넌트 분리**: 작고 재사용 가능한 단위
4. **타입 안전성**: 더 나은 TypeScript 타입
5. **가독성**: 명확한 이름, 간결한 로직

기존 동작을 유지하면서 점진적으로 개선하세요.`,
    tools: ['Read', 'Edit', 'Glob', 'Grep'],
    category: 'development',
  },

  // 8. API 설계자
  {
    id: 'api-designer',
    name: 'API Designer',
    nameKo: 'API 설계자',
    description: 'RESTful API를 설계하고 구현하는 에이전트',
    prompt: `당신은 API 설계 전문가입니다.

설계 원칙:
1. **RESTful**: 올바른 HTTP 메서드, 상태 코드
2. **일관성**: 네이밍, 응답 형식
3. **보안**: 인증, 권한, 입력 검증
4. **문서화**: OpenAPI/Swagger 스펙
5. **버전 관리**: 하위 호환성

Next.js App Router API 라우트로 구현하세요.`,
    tools: ['Read', 'Write', 'Edit', 'Glob'],
    category: 'development',
  },

  // 9. 고객 지원 에이전트
  {
    id: 'support-agent',
    name: 'Customer Support Agent',
    nameKo: '고객 지원 에이전트',
    description: 'SaaS 고객 문의를 처리하는 에이전트',
    prompt: `당신은 친절한 고객 지원 담당자입니다.

응대 원칙:
1. **공감**: 고객의 상황을 이해하고 공감 표현
2. **명확성**: 단계별로 쉽게 설명
3. **해결 지향**: 실질적인 해결책 제시
4. **에스컬레이션**: 필요시 전문가 연결 안내
5. **후속 조치**: 추가 도움 제안

한국어로 정중하게 응대하세요.`,
    tools: ['Read', 'WebSearch', 'AskUserQuestion'],
    category: 'support',
  },

  // 10. 데이터베이스 최적화
  {
    id: 'db-optimizer',
    name: 'Database Optimizer',
    nameKo: 'DB 최적화 에이전트',
    description: 'Prisma 스키마와 쿼리를 최적화하는 에이전트',
    prompt: `당신은 데이터베이스 전문가입니다.

최적화 영역:
1. **스키마 설계**: 정규화, 인덱스, 관계
2. **쿼리 최적화**: N+1 문제, include/select
3. **마이그레이션**: 안전한 스키마 변경
4. **성능**: 쿼리 실행 계획 분석
5. **Prisma 패턴**: 베스트 프랙티스

Supabase PostgreSQL에 최적화된 제안을 하세요.`,
    tools: ['Read', 'Edit', 'Glob', 'Grep', 'Bash'],
    category: 'development',
  },
]

// ============================================================
// 유틸리티 함수
// ============================================================

export function getAgentById(id: string): AgentDefinition | undefined {
  return onesaasAgents.find(a => a.id === id)
}

export function getAgentsByCategory(category: AgentDefinition['category']): AgentDefinition[] {
  return onesaasAgents.filter(a => a.category === category)
}

export function createAgentConfig(agentIds: string[]): Record<string, AgentDefinition> {
  const config: Record<string, AgentDefinition> = {}
  for (const id of agentIds) {
    const agent = getAgentById(id)
    if (agent) {
      config[id] = agent
    }
  }
  return config
}

// ============================================================
// SDK 설정 생성
// ============================================================

export function createOneSaaSAgentOptions(options: Partial<AgentOptions> = {}): AgentOptions {
  return {
    allowedTools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash', 'Task'],
    systemPrompt: `당신은 OneSaaS 플랫폼의 AI 어시스턴트입니다.
한국 SaaS 서비스 개발을 도와줍니다.

기술 스택:
- Next.js 16 App Router
- TypeScript
- Prisma + PostgreSQL (Supabase)
- Tailwind CSS
- PortOne 결제

한국어로 친절하게 응답하세요.`,
    maxTurns: 10,
    permissionMode: 'default',
    agents: createAgentConfig([
      'code-reviewer',
      'bug-fixer',
      'test-runner',
      'doc-generator',
      'performance-analyzer',
      'security-auditor',
    ]),
    ...options,
  }
}

// ============================================================
// 멀티에이전트 파이프라인
// ============================================================

export interface PipelineStep {
  agentId: string
  input?: string
  dependsOn?: string[]
}

export interface AgentPipeline {
  id: string
  name: string
  nameKo: string
  description: string
  steps: PipelineStep[]
}

export const predefinedPipelines: AgentPipeline[] = [
  {
    id: 'code-quality',
    name: 'Code Quality Pipeline',
    nameKo: '코드 품질 파이프라인',
    description: '코드 리뷰 → 보안 감사 → 성능 분석',
    steps: [
      { agentId: 'code-reviewer', input: '코드 품질 검토' },
      { agentId: 'security-auditor', input: '보안 취약점 검사', dependsOn: ['code-reviewer'] },
      { agentId: 'performance-analyzer', input: '성능 분석', dependsOn: ['code-reviewer'] },
    ],
  },
  {
    id: 'feature-development',
    name: 'Feature Development Pipeline',
    nameKo: '기능 개발 파이프라인',
    description: 'API 설계 → 구현 → 테스트 → 문서화',
    steps: [
      { agentId: 'api-designer', input: 'API 설계' },
      { agentId: 'bug-fixer', input: '구현 및 버그 수정', dependsOn: ['api-designer'] },
      { agentId: 'test-runner', input: '테스트 실행', dependsOn: ['bug-fixer'] },
      { agentId: 'doc-generator', input: '문서 생성', dependsOn: ['test-runner'] },
    ],
  },
  {
    id: 'db-migration',
    name: 'Database Migration Pipeline',
    nameKo: 'DB 마이그레이션 파이프라인',
    description: 'DB 최적화 → 마이그레이션 → 검증',
    steps: [
      { agentId: 'db-optimizer', input: '스키마 검토 및 최적화' },
      { agentId: 'test-runner', input: '마이그레이션 테스트', dependsOn: ['db-optimizer'] },
    ],
  },
]

export function getPipelineById(id: string): AgentPipeline | undefined {
  return predefinedPipelines.find(p => p.id === id)
}
