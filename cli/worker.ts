/**
 * 인터랙티브 모드용 Worker
 * 실시간 로그 전송 지원
 */
import { config } from 'dotenv';
config(); // .env 파일 로드

import { parentPort, workerData } from 'worker_threads';
import { runCodingTask } from './agent/coding';
import { LLM } from './llm';
import { AVAILABLE_MODELS, getApiKey } from './models';

interface PipelineStage {
  role: string;
  maxSteps: number;
  promptTemplate: (input: string, prevResult?: string) => string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    role: '분석/설계',
    maxSteps: 3,
    promptTemplate: (input) => `요청을 분석하세요. 도구 사용 없이 텍스트로만 응답.

요청: ${input}

간결하게 작성:
1. 핵심 요구사항 (3줄 이내)
2. 구현 파일 목록
3. 구현 순서

바로 terminate로 분석 결과 반환.`,
  },
  {
    role: '구현',
    maxSteps: 15,
    promptTemplate: (input, prevResult) => `계획대로 코드 구현:

[요청] ${input}

[계획]
${prevResult}

파일 작성 후 즉시 terminate로 완료 보고.`,
  },
  {
    role: '검토',
    maxSteps: 5,
    promptTemplate: (input, prevResult) => `작성된 코드를 빠르게 검토하세요.

[이전 결과]
${prevResult}

검토 항목:
- 명백한 버그만 수정 (있으면)
- 불필요한 코드 제거 (있으면)

수정할 게 없으면 바로 terminate.
수정했으면 즉시 terminate.`,
  },
];

const DEV_PIPELINE_STAGES: PipelineStage[] = [
  {
    role: '분석',
    maxSteps: 3,
    promptTemplate: (input) => `요청을 분석하세요. 도구 사용 없이 텍스트로만 응답.

요청: ${input}

간결하게 작성:
1. 핵심 요구사항
2. 제약/주의사항
3. 영향을 받는 영역

바로 terminate로 분석 결과 반환.`,
  },
  {
    role: '설계',
    maxSteps: 3,
    promptTemplate: (input, prevResult) => `분석 결과를 바탕으로 설계안을 작성하세요. 도구 사용 없이 텍스트로만 응답.

[요청] ${input}

[분석]
${prevResult}

간결하게 작성:
1. 변경/추가 파일 목록
2. 컴포넌트/함수 구조
3. 데이터 흐름

바로 terminate로 설계 결과 반환.`,
  },
  {
    role: '개발',
    maxSteps: 5,
    promptTemplate: (input, prevResult) => `설계에 따라 작업 계획을 작성하세요. 도구 사용 없이 텍스트로만 응답.

[요청] ${input}

[설계]
${prevResult}

간결하게 작성:
1. 구현 순서
2. 세부 작업 체크리스트

바로 terminate로 계획 반환.`,
  },
  {
    role: '구현',
    maxSteps: 15,
    promptTemplate: (input, prevResult) => `계획대로 코드 구현:

[요청] ${input}

[계획]
${prevResult}

파일 작성 후 즉시 terminate로 완료 보고.`,
  },
  {
    role: '테스트',
    maxSteps: 5,
    promptTemplate: (input, prevResult) => `작성된 코드를 검증하세요.

[이전 결과]
${prevResult}

검토 항목:
- 명백한 버그 수정 (있으면)
- 필요한 테스트 코드 추가 (있으면)
- 불필요한 코드 제거 (있으면)

수정할 게 없으면 바로 terminate.
수정했으면 즉시 terminate.`,
  },
];

type ReasonerDecision = {
  pipeline: 'dev' | 'standard';
  plan: string;
  guide: string;
  priorityFiles: string[];
};

function parseReasonerDecision(raw: string): ReasonerDecision | null {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    const data = JSON.parse(jsonMatch[0]);
    if (data && (data.pipeline === 'dev' || data.pipeline === 'standard') && data.plan) {
      return {
        pipeline: data.pipeline,
        plan: String(data.plan),
        guide: String(data.guide || ''),
        priorityFiles: Array.isArray(data.priority_files)
          ? data.priority_files.map((item: unknown) => String(item))
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
- pipeline: "dev" 또는 "standard"
- dev: 기능 개발/구현/수정이 포함된 요청
- standard: 정보 제공/설명/분석/리뷰 중심 요청
- plan: 구현/응답 계획 요약 (불릿 3~6개)
- guide: 사용자가 기대하는 출력/결과 가이드 (짧게)
- priority_files: 먼저 읽어야 할 핵심 문서 경로 3~7개 (중요도 순)

출력 예시:
{
  "pipeline": "dev",
  "plan": "- ...",
  "guide": "...",
  "priority_files": ["README.md", "onesaas.json"]
}`;

  const response = await llm.ask([{ role: 'user', content: prompt }]);
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

async function runPipeline(prompt: string, modelId: string, reasonerContext?: string) {
  let prevResult = '';
  const totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    const stage = PIPELINE_STAGES[i];
    const stagePrompt = `${reasonerContext ? reasonerContext + '\n\n' : ''}${stage.promptTemplate(prompt, prevResult)}`;
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
    totalUsage.promptTokens += result.usage.promptTokens;
    totalUsage.completionTokens += result.usage.completionTokens;
    totalUsage.totalTokens += result.usage.totalTokens;
  }

  return { success: true, result: prevResult, usage: totalUsage };
}

async function runDevPipeline(prompt: string, modelId: string, reasonerContext?: string) {
  let prevResult = '';
  const totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  for (let i = 0; i < DEV_PIPELINE_STAGES.length; i++) {
    const stage = DEV_PIPELINE_STAGES[i];
    const stagePrompt = `${reasonerContext ? reasonerContext + '\n\n' : ''}${stage.promptTemplate(prompt, prevResult)}`;
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
    totalUsage.promptTokens += result.usage.promptTokens;
    totalUsage.completionTokens += result.usage.completionTokens;
    totalUsage.totalTokens += result.usage.totalTokens;
  }

  return { success: true, result: prevResult, usage: totalUsage };
}

if (parentPort) {
  const { prompt, modelId } = workerData;

  const runner = (async () => {
    const decision = await getReasonerDecision(prompt);
    const reasonerContext = decision
      ? `[리지너 계획]\n${decision.plan}\n\n[리지너 가이드]\n${decision.guide}\n\n[리지너 우선 문서]\n${decision.priorityFiles.join('\n')}`
      : '';

    if (decision?.pipeline === 'dev') {
      return runDevPipeline(prompt, modelId, reasonerContext);
    }
    return runPipeline(prompt, modelId, reasonerContext);
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
