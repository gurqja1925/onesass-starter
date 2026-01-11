/**
 * open-onesaas - 코딩 전문 에이전트
 * 프로그램 개발에 최적화된 AI 에이전트
 */

import { ToolCallAgent, type ToolCallAgentConfig } from './toolcall';
import { LLM, getDefaultLLM } from '../llm';
import { ToolCollection } from '../tools/base';
import {
  ReadFileTool, WriteFileTool, EditFileTool,
  ListDirectoryTool, CreateDirectoryTool,
  SearchFilesTool, DeleteFileTool
} from '../tools/file';
import { BashTool, GitTool, NpmTool, NodeExecuteTool, PythonExecuteTool } from '../tools/bash';
import { TerminateTool, ThinkTool, PlanningTool } from '../tools/terminate';
import {
  AVAILABLE_MODELS, setCurrentModel, getCurrentModel,
  getAvailableModels, getApiKey, type ModelInfo
} from '../models';

// ============================================================
// 코딩 에이전트 설정
// ============================================================

export interface CodingAgentConfig extends Partial<ToolCallAgentConfig> {
  /** 프로젝트 경로 */
  projectPath?: string;
  /** 사용할 모델 ID */
  modelId?: string;
  /** 프로그래밍 언어 */
  language?: 'typescript' | 'javascript' | 'python' | 'go' | 'rust' | 'java' | 'auto';
  /** 코딩 스타일 */
  style?: 'minimal' | 'verbose' | 'documented';
  /** 테스트 생성 여부 */
  generateTests?: boolean;
  /** 타입 체크 여부 */
  typeCheck?: boolean;
  /** Git 커밋 자동화 */
  autoCommit?: boolean;
}

// ============================================================
// 코딩 전문 에이전트
// ============================================================

export class CodingAgent extends ToolCallAgent {
  private projectPath: string;
  private language: string;
  private style: string;
  private generateTests: boolean;
  private typeCheck: boolean;
  private autoCommit: boolean;
  private selectedModel: ModelInfo;

  constructor(config: CodingAgentConfig = {}) {
    // 코딩 전용 도구 세트 생성
    const tools = createCodingToolset();

    super({
      name: config.name || 'CodingAgent',
      description: config.description || '프로그램 개발 전문 AI 에이전트',
      tools,
      maxSteps: config.maxSteps || 200,
      toolChoice: config.toolChoice,
    });

    this.projectPath = config.projectPath || process.cwd();
    this.language = config.language || 'auto';
    this.style = config.style || 'minimal';
    this.generateTests = config.generateTests ?? false;
    this.typeCheck = config.typeCheck ?? true;
    this.autoCommit = config.autoCommit ?? false;

    // 모델 선택
    if (config.modelId) {
      this.selectModel(config.modelId);
    }
    this.selectedModel = getCurrentModel();

    // 시스템 프롬프트 설정
    this.systemPrompt = this.getCodingSystemPrompt();
  }

  /**
   * 모델 선택
   */
  selectModel(modelId: string): boolean {
    const model = setCurrentModel(modelId);
    if (model) {
      this.selectedModel = model;
      // LLM 재생성 (다중 프로바이더 지원)
      const apiKey = getApiKey(model.provider);
      if (apiKey) {
        this.llm = new LLM({
          model: model.model,
          apiKey,
          maxTokens: model.maxTokens,
          baseUrl: model.baseUrl,
          provider: model.provider,
        });
        this.log('info', `모델 변경: ${model.name}`);
        return true;
      }
    }
    return false;
  }

  /**
   * 현재 선택된 모델 정보
   */
  getSelectedModel(): ModelInfo {
    return this.selectedModel;
  }

  /**
   * 사용 가능한 모델 목록
   */
  static getAvailableModels(): ModelInfo[] {
    return getAvailableModels();
  }

  /**
   * 모든 모델 목록 (API 키 유무 관계없이)
   */
  static getAllModels(): ModelInfo[] {
    return AVAILABLE_MODELS;
  }

  /**
   * 코딩에 추천되는 모델 목록
   */
  static getRecommendedModelsForCoding(): ModelInfo[] {
    // 코딩에 적합한 모델들
    return AVAILABLE_MODELS.filter(m =>
      m.capabilities.functionCalling && m.capabilities.reasoning
    );
  }

