/**
 * 인터랙티브 모드용 Worker
 * 실시간 로그 전송 지원
 */
import { config } from 'dotenv';
config(); // .env 파일 로드

import { parentPort, workerData } from 'worker_threads';
import { runCodingTask } from './agent/coding';
import { LLM } from './llm';
import { AVAILABLE_MODELS, getApiKey, getBestAvailableModel } from './models';
import { Role } from './types';

interface PipelineStage {
  role: string;
  maxSteps: number;
  promptTemplate: (input: string, prevResult?: string) => string;
}

function getPipelineStages(): PipelineStage[] {
  return [
    {
      role: '분석/설계',
      maxSteps: 30,
      promptTemplate: (input) => `요청을 분석하세요. 도구 사용 없이 텍스트로만 응답.

요청: ${input}

TODO를 참고하고 이번 단계에 해당하는 항목만 수행하세요.

간결하게 작성:
1. 핵심 요구사항 (3줄 이내)
2. 구현 파일 목록
3. 구현 순서

바로 terminate로 분석 결과 반환.`,
    },
    {
      role: '구현',
      maxSteps: 100,
      promptTemplate: (input, prevResult) => `계획대로 코드 구현:

[요청] ${input}

[계획]
${prevResult}

TODO를 참고하고 이번 단계에 해당하는 항목만 수행하세요.

파일 작성 후 즉시 terminate로 완료 보고.`,
    },
    {
      role: '검토',
      maxSteps: 50,
      promptTemplate: (input, prevResult) => `작성된 코드를 빠르게 검토하고 빌드 에러가 있으면 수정하세요.

[이전 결과]
${prevResult}

TODO를 참고하고 이번 단계에 해당하는 항목만 수행하세요.

**중요: 우선순위**
1. 먼저 빌드 실행 (pnpm build)
2. 빌드 에러 있으면 즉시 수정
3. 에러 없으면 바로 terminate로 완료 보고

검토 항목:
- 빌드 에러 수정 (최우선)
- 명백한 버그만 수정 (있으면)
- 불필요한 코드 제거 (있으면)

빌드 성공하면 즉시 terminate.`,
    },
  ];
}

function getDevPipelineStages(): PipelineStage[] {
  return [
  {
    role: '분석',
    maxSteps: 30,
    promptTemplate: (input) => `요청을 분석하세요. 도구 사용 없이 텍스트로만 응답.

요청: ${input}

TODO를 참고하고 이번 단계에 해당하는 항목만 수행하세요.

간결하게 작성:
1. 핵심 요구사항
2. 제약/주의사항
3. 영향을 받는 영역

바로 terminate로 분석 결과 반환.`,
  },
  {
    role: '설계',
    maxSteps: 30,
    promptTemplate: (input, prevResult) => `분석 결과를 바탕으로 설계안을 작성하세요. 도구 사용 없이 텍스트로만 응답.

[요청] ${input}

[분석]
${prevResult}

TODO를 참고하고 이번 단계에 해당하는 항목만 수행하세요.

간결하게 작성:
1. 변경/추가 파일 목록
2. 컴포넌트/함수 구조
3. 데이터 흐름

바로 terminate로 설계 결과 반환.`,
  },
  {
    role: '개발',
    maxSteps: 30,
    promptTemplate: (input, prevResult) => `설계에 따라 작업 계획을 작성하세요. 도구 사용 없이 텍스트로만 응답.

[요청] ${input}

[설계]
${prevResult}

TODO를 참고하고 이번 단계에 해당하는 항목만 수행하세요.

간결하게 작성:
1. 구현 순서
2. 세부 작업 체크리스트

바로 terminate로 계획 반환.`,
  },
  {
    role: '구현',
    maxSteps: 100,
    promptTemplate: (input, prevResult) => `계획대로 코드 구현:

[요청] ${input}

[계획]
${prevResult}

TODO를 참고하고 이번 단계에 해당하는 항목만 수행하세요.

파일 작성 후 즉시 terminate로 완료 보고.`,
  },
  {
    role: '테스트',
    maxSteps: 50,
    promptTemplate: (input, prevResult) => `작성된 코드를 검증하고 빌드 에러가 있으면 수정하세요.

[이전 결과]
${prevResult}

TODO를 참고하고 이번 단계에 해당하는 항목만 수행하세요.

**중요: 우선순위**
1. 먼저 빌드 실행 (pnpm build)
2. 빌드 에러 있으면 즉시 수정
3. 에러 없으면 바로 terminate로 완료 보고

검토 항목:
- 빌드 에러 수정 (최우선)
- 명백한 버그 수정 (있으면)
- 필요한 테스트 코드 추가 (있으면)
- 불필요한 코드 제거 (있으면)

빌드 성공하면 즉시 terminate.`,
    },
  ];
}

