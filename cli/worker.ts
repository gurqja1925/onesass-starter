/**
 * 인터랙티브 모드용 Worker
 * 실시간 로그 전송 지원
 */
import { config } from 'dotenv';
config(); // .env 파일 로드

import { parentPort, workerData } from 'worker_threads';
import { runCodingTask } from './agent/coding';

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

function isDevPrompt(text: string): boolean {
  return /개발/.test(text);
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

async function runPipeline(prompt: string, modelId: string) {
  let prevResult = '';
  const totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    const stage = PIPELINE_STAGES[i];
    const stagePrompt = stage.promptTemplate(prompt, prevResult);
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

async function runDevPipeline(prompt: string, modelId: string) {
  let prevResult = '';
  const totalUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  for (let i = 0; i < DEV_PIPELINE_STAGES.length; i++) {
    const stage = DEV_PIPELINE_STAGES[i];
    const stagePrompt = stage.promptTemplate(prompt, prevResult);
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

  const runner = isDevPrompt(prompt) ? runDevPipeline(prompt, modelId) : runPipeline(prompt, modelId);

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