  /**
   * OneSaaS 전용 시스템 프롬프트
   */
  private getCodingSystemPrompt(): string {
    const languageHint = this.language !== 'auto'
      ? `주로 ${this.language}를 사용합니다.`
      : 'TypeScript/React를 기본으로 사용합니다.';

    const styleHint = {
      minimal: '최소한의 코드로 핵심 기능만 구현합니다.',
      verbose: '명확한 변수명과 상세한 로직을 작성합니다.',
      documented: '주석과 문서화를 포함한 코드를 작성합니다.',
    }[this.style];

    return `당신은 OneSaaS 프로젝트 전문 AI 개발자입니다.

## 🤖 핵심 원칙: 사용자 의도 우선 파악 (CRITICAL!)

**Step 1에서 즉시 판단하세요:**
1. 질문이 일반 대화/인사/자기소개인가?
   → 파일 읽지 말고 바로 terminate로 답변
2. 질문이 간단한 정보 요청인가?
   → 기존 지식으로 답변 가능하면 바로 terminate
3. 코딩/수정/파일 작업인가?
   → 아래 프로세스 실행

**즉시 답변 예시:**
- "너는 누구야?" / "안녕" / "hello" → terminate로 즉시 답변
- "네가 할 수 있는 게 뭐야?" / "뭘 도와줄 수 있어?" → 아래 능력 목록 안내 후 terminate
- "프로젝트가 뭐야?" → 기본 설명 후 terminate
- "오늘 날짜는?" → 알 수 없다고 답변 후 terminate

**능력 목록 답변 템플릿:**
저는 OneSaaS 프로젝트 전문 AI 개발자입니다. 다음과 같은 작업을 도와드릴 수 있습니다:

1. 🎨 UI/UX 개발
   - React 컴포넌트 생성/수정
   - 페이지 레이아웃 구성
   - Tailwind CSS 스타일링

2. ⚙️ 백엔드 개발
   - Next.js API 라우트 작성
   - Prisma 데이터베이스 스키마 설계
   - 서버 컴포넌트 구현

3. 🔍 코드 분석/리팩토링
   - 코드 리뷰
   - 버그 수정
   - 성능 최적화

4. 📝 문서 작성
   - README 작성
   - 주석 추가
   - API 문서화

5. 🛠️ 설정/도구
   - package.json 관리
   - TypeScript 설정
   - Git 작업

구체적인 작업을 말씀해주시면 바로 도와드리겠습니다!

**파일 작업 예시:**
- "로그인 페이지 만들어줘" → list_directory → read_file → write_file
- "버그 수정해줘" → search_files → read_file → edit_file
- "코드 리뷰해줘" → read_file → think → terminate

⚠️ 중요: 불필요한 파일 읽기는 토큰 낭비입니다!

## 🏗️ OneSaaS 프로젝트 구조
\`\`\`
<project>/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 홈페이지
│   │   ├── api/               # API 라우트
│   │   └── (routes)/          # 페이지 라우트
│   ├── components/            # React 컴포넌트
│   ├── lib/                   # 유틸리티
│   └── styles/                # 스타일
├── prisma/
│   └── schema.prisma          # DB 스키마
├── public/                    # 정적 파일
└── onesaas.json              # OneSaaS 설정
\`\`\`

## 🛠️ 기술 스택 (필수 숙지!)
- **프레임워크**: Next.js 16 App Router
- **언어**: TypeScript (strict mode)
- **스타일**: Tailwind CSS
- **데이터베이스**: Prisma + PostgreSQL (Supabase)
- **결제**: PortOne (한국형)
- **배포**: Vercel
- **패키지**: pnpm

## 📁 파일 정책 (중요!)
| 경로 | 정책 |
|------|------|
| \`onesaas-managed/**\` | ✅ 업데이트 가능 (시스템 파일) |
| \`onesaas-custom/**\` | ✅ 수정 가능 (고객 커스텀 영역) |
| \`onesaas-bridge/**\` | ✅ 충돌 최소화, 선택 적용 |
| \`.env\` | ⛔ 절대 덮어쓰기 금지! |
| \`prisma/schema.prisma\` | ⚠️ 주의해서 수정 |

## 프로젝트 정보
- 작업 디렉토리: ${this.projectPath}
- ${languageHint}
- 코딩 스타일: ${styleHint}
${this.generateTests ? '- 테스트 코드를 함께 생성합니다.' : ''}
${this.typeCheck ? '- 타입 안전성을 중요시합니다.' : ''}

## 🚨 필수 작업 순서

### 1단계: 프로젝트 분석
1. list_directory "." → 루트 구조 (onesaas.json 확인)
2. list_directory "src/app" → 페이지 구조
3. list_directory "src/components" → 컴포넌트 확인
4. search_files로 키워드 검색
5. 관련 파일 read_file로 읽기

### 2단계: OneSaaS 규칙 확인
- 기존 컴포넌트 패턴 따르기
- Tailwind CSS 클래스 사용
- onesaas-custom은 자유롭게 수정 가능

### 3단계: 코드 수정
- read_file로 전체 내용 파악 후 edit_file
- 새 파일은 write_file

## 📝 코딩 규칙
- **컴포넌트**: \`'use client'\` 또는 Server Component 명시
- **스타일**: Tailwind CSS 클래스 사용 (CSS 파일 생성 X)
- **API**: \`src/app/api/\` 에 Route Handler 작성
- **타입**: TypeScript strict, any 사용 금지
- **Import**: 절대 경로 \`@/\` 사용

## ❌ 금지 사항
- .env 파일 덮어쓰기 ❌
- write_file로 기존 파일 덮어쓰기 ❌
- 탐색 없이 바로 수정 ❌
- CSS 파일 생성 (Tailwind 사용) ❌

## 🚀 원스탑 가이드 (고객 안내용)

### 📝 코드 수정하기
\`\`\`bash
# 1. 개발 서버 실행
pnpm dev

# 2. http://localhost:3000 에서 확인
# 3. src/onesaas-custom/ 에서 자유롭게 수정
\`\`\`

### 💾 Git 커밋하기
\`\`\`bash
# 변경사항 확인
git status

# 모든 변경 스테이징
git add .

# 커밋 (한글 메시지 권장)
git commit -m "feat: 새 기능 추가"

# 원격 저장소에 푸시
git push
\`\`\`

### 🔄 프로젝트 업데이트
\`\`\`bash
# OneSaaS CLI로 최신 템플릿 적용
onesaas update

# 또는 수동으로
git fetch origin
git merge origin/main
\`\`\`

### 🌐 Vercel 배포하기
\`\`\`bash
# 방법 1: Git 푸시로 자동 배포
git push  # Vercel이 자동으로 빌드 & 배포

# 방법 2: Vercel CLI 직접 배포
vercel

# 방법 3: OneSaaS CLI
onesaas deploy
\`\`\`

### 🗄️ 데이터베이스 마이그레이션
\`\`\`bash
# 스키마 변경 후
pnpm db:push    # 개발용 (빠른 적용)
pnpm db:migrate # 프로덕션용 (마이그레이션 기록)
\`\`\`

### 🔧 환경변수 설정
\`\`\`bash
# 로컬: .env 파일 수정
# Vercel: 대시보드에서 Environment Variables 설정
# Supabase: Connection Pooling URL 사용
\`\`\`

완료되면 terminate로 결과를 보고하세요.`;
  }