type ReasonerDecision = {
  pipeline: 'dev' | 'standard' | 'single';
  plan: string;
  guide: string;
  priorityFiles: string[];
  todo: string[];
};

// ============================================================
// TODO 추적 시스템
// ============================================================

class TodoTracker {
  private todos: Array<{ item: string; completed: boolean }> = [];
  private onUpdate?: (progress: string) => void;

  constructor(todoList: string[], onUpdate?: (progress: string) => void) {
    this.todos = todoList.map(item => ({ item, completed: false }));
    this.onUpdate = onUpdate;
    this.logProgress();
  }

  /**
   * TODO 항목 완료 체크 (LLM 응답에서 파싱)
   */
  checkCompletion(responseText: string): void {
    const lowerText = responseText.toLowerCase();

    this.todos.forEach((todo, idx) => {
      if (!todo.completed) {
        const keywords = todo.item.toLowerCase().split(' ');
        // 3개 이상의 키워드가 응답에 포함되어 있으면 완료로 간주
        const matchCount = keywords.filter(kw => kw.length > 2 && lowerText.includes(kw)).length;
        if (matchCount >= Math.min(3, keywords.length)) {
          todo.completed = true;
        }
      }
    });

    this.logProgress();
  }

  /**
   * 명시적 완료 마킹
   */
  markCompleted(indices: number[]): void {
    indices.forEach(idx => {
      if (this.todos[idx]) {
        this.todos[idx].completed = true;
      }
    });
    this.logProgress();
  }

  /**
   * 진행률 로깅
   */
  private logProgress(): void {
    const completed = this.todos.filter(t => t.completed).length;
    const total = this.todos.length;
    const progress = `📊 TODO 진행: ${completed}/${total} 완료`;

    if (this.onUpdate) {
      this.onUpdate(progress);
    }
  }

  /**
   * 미완료 항목 반환
   */
  getIncomplete(): string[] {
    return this.todos.filter(t => !t.completed).map(t => t.item);
  }

  /**
   * 완료율 반환
   */
  getCompletionRate(): number {
    if (this.todos.length === 0) return 1.0;
    const completed = this.todos.filter(t => t.completed).length;
    return completed / this.todos.length;
  }

  /**
   * 전체 완료 여부
   */
  isAllCompleted(): boolean {
    return this.todos.every(t => t.completed);
  }

  /**
   * 상태 요약
   */
  getSummary(): string {
    const completed = this.todos.filter(t => t.completed).length;
    const total = this.todos.length;
    const incomplete = this.getIncomplete();

    let summary = `\n━━━ TODO 완료 현황 ━━━\n`;
    summary += `완료: ${completed}/${total} (${Math.round(this.getCompletionRate() * 100)}%)\n\n`;

    if (incomplete.length > 0) {
      summary += `⚠️  미완료 항목:\n`;
      incomplete.forEach((item, idx) => {
        summary += `  ${idx + 1}. ${item}\n`;
      });
    } else {
      summary += `✅ 모든 TODO 완료!\n`;
    }

    return summary;
  }
}