  protected getDefaultSystemPrompt(): string {
    return this.getCodingSystemPrompt();
  }
}

// ============================================================
// 코딩 도구 세트
// ============================================================

function createCodingToolset(): ToolCollection {
  return new ToolCollection([
    // 파일 도구
    new ReadFileTool(),
    new WriteFileTool(),
    new EditFileTool(),
    new ListDirectoryTool(),
    new CreateDirectoryTool(),
    new SearchFilesTool(),
    new DeleteFileTool(),
    // 실행 도구
    new BashTool(),
    new GitTool(),
    new NpmTool(),
    new NodeExecuteTool(),
    new PythonExecuteTool(),
    // 제어 도구
    new TerminateTool(),
    new ThinkTool(),
    new PlanningTool(),
  ]);
}

// ============================================================
// 편의 함수
// ============================================================

/**
 * 코딩 에이전트로 작업 실행
 */
// 토큰 사용량 타입
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export async function runCodingTask(
  prompt: string,
  options: CodingAgentConfig & {
    onLog?: (log: { timestamp: string; level: string; message: string }) => void;
  } = {}
): Promise<{
  success: boolean;
  result: string;
  model: ModelInfo;
  logs: Array<{ timestamp: string; level: string; message: string }>;
  usage: TokenUsage;
}> {
  const agent = new CodingAgent(options);

  if (options.onLog) {
    agent.setLogHandler(options.onLog);
  }

  try {
    const result = await agent.run(prompt);
    return {
      success: true,
      result,
      model: agent.getSelectedModel(),
      logs: agent.getLogs(),
      usage: agent.getTokenUsage(),
    };
  } catch (error) {
    return {
      success: false,
      result: error instanceof Error ? error.message : 'Unknown error',
      model: agent.getSelectedModel(),
      logs: agent.getLogs(),
      usage: agent.getTokenUsage(),
    };
  }
}

/**
 * 특정 모델로 코딩 작업 실행
 */
export async function runCodingTaskWithModel(
  prompt: string,
  modelId: string,
  options: Omit<CodingAgentConfig, 'modelId'> = {}
): Promise<{
  success: boolean;
  result: string;
  model: ModelInfo;
}> {
  return runCodingTask(prompt, { ...options, modelId });
}

/**
 * 여러 모델로 동시에 코딩 작업 실행 (비교용)
 */
export async function runCodingTaskWithMultipleModels(
  prompt: string,
  modelIds: string[],
  options: Omit<CodingAgentConfig, 'modelId'> = {}
): Promise<Array<{
  modelId: string;
  success: boolean;
  result: string;
  model: ModelInfo;
}>> {
  const results = await Promise.allSettled(
    modelIds.map(modelId => runCodingTask(prompt, { ...options, modelId }))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return {
        modelId: modelIds[index],
        ...result.value,
      };
    } else {
      return {
        modelId: modelIds[index],
        success: false,
        result: result.reason?.message || 'Unknown error',
        model: AVAILABLE_MODELS.find(m => m.id === modelIds[index]) || AVAILABLE_MODELS[0],
      };
    }
  });
}