function parseReasonerDecision(raw: string): ReasonerDecision | null {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    const data = JSON.parse(jsonMatch[0]);
    if (data && (data.pipeline === 'dev' || data.pipeline === 'standard' || data.pipeline === 'single') && data.plan) {
      return {
        pipeline: data.pipeline,
        plan: String(data.plan),
        guide: String(data.guide || ''),
        priorityFiles: Array.isArray(data.priority_files)
          ? data.priority_files.map((item: unknown) => String(item))
          : [],
        todo: Array.isArray(data.todo)
          ? data.todo.map((item: unknown) => String(item))
          : [],
      };
    }
  } catch {}
  return null;
}

async function getReasonerDecision(text: string): Promise<ReasonerDecision | null> {
  const model = AVAILABLE_MODELS.find(m => m.id === 'deepseek-reasoner');
  const apiKey = getApiKey('deepseek');
  if (!model || !apiKey) return null;

  const llm = new LLM({
    model: model.model,
    apiKey,
    maxTokens: model.maxTokens,
    baseUrl: model.baseUrl,
    provider: model.provider,
  });

  const prompt = `당신은 요청 의도를 분류하고 계획/가이드를 작성하는 에이전트입니다.
다음 요청을 읽고 JSON만 반환하세요.

요청: ${text}

규칙:
- pipeline: "dev" 또는 "standard" 또는 "single"
- dev: 기능 개발/구현/수정이 포함된 요청
- standard: 복잡한 작업으로 분석→구현→검토가 필요한 요청
- single: 단순 작업/간단 요청/짧은 변경
- plan: 구현/응답 계획 요약 (불릿 3~6개)
- guide: 사용자가 기대하는 출력/결과 가이드 (짧게)
- priority_files: 먼저 읽어야 할 핵심 문서 경로 3~7개 (중요도 순)
- todo: 단계별 체크리스트 5~10개 (항목은 짧게)

출력 예시:
{
  "pipeline": "single",
  "plan": "- ...",
  "guide": "...",
  "priority_files": ["README.md", "onesaas.json"],
  "todo": ["요구사항 요약", "관련 파일 확인"]
}`;

  const response = await llm.ask([{ role: Role.USER, content: prompt }]);
  if (!response.content) return null;
  return parseReasonerDecision(response.content);
}

function postLog(message: string, level: 'info' | 'warning' | 'error' | 'debug' = 'info') {
  parentPort?.postMessage({
    type: 'log',
    log: {
      timestamp: new Date().toISOString(),
      level,
      message,
    },
  });
}

async function runPipeline(prompt: string, modelId: string, reasonerContext?: string, todoList?: string[]) {
  const PIPELINE_STAGES = getPipelineStages();
  let prevResult = '';
  const totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  // TODO 추적 시작
  const todoTracker = todoList && todoList.length > 0
    ? new TodoTracker(todoList, postLog)
    : null;

  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    const stage = PIPELINE_STAGES[i];

    // TODO 진행 상황을 프롬프트에 추가
    let todoContext = '';
    if (todoTracker) {
      const incomplete = todoTracker.getIncomplete();
      if (incomplete.length > 0) {
        todoContext = `\n\n[미완료 TODO]\n${incomplete.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}\n`;
      }
    }

    const stagePrompt = `${reasonerContext ? reasonerContext + '\n\n' : ''}${todoContext}${stage.promptTemplate(prompt, prevResult)}`;
    postLog(`[${stage.role}] 시작 (${i + 1}/${PIPELINE_STAGES.length})`);

    const result = await runCodingTask(stagePrompt, {
      modelId,
      maxSteps: stage.maxSteps,
      onLog: (log) => {
        postLog(`[${stage.role}] ${log.message}`);
      },
    });

    if (!result.success) {
      return { success: false, result: result.result, usage: totalUsage };
    }

    prevResult = result.result;

    // TODO 완료 체크
    if (todoTracker) {
      todoTracker.checkCompletion(result.result);
    }

    totalUsage.promptTokens += result.usage.promptTokens;
    totalUsage.completionTokens += result.usage.completionTokens;
    totalUsage.totalTokens += result.usage.totalTokens;
  }

  // 최종 TODO 요약
  if (todoTracker) {
    const summary = todoTracker.getSummary();
    postLog(summary);

    // 미완료 항목이 있으면 경고
    if (!todoTracker.isAllCompleted()) {
      postLog('⚠️  일부 TODO가 미완료 상태입니다.');
    }
  }

  return { success: true, result: prevResult, usage: totalUsage };
}

async function runDevPipeline(prompt: string, modelId: string, reasonerContext?: string, todoList?: string[]) {
  const DEV_PIPELINE_STAGES = getDevPipelineStages();
  let prevResult = '';
  const totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  // TODO 추적 시작
  const todoTracker = todoList && todoList.length > 0
    ? new TodoTracker(todoList, postLog)
    : null;

  for (let i = 0; i < DEV_PIPELINE_STAGES.length; i++) {
    const stage = DEV_PIPELINE_STAGES[i];

    // TODO 진행 상황을 프롬프트에 추가
    let todoContext = '';
    if (todoTracker) {
      const incomplete = todoTracker.getIncomplete();
      if (incomplete.length > 0) {
        todoContext = `\n\n[미완료 TODO]\n${incomplete.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}\n`;
      }
    }

    const stagePrompt = `${reasonerContext ? reasonerContext + '\n\n' : ''}${todoContext}${stage.promptTemplate(prompt, prevResult)}`;
    postLog(`[${stage.role}] 시작 (${i + 1}/${DEV_PIPELINE_STAGES.length})`);

    const result = await runCodingTask(stagePrompt, {
      modelId,
      maxSteps: stage.maxSteps,
      onLog: (log) => {
        postLog(`[${stage.role}] ${log.message}`);
      },
    });

    if (!result.success) {
      return { success: false, result: result.result, usage: totalUsage };
    }

    prevResult = result.result;

    // TODO 완료 체크
    if (todoTracker) {
      todoTracker.checkCompletion(result.result);
    }

    totalUsage.promptTokens += result.usage.promptTokens;
    totalUsage.completionTokens += result.usage.completionTokens;
    totalUsage.totalTokens += result.usage.totalTokens;
  }

  // 최종 TODO 요약
  if (todoTracker) {
    const summary = todoTracker.getSummary();
    postLog(summary);

    // 미완료 항목이 있으면 경고
    if (!todoTracker.isAllCompleted()) {
      postLog('⚠️  일부 TODO가 미완료 상태입니다.');
    }
  }

  return { success: true, result: prevResult, usage: totalUsage };
}

if (parentPort) {
  const { prompt, modelId } = workerData;

  const runner = (async () => {
    postLog('📋 리지너 분석 중...');
    const decision = await getReasonerDecision(prompt);

    // 리지너 분석 결과 로그
    if (decision) {
      postLog(`📋 파이프라인: ${decision.pipeline}`);
      postLog(`📋 계획: ${decision.plan.slice(0, 80)}...`);
      if (decision.priorityFiles.length > 0) {
        postLog(`📋 우선 문서: ${decision.priorityFiles.slice(0, 3).join(', ')}`);
      }
    }

    const reasonerContext = decision
      ? `[리지너 계획]\n${decision.plan}\n\n[리지너 가이드]\n${decision.guide}\n\n[리지너 우선 문서]\n${decision.priorityFiles.join('\n')}\n\n[리지너 TODO]\n${decision.todo.join('\n')}`
      : '';

    postLog('🚀 작업 시작...');

    const todoList = decision?.todo || [];

    if (decision?.pipeline === 'dev') {
      return runDevPipeline(prompt, modelId, reasonerContext, todoList);
    }
    if (decision?.pipeline === 'single') {
      return runCodingTask(prompt, {
        modelId,
        maxSteps: 200,
        onLog: (log) => {
          postLog(log.message, log.level as 'info' | 'warning' | 'error' | 'debug');
        },
        ...(reasonerContext ? { systemPrompt: reasonerContext } : {}),
      });
    }
    return runPipeline(prompt, modelId, reasonerContext, todoList);
  })();

  runner
    .then(result => {
      parentPort!.postMessage({
        type: 'done',
        success: result.success,
        result: result.result,
        usage: result.usage,
      });
    })
    .catch(err => {
      parentPort!.postMessage({
        type: 'done',
        success: false,
        result: err.message,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      });
    });
}
