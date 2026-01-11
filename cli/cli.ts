/**
 * K 코드 (K Code) CLI
 * 한국어 특화 AI 코딩 에이전트
 *
 * 사용법:
 *   kcode "작업 내용"              단일 작업 (기본: 파이프라인)
 *   kcode "작업" --pipe            파이프라인 (분석→구현→검토)
 *   kcode -i                       인터랙티브 모드
 *   kcode --list                   모델 목록
 */

import { config } from 'dotenv';
config(); // .env 파일 로드

import { CodingAgent, runCodingTask, type TokenUsage } from './agent/coding';
import { AVAILABLE_MODELS, getApiKey, saveApiKey } from './models';
import type { TaskLog } from './types';
import { createRequire } from 'module';
import * as fs from 'fs';
import * as path from 'path';
import { runInkDashboard } from './dashboard';
import { ensureProjectStorageDir, getProjectStorageDir } from './storage';

// 버전 정보
const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const VERSION = pkg.version;

// 색상 (맨 위에 정의)
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

// ============================================================
// 시작 시 검사
// ============================================================

async function checkApiKey(): Promise<boolean> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log(`
${c.red}╔═══════════════════════════════════════════════════════════╗
║  DEEPSEEK_API_KEY가 설정되지 않았습니다                   ║
╚═══════════════════════════════════════════════════════════╝${c.reset}

${c.bold}설정 방법:${c.reset}

1. CLI에서 설정 (권장):
   ${c.cyan}kcode --key YOUR_API_KEY${c.reset}

2. 환경변수로 설정:
   ${c.cyan}export DEEPSEEK_API_KEY="your-api-key"${c.reset}

${c.dim}API 키는 https://platform.deepseek.com 에서 발급받을 수 있습니다.${c.reset}
`);
    return false;
  }
  return true;
}

import { execSync } from 'child_process';

async function getLatestVersion(): Promise<string | null> {
  try {
    const res = await fetch('https://npm.pkg.github.com/@johunsang/open-onesaas/latest', {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      return data.version || null;
    }
  } catch {}
  return null;
}

async function checkVersion(): Promise<void> {
  const latestVersion = await getLatestVersion();
  if (latestVersion && latestVersion !== VERSION) {
    console.log(`${c.yellow}⚡ 새 버전 ${latestVersion} 사용 가능 (현재: ${VERSION})${c.reset}`);
    console.log(`${c.dim}   kcode --update 로 업데이트${c.reset}\n`);
  }
}

async function autoUpdate(): Promise<void> {
  console.log(`${c.cyan}🔄 업데이트 확인 중...${c.reset}`);

  const latestVersion = await getLatestVersion();

  if (!latestVersion) {
    console.log(`${c.red}✕${c.reset} 버전 확인 실패`);
    return;
  }

  if (latestVersion === VERSION) {
    console.log(`${c.green}✓${c.reset} 이미 최신 버전입니다 (v${VERSION})`);
    return;
  }

  console.log(`${c.yellow}⚡${c.reset} 새 버전 발견: ${VERSION} → ${latestVersion}`);
  console.log(`${c.cyan}📦 업데이트 설치 중...${c.reset}\n`);

  try {
    // npm 또는 pnpm으로 글로벌 업데이트
    execSync('npm install -g @johunsang/open-onesaas@latest', { stdio: 'inherit' });
    console.log(`\n${c.green}✓${c.reset} 업데이트 완료! v${latestVersion}`);
    console.log(`${c.dim}  kcode 를 다시 실행하세요${c.reset}`);
  } catch {
    console.log(`\n${c.red}✕${c.reset} 업데이트 실패`);
    console.log(`${c.dim}  수동 설치: npm install -g @johunsang/open-onesaas@latest${c.reset}`);
  }
}

function printBanner(): void {
  const ver = `v${VERSION}`;
  console.log(`
${c.cyan}╔════════════════════════════════════════════╗
║                                            ║
║   ${c.bold}${c.yellow} K ${c.reset}${c.bold}코드${c.reset}${c.cyan}  ${c.dim}(K Code)${c.reset}${c.cyan}   ${c.green}${ver.padEnd(8)}${c.reset}${c.cyan}       ║
║                                            ║
║   ${c.reset}한국어 특화 AI 코딩 에이전트${c.cyan}           ║
║                                            ║
╚════════════════════════════════════════════╝${c.reset}
`);
}

// 환율 (USD -> KRW)
const USD_TO_KRW = 1450;

// 비용 계산 (DeepSeek V3 기준: $0.27/M input, $1.10/M output)
function calculateCost(usage: TokenUsage): number {
  const inputCost = (usage.promptTokens / 1_000_000) * 0.27;
  const outputCost = (usage.completionTokens / 1_000_000) * 1.10;
  return inputCost + outputCost;
}

// 비용을 원화로 포맷
function formatCostKRW(usdCost: number): string {
  const krw = Math.round(usdCost * USD_TO_KRW);
  return krw.toLocaleString('ko-KR') + '원';
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

// ============================================================
// 진행 상태 표시
// ============================================================

interface AgentProgress {
  modelId: string;
  modelName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  currentStep: number;
  maxSteps: number;
  lastMessage: string;
  result?: string;
  error?: string;
  logs: TaskLog[];
}

class ProgressDisplay {
  private agents: Map<string, AgentProgress> = new Map();
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private lastRenderLines = 0;

  addAgent(modelId: string, modelName: string, maxSteps: number) {
    this.agents.set(modelId, {
      modelId,
      modelName,
      status: 'pending',
      currentStep: 0,
      maxSteps,
      lastMessage: '대기중...',
      logs: [],
    });
  }

  updateAgent(modelId: string, update: Partial<AgentProgress>) {
    const agent = this.agents.get(modelId);
    if (agent) {
      Object.assign(agent, update);
      this.render();
    }
  }

  addLog(modelId: string, log: TaskLog) {
    const agent = this.agents.get(modelId);
    if (agent) {
      agent.logs.push(log);
      // Step 추출
      const stepMatch = log.message.match(/Step (\d+)\/(\d+)/);
      if (stepMatch) {
        agent.currentStep = parseInt(stepMatch[1]);
        agent.maxSteps = parseInt(stepMatch[2]);
      }
      agent.lastMessage = log.message.slice(0, 50);
      this.render();
    }
  }

  start() {
    this.render();
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    // 최종 상태 출력
    console.log('\n');
  }

  private render() {
    // 이전 출력 지우기
    if (this.lastRenderLines > 0) {
      process.stdout.write(`\x1b[${this.lastRenderLines}A\x1b[0J`);
    }

    const lines: string[] = [];
    lines.push('');
    lines.push(`${c.bold}${c.cyan}[ AI 에이전트 실행 중 ]${c.reset}`);
    lines.push('');

    for (const [, agent] of this.agents) {
      const statusIcon = {
        pending: `${c.gray}○${c.reset}`,
        running: `${c.yellow}◐${c.reset}`,
        completed: `${c.green}●${c.reset}`,
        failed: `${c.red}✕${c.reset}`,
      }[agent.status];

      // 프로그레스 바
      const progress = agent.maxSteps > 0 ? agent.currentStep / agent.maxSteps : 0;
      const barWidth = 20;
      const filled = Math.round(progress * barWidth);
      const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);

      const modelLabel = agent.modelName.padEnd(16);
      const percent = Math.round(progress * 100).toString().padStart(3);

      lines.push(
        `${statusIcon} ${c.bold}${modelLabel}${c.reset} [${c.cyan}${bar}${c.reset}] ${percent}%`
      );
      lines.push(`  ${c.dim}${agent.lastMessage}${c.reset}`);
    }

    lines.push('');
    this.lastRenderLines = lines.length;

    console.log(lines.join('\n'));
  }
}

// ============================================================
// 단일 모델 실행
// ============================================================

async function runSingle(prompt: string, modelId: string) {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  if (!model) {
    console.log(`${c.red}✕${c.reset} 모델을 찾을 수 없습니다: ${modelId}`);
    process.exit(1);
  }

  const apiKey = getApiKey(model.provider);
  if (!apiKey) {
    console.log(`${c.red}✕${c.reset} DEEPSEEK_API_KEY가 필요합니다`);
    console.log(`${c.dim}  export DEEPSEEK_API_KEY=your-api-key${c.reset}`);
    process.exit(1);
  }

  console.log(`\n${c.cyan}▶${c.reset} ${c.bold}${model.name}${c.reset} 실행 중...\n`);

  const startTime = Date.now();

  const result = await runCodingTask(prompt, {
    modelId,
    onLog: (log) => {
      const icon = {
        info: `${c.blue}ℹ${c.reset}`,
        warning: `${c.yellow}⚠${c.reset}`,
        error: `${c.red}✕${c.reset}`,
        debug: `${c.gray}·${c.reset}`,
      }[log.level] || '·';
      console.log(`${icon} ${log.message}`);
    },
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('');
  if (result.success) {
    console.log(`${c.green}╔═══════════════════════════════════════╗${c.reset}`);
    console.log(`${c.green}║${c.reset} ${c.bold}완료!${c.reset}                               ${c.green}║${c.reset}`);
    console.log(`${c.green}║${c.reset} 모델: ${model.name.padEnd(26)} ${c.green}║${c.reset}`);
    console.log(`${c.green}║${c.reset} 시간: ${elapsed}초                          ${c.green}║${c.reset}`);
    console.log(`${c.green}╚═══════════════════════════════════════╝${c.reset}`);
    console.log(`\n${c.dim}${result.result}${c.reset}`);
  } else {
    console.log(`${c.red}✕${c.reset} 실패: ${result.result}`);
    process.exit(1);
  }
}

// ============================================================
// 파이프라인 실행 (V3 → V3 → V3)
// ============================================================

interface PipelineStage {
  modelId: string;
  role: string;
  maxSteps: number; // 단계별 최대 스텝
  promptTemplate: (input: string, prevResult?: string) => string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    modelId: 'deepseek',
    role: '분석/설계',
    maxSteps: 3, // 분석은 빠르게
    promptTemplate: (input) => `요청을 분석하세요. 도구 사용 없이 텍스트로만 응답.

요청: ${input}

간결하게 작성:
1. 핵심 요구사항 (3줄 이내)
2. 구현 파일 목록
3. 구현 순서

바로 terminate로 분석 결과 반환.`,
  },
  {
    modelId: 'deepseek',
    role: '구현',
    maxSteps: 15, // 구현은 충분히
    promptTemplate: (input, prevResult) => `계획대로 코드 구현:

[요청] ${input}

[계획]
${prevResult}

파일 작성 후 즉시 terminate로 완료 보고.`,
  },
  {
    modelId: 'deepseek',
    role: '검토',
    maxSteps: 5, // 검토는 빠르게
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

// 개발 전용 파이프라인 (분석 → 설계 → 개발 → 구현 → 테스트)
const DEV_PIPELINE_STAGES: PipelineStage[] = [
  {
    modelId: 'deepseek',
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
    modelId: 'deepseek',
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
    modelId: 'deepseek',
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
    modelId: 'deepseek',
    role: '구현',
    maxSteps: 15,
    promptTemplate: (input, prevResult) => `계획대로 코드 구현:

[요청] ${input}

[계획]
${prevResult}

파일 작성 후 즉시 terminate로 완료 보고.`,
  },
  {
    modelId: 'deepseek',
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

async function runPipeline(prompt: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log(`${c.red}✕${c.reset} DEEPSEEK_API_KEY가 필요합니다`);
    process.exit(1);
  }

  console.log(`
${c.bold}${c.cyan}╔═══════════════════════════════════════════════════════════╗
║                    파이프라인 모드                          ║
╚═══════════════════════════════════════════════════════════╝${c.reset}

  ${c.blue}V3${c.reset} (분석 3스텝) → ${c.blue}V3${c.reset} (구현 15스텝) → ${c.blue}V3${c.reset} (검토 5스텝)
`);

  const startTime = Date.now();
  let prevResult = '';
  const stageResults: Array<{ stage: PipelineStage; result: string; elapsed: number; usage: TokenUsage }> = [];
  let totalUsage: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    const stage = PIPELINE_STAGES[i];
    const stageNum = i + 1;
    const model = AVAILABLE_MODELS.find(m => m.id === stage.modelId);

    if (!model) {
      console.log(`${c.red}✕${c.reset} 모델을 찾을 수 없습니다: ${stage.modelId}`);
      continue;
    }

    console.log(`\n${c.cyan}[${stageNum}/3]${c.reset} ${c.bold}${stage.role}${c.reset} - ${model.name}`);
    console.log(`${'─'.repeat(50)}`);

    const stageStart = Date.now();
    const stagePrompt = stage.promptTemplate(prompt, prevResult);

    try {
      const result = await runCodingTask(stagePrompt, {
        modelId: stage.modelId,
        maxSteps: stage.maxSteps,
        onLog: (log) => {
          if (log.level === 'info') {
            // Step 정보 표시
            const stepMatch = log.message.match(/Step (\d+)\/(\d+)/);
            if (stepMatch) {
              const [, current, total] = stepMatch;
              const progress = Math.round((parseInt(current) / parseInt(total)) * 20);
              const bar = '█'.repeat(progress) + '░'.repeat(20 - progress);
              process.stdout.write(`\r  [${c.cyan}${bar}${c.reset}] Step ${current}/${total}  `);
            }

            // 도구 사용 정보 표시
            const toolMatch = log.message.match(/도구 실행: (\w+)/);
            if (toolMatch) {
              const toolName = toolMatch[1];
              const toolDesc: Record<string, string> = {
                read_file: '📖 파일 읽는 중',
                write_file: '📝 파일 작성 중',
                edit_file: '✏️  파일 수정 중',
                list_directory: '📁 디렉토리 확인 중',
                bash: '💻 명령어 실행 중',
                search_files: '🔍 파일 검색 중',
                terminate: '✅ 완료 처리 중',
                think: '🤔 분석 중',
                planning: '📋 계획 수립 중',
              };
              const desc = toolDesc[toolName] || `🔧 ${toolName}`;
              console.log(`\n  ${c.dim}${desc}${c.reset}`);
            }
          }
        },
      });

      const stageElapsed = (Date.now() - stageStart) / 1000;
      process.stdout.write('\n');

      if (result.success) {
        console.log(`  ${c.green}✓${c.reset} 완료 (${stageElapsed.toFixed(1)}초) - ${formatTokens(result.usage.totalTokens)} 토큰`);
        prevResult = result.result;
        stageResults.push({ stage, result: result.result, elapsed: stageElapsed, usage: result.usage });
        // 총 사용량 누적
        totalUsage.promptTokens += result.usage.promptTokens;
        totalUsage.completionTokens += result.usage.completionTokens;
        totalUsage.totalTokens += result.usage.totalTokens;
      } else {
        console.log(`  ${c.red}✕${c.reset} 실패: ${result.result}`);
        break;
      }
    } catch (error) {
      console.log(`  ${c.red}✕${c.reset} 오류: ${error instanceof Error ? error.message : 'Unknown'}`);
      break;
    }
  }

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalCost = calculateCost(totalUsage);

  // 최종 결과
  console.log(`
${c.green}╔═══════════════════════════════════════════════════════════╗
║                      파이프라인 완료                        ║
╚═══════════════════════════════════════════════════════════╝${c.reset}

  ${c.bold}시간:${c.reset} ${totalElapsed}초
  ${c.bold}토큰:${c.reset} ${formatTokens(totalUsage.totalTokens)} (입력: ${formatTokens(totalUsage.promptTokens)}, 출력: ${formatTokens(totalUsage.completionTokens)})
  ${c.bold}Cost:${c.reset} ${formatCostKRW(totalCost)}
`);

  console.log(`  ${c.dim}Details:${c.reset}`);
  for (const { stage, elapsed, usage } of stageResults) {
    const cost = calculateCost(usage);
    console.log(`  ${c.green}●${c.reset} ${stage.role}: ${elapsed.toFixed(1)}s, ${formatTokens(usage.totalTokens)} tokens, ${formatCostKRW(cost)}`);
  }

  if (stageResults.length === PIPELINE_STAGES.length) {
    console.log(`\n${c.dim}최종 결과:${c.reset}`);
    console.log(prevResult.slice(0, 500));
    if (prevResult.length > 500) console.log(`${c.dim}... (생략)${c.reset}`);
  }
}

async function runDevPipeline(prompt: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log(`${c.red}✕${c.reset} DEEPSEEK_API_KEY가 필요합니다`);
    process.exit(1);
  }

  console.log(`
${c.bold}${c.cyan}╔═══════════════════════════════════════════════════════════╗
║                 개발 파이프라인 모드                         ║
╚═══════════════════════════════════════════════════════════╝${c.reset}

  ${c.blue}분석${c.reset} → ${c.blue}설계${c.reset} → ${c.blue}개발${c.reset} → ${c.blue}구현${c.reset} → ${c.blue}테스트${c.reset}
`);

  const startTime = Date.now();
  let prevResult = '';
  const stageResults: Array<{ stage: PipelineStage; result: string; elapsed: number; usage: TokenUsage }> = [];
  let totalUsage: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  for (let i = 0; i < DEV_PIPELINE_STAGES.length; i++) {
    const stage = DEV_PIPELINE_STAGES[i];
    const stageNum = i + 1;
    const model = AVAILABLE_MODELS.find(m => m.id === stage.modelId);

    if (!model) {
      console.log(`${c.red}✕${c.reset} 모델을 찾을 수 없습니다: ${stage.modelId}`);
      continue;
    }

    console.log(`\n${c.cyan}[${stageNum}/${DEV_PIPELINE_STAGES.length}]${c.reset} ${c.bold}${stage.role}${c.reset} - ${model.name}`);
    console.log(`${'─'.repeat(50)}`);

    const stageStart = Date.now();
    const stagePrompt = stage.promptTemplate(prompt, prevResult);

    try {
      const result = await runCodingTask(stagePrompt, {
        modelId: stage.modelId,
        maxSteps: stage.maxSteps,
        onLog: (log) => {
          if (log.level === 'info') {
            const stepMatch = log.message.match(/Step (\d+)\/(\d+)/);
            if (stepMatch) {
              const [, current, total] = stepMatch;
              const progress = Math.round((parseInt(current) / parseInt(total)) * 20);
              const bar = '█'.repeat(progress) + '░'.repeat(20 - progress);
              process.stdout.write(`\r  [${c.cyan}${bar}${c.reset}] Step ${current}/${total}  `);
            }

            const toolMatch = log.message.match(/도구 실행: (\w+)/);
            if (toolMatch) {
              const toolName = toolMatch[1];
              const toolDesc: Record<string, string> = {
                read_file: '📖 파일 읽는 중',
                write_file: '📝 파일 작성 중',
                edit_file: '✏️  파일 수정 중',
                list_directory: '📁 디렉토리 확인 중',
                bash: '💻 명령어 실행 중',
                search_files: '🔍 파일 검색 중',
                terminate: '✅ 완료 처리 중',
                think: '🤔 분석 중',
                planning: '📋 계획 수립 중',
              };
              const desc = toolDesc[toolName] || `🔧 ${toolName}`;
              console.log(`\n  ${c.dim}${desc}${c.reset}`);
            }
          }
        },
      });

      const stageElapsed = (Date.now() - stageStart) / 1000;
      process.stdout.write('\n');

      if (result.success) {
        console.log(`  ${c.green}✓${c.reset} 완료 (${stageElapsed.toFixed(1)}초) - ${formatTokens(result.usage.totalTokens)} 토큰`);
        prevResult = result.result;
        stageResults.push({ stage, result: result.result, elapsed: stageElapsed, usage: result.usage });
        totalUsage.promptTokens += result.usage.promptTokens;
        totalUsage.completionTokens += result.usage.completionTokens;
        totalUsage.totalTokens += result.usage.totalTokens;
      } else {
        console.log(`  ${c.red}✕${c.reset} 실패: ${result.result}`);
        break;
      }
    } catch (error) {
      console.log(`  ${c.red}✕${c.reset} 오류: ${error instanceof Error ? error.message : 'Unknown'}`);
      break;
    }
  }

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalCost = calculateCost(totalUsage);

  console.log(`
${c.green}╔═══════════════════════════════════════════════════════════╗
║                   개발 파이프라인 완료                      ║
╚═══════════════════════════════════════════════════════════╝${c.reset}

  ${c.bold}시간:${c.reset} ${totalElapsed}초
  ${c.bold}토큰:${c.reset} ${formatTokens(totalUsage.totalTokens)} (입력: ${formatTokens(totalUsage.promptTokens)}, 출력: ${formatTokens(totalUsage.completionTokens)})
  ${c.bold}Cost:${c.reset} ${formatCostKRW(totalCost)}
`);

  console.log(`  ${c.dim}Details:${c.reset}`);
  for (const { stage, elapsed, usage } of stageResults) {
    const cost = calculateCost(usage);
    console.log(`  ${c.green}●${c.reset} ${stage.role}: ${elapsed.toFixed(1)}s, ${formatTokens(usage.totalTokens)} tokens, ${formatCostKRW(cost)}`);
  }

  if (stageResults.length === DEV_PIPELINE_STAGES.length) {
    console.log(`\n${c.dim}최종 결과:${c.reset}`);
    console.log(prevResult.slice(0, 500));
    if (prevResult.length > 500) console.log(`${c.dim}... (생략)${c.reset}`);
  }
}

// ============================================================
// 인터랙티브 모드 (ink 기반 대시보드)
// ============================================================

// 디렉토리 히스토리 (최대 20개, 파일에 저장)
const MAX_HISTORY = 20;
const DIR_HISTORY_FILE = path.join(getProjectStorageDir(), 'dir_history.json');

function loadDirHistory(): string[] {
  try {
    if (fs.existsSync(DIR_HISTORY_FILE)) {
      const content = fs.readFileSync(DIR_HISTORY_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {}
  return [];
}

function saveDirHistory(history: string[]) {
  try {
    ensureProjectStorageDir();
    fs.writeFileSync(DIR_HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch {}
}

const dirHistory: string[] = loadDirHistory();

function addToHistory(dir: string) {
  // 중복 제거
  const idx = dirHistory.indexOf(dir);
  if (idx !== -1) dirHistory.splice(idx, 1);
  // 맨 앞에 추가
  dirHistory.unshift(dir);
  // 최대 개수 유지
  if (dirHistory.length > MAX_HISTORY) dirHistory.pop();
  // 파일에 저장
  saveDirHistory(dirHistory);
}

// ============================================================
// 작업 히스토리 자동 기록 (.onesaas/kcode-history/YYYY-MM-DD.md)
// ============================================================

const HISTORY_DIR = path.join(getProjectStorageDir(), 'kcode-history');

function logTaskHistory(task: {
  prompt: string;
  status: string;
  startTime: number;
  endTime: number;
  tokens?: number;
  cwd: string;
}) {
  try {
    // 히스토리 디렉토리 생성
    ensureProjectStorageDir();
    if (!fs.existsSync(HISTORY_DIR)) {
      fs.mkdirSync(HISTORY_DIR, { recursive: true });
    }

    // 오늘 날짜 파일
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    const historyFile = path.join(HISTORY_DIR, `${dateStr}.md`);

    // 파일이 없으면 헤더 추가
    const isNewFile = !fs.existsSync(historyFile);

    const elapsed = ((task.endTime - task.startTime) / 1000).toFixed(1);
    const status = task.status === 'completed' ? '✓' : '✕';
    const tokens = task.tokens ? ` | ${formatTokens(task.tokens)} 토큰` : '';

    let content = '';
    if (isNewFile) {
      content += `# 작업 히스토리 - ${dateStr}\n\n`;
    }

    content += `## ${timeStr} ${status}\n`;
    content += `- **작업**: ${task.prompt}\n`;
    content += `- **경로**: ${task.cwd}\n`;
    content += `- **소요**: ${elapsed}초${tokens}\n\n`;

    fs.appendFileSync(historyFile, content, 'utf-8');
  } catch {
    // 히스토리 기록 실패해도 무시
  }
}

function runInteractiveMode(modelId: string) {
  // ink 기반 대시보드 실행
  runInkDashboard(modelId);
}

// ============================================================
// 멀티 태스크 실행 (동시 병렬)
// ============================================================

async function runMultiTasks(prompts: string[], modelId: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log(`${c.red}✕${c.reset} DEEPSEEK_API_KEY가 필요합니다`);
    process.exit(1);
  }

  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  if (!model) {
    console.log(`${c.red}✕${c.reset} 모델을 찾을 수 없습니다: ${modelId}`);
    process.exit(1);
  }

  console.log(`
${c.bold}${c.cyan}╔═══════════════════════════════════════════════════════════╗
║                    멀티 태스크 모드                         ║
╚═══════════════════════════════════════════════════════════╝${c.reset}

  ${c.bold}${prompts.length}개${c.reset} 작업을 ${c.blue}${model.name}${c.reset}로 동시 실행
`);

  const startTime = Date.now();
  let totalUsage: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

  // 각 작업 상태 표시
  const taskStatuses: string[] = prompts.map((_, i) => `${c.yellow}◐${c.reset} 작업 ${i + 1}: 실행 중...`);

  const updateDisplay = () => {
    // 커서 위로 이동하고 다시 출력
    if (taskStatuses.length > 0) {
      process.stdout.write(`\x1b[${taskStatuses.length}A\x1b[0J`);
    }
    taskStatuses.forEach(s => console.log(s));
  };

  // 초기 표시
  taskStatuses.forEach(s => console.log(s));

  // 병렬 실행
  const results = await Promise.all(
    prompts.map(async (prompt, i) => {
      const taskStart = Date.now();
      try {
        const result = await runCodingTask(prompt, {
          modelId,
          maxSteps: 100,
        });

        const elapsed = ((Date.now() - taskStart) / 1000).toFixed(1);

        if (result.success) {
          taskStatuses[i] = `${c.green}●${c.reset} 작업 ${i + 1}: 완료 (${elapsed}초, ${formatTokens(result.usage.totalTokens)} 토큰)`;
          totalUsage.promptTokens += result.usage.promptTokens;
          totalUsage.completionTokens += result.usage.completionTokens;
          totalUsage.totalTokens += result.usage.totalTokens;
        } else {
          taskStatuses[i] = `${c.red}✕${c.reset} 작업 ${i + 1}: 실패 - ${result.result.slice(0, 30)}`;
        }
        updateDisplay();
        return { success: result.success, prompt, result: result.result, elapsed: parseFloat(elapsed), usage: result.usage };
      } catch (error) {
        const elapsed = ((Date.now() - taskStart) / 1000).toFixed(1);
        taskStatuses[i] = `${c.red}✕${c.reset} 작업 ${i + 1}: 오류 - ${error instanceof Error ? error.message.slice(0, 30) : 'Unknown'}`;
        updateDisplay();
        return { success: false, prompt, result: error instanceof Error ? error.message : 'Unknown', elapsed: parseFloat(elapsed), usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };
      }
    })
  );

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalCost = calculateCost(totalUsage);
  const successCount = results.filter(r => r.success).length;

  console.log(`
${c.green}╔═══════════════════════════════════════════════════════════╗
║                    멀티 태스크 완료                         ║
╚═══════════════════════════════════════════════════════════╝${c.reset}

  ${c.bold}결과:${c.reset} ${successCount}/${prompts.length} 성공
  ${c.bold}시간:${c.reset} ${totalElapsed}초 (병렬 실행)
  ${c.bold}토큰:${c.reset} ${formatTokens(totalUsage.totalTokens)} (입력: ${formatTokens(totalUsage.promptTokens)}, 출력: ${formatTokens(totalUsage.completionTokens)})
  ${c.bold}Cost:${c.reset} ${formatCostKRW(totalCost)}
`);

  // 각 작업 결과 요약
  console.log(`${c.dim}작업 결과:${c.reset}`);
  results.forEach((r, i) => {
    const status = r.success ? `${c.green}✓${c.reset}` : `${c.red}✕${c.reset}`;
    console.log(`  ${status} [${i + 1}] ${r.prompt.slice(0, 40)}${r.prompt.length > 40 ? '...' : ''}`);
    if (r.success) {
      console.log(`     ${c.dim}${r.result.slice(0, 80)}${r.result.length > 80 ? '...' : ''}${c.reset}`);
    }
  });
}

// ============================================================
// 모델 목록
// ============================================================

function listModels() {
  console.log(`\n${c.bold}사용 가능한 모델${c.reset}\n`);

  // 프로바이더별 그룹화
  const providers = ['deepseek', 'openai', 'anthropic'] as const;
  const providerNames = {
    deepseek: 'DeepSeek',
    openai: 'OpenAI',
    anthropic: 'Anthropic',
  };

  for (const provider of providers) {
    const models = AVAILABLE_MODELS.filter(m => m.provider === provider);
    const hasKey = !!getApiKey(provider);

    console.log(`${c.cyan}─── ${providerNames[provider]} ───${c.reset} ${hasKey ? c.green + '● 키 설정됨' + c.reset : c.gray + '○ 키 필요' + c.reset}`);

    for (const model of models) {
      console.log(`  ${c.bold}${model.id}${c.reset} - ${model.name}`);
      console.log(`    ${c.dim}${model.description} | $${model.inputPrice}/$${model.outputPrice} per M${c.reset}`);
    }
    console.log('');
  }

  console.log(`${c.dim}API 키 설정: kcode --key <provider> <key>${c.reset}`);
  console.log(`${c.dim}예: kcode --key openai sk-...${c.reset}`);
}

// ============================================================
// 도움말
// ============================================================

function printHelp() {
  console.log(`
${c.bold}${c.cyan}K 코드 (K Code)${c.reset} - 한국어 특화 AI 코딩 에이전트

  🇰🇷 한국어에 최적화된 AI 코딩 어시스턴트입니다.
  DeepSeek V3 기반으로 자연어 코딩 작업을 수행합니다.
  Claude Code처럼 파일 탐색, 코드 분석, 자동 수정을 지원합니다.

${c.bold}사용법:${c.reset}
  kcode                             ${c.cyan}인터랙티브 모드${c.reset} (기본)
  kcode "<작업>"                    단일 작업 실행 (기본: 파이프라인)
  kcode "<작업>" --pipe             파이프라인 모드 (분석→구현→검토)
  kcode "<작업1>" "<작업2>"         여러 작업 동시 병렬 실행

${c.bold}옵션:${c.reset}
  --key <API_KEY>     API 키 저장 (한번만 설정하면 됨)
  -u, --update        최신 버전으로 자동 업데이트
  -i, --interactive   인터랙티브 모드 - 여러 작업을 비동기로 실행
  -m, --model <id>    사용할 모델 선택 (기본: deepseek)
  --pipe              파이프라인 모드 - 분석/구현/검토 3단계 순차 실행
  --multi             멀티 태스크 모드 - 여러 작업 동시 실행
  -l, --list          사용 가능한 모델 목록 확인
  ${c.green}-g, --guide${c.reset}         🚀 원스탑 가이드 (개발→커밋→배포)
  -h, --help          도움말 표시

${c.bold}모드 설명:${c.reset}
  ${c.cyan}인터랙티브${c.reset}   작업을 입력하면 백그라운드에서 실행, 계속 추가 가능
  ${c.cyan}파이프라인${c.reset}   분석→구현→검토 3단계 자동 실행 (기본)
  ${c.cyan}멀티태스크${c.reset}   여러 독립적인 작업을 동시에 병렬 처리
  ${c.cyan}개발 파이프라인${c.reset}   요청에 "개발" 포함 시 분석→설계→개발→구현→테스트

${c.bold}예시:${c.reset}
  kcode "로그인 기능 추가해줘"
  kcode "이 버그 수정해줘: TypeError at line 42"
  kcode "코드 리팩토링하고 테스트 추가해줘" --pipe
  kcode -i                          # 대화형 모드 시작

${c.bold}인터랙티브 모드 명령어:${c.reset}
  <작업>    작업 입력 후 Enter → 백그라운드 실행
  s         현재 실행 중인 작업 상태 확인
  q         종료

${c.bold}환경변수:${c.reset}
  DEEPSEEK_API_KEY    DeepSeek API 키 (필수)
                      https://platform.deepseek.com 에서 발급

${c.bold}특징:${c.reset}
  • 프로젝트 구조 자동 분석 후 작업 수행
  • 파일 읽기/쓰기/수정 자동 처리
  • bash 명령어 실행 (빌드, 테스트 등)
  • 토큰 사용량 및 비용 실시간 표시
`);
}

// ============================================================
// 원스탑 가이드
// ============================================================

function printGuide() {
  console.log(`
${c.bold}${c.cyan}🚀 OneSaaS 원스탑 가이드${c.reset}
${c.dim}개발, 커밋, 업데이트, 배포를 한 번에!${c.reset}

${c.bold}${c.yellow}📝 1. 코드 수정하기${c.reset}
${c.dim}────────────────────────────────────────${c.reset}
  ${c.cyan}pnpm dev${c.reset}                    # 개발 서버 실행
  ${c.dim}# http://localhost:3000 에서 확인${c.reset}
  ${c.dim}# src/onesaas-custom/ 에서 자유롭게 수정${c.reset}

${c.bold}${c.yellow}💾 2. Git 커밋하기${c.reset}
${c.dim}────────────────────────────────────────${c.reset}
  ${c.cyan}git status${c.reset}                  # 변경사항 확인
  ${c.cyan}git add .${c.reset}                   # 모든 변경 스테이징
  ${c.cyan}git commit -m "feat: 설명"${c.reset}  # 커밋 (한글 OK)
  ${c.cyan}git push${c.reset}                    # 원격 저장소 푸시

${c.bold}${c.yellow}🔄 3. 프로젝트 업데이트${c.reset}
${c.dim}────────────────────────────────────────${c.reset}
  ${c.cyan}onesaas update${c.reset}              # OneSaaS CLI로 업데이트
  ${c.dim}# 또는 수동으로:${c.reset}
  ${c.cyan}git fetch origin${c.reset}
  ${c.cyan}git merge origin/main${c.reset}

${c.bold}${c.yellow}🌐 4. Vercel 배포하기${c.reset}
${c.dim}────────────────────────────────────────${c.reset}
  ${c.green}git push${c.reset}                    # 방법 1: 자동 배포 (권장)
  ${c.cyan}vercel${c.reset}                      # 방법 2: Vercel CLI
  ${c.cyan}onesaas deploy${c.reset}              # 방법 3: OneSaaS CLI

${c.bold}${c.yellow}🗄️ 5. 데이터베이스 마이그레이션${c.reset}
${c.dim}────────────────────────────────────────${c.reset}
  ${c.cyan}pnpm db:push${c.reset}                # 개발용 (빠른 적용)
  ${c.cyan}pnpm db:migrate${c.reset}             # 프로덕션 (마이그레이션 기록)

${c.bold}${c.yellow}🔧 6. 환경변수 설정${c.reset}
${c.dim}────────────────────────────────────────${c.reset}
  ${c.dim}로컬:${c.reset}    .env 파일 수정
  ${c.dim}Vercel:${c.reset}  대시보드 → Settings → Environment Variables
  ${c.dim}DB:${c.reset}      Supabase Connection Pooling URL 사용

${c.bold}${c.magenta}💡 빠른 작업 흐름${c.reset}
${c.dim}────────────────────────────────────────${c.reset}
  ${c.green}pnpm dev${c.reset}     →  ${c.dim}코드 수정${c.reset}  →  ${c.cyan}git add . && git commit -m "설명"${c.reset}  →  ${c.green}git push${c.reset}
  ${c.dim}(개발)${c.reset}         ${c.dim}(테스트)${c.reset}       ${c.dim}(저장)${c.reset}                            ${c.dim}(배포!)${c.reset}

${c.dim}더 자세한 정보: https://onesaas.kr/docs${c.reset}
`);
}

// ============================================================
// 메인
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const isDevPrompt = (text: string) => /개발/.test(text);

  // 도움말
  if (args.includes('-h') || args.includes('--help')) {
    printHelp();
    return;
  }

  // 원스탑 가이드
  if (args.includes('-g') || args.includes('--guide')) {
    printGuide();
    return;
  }

  // 모델 목록은 바로 표시
  if (args.includes('-l') || args.includes('--list') || args.includes('--list-models')) {
    listModels();
    return;
  }

  // 버전만 표시
  if (args.includes('-v') || args.includes('--version')) {
    console.log(`K 코드 v${VERSION}`);
    return;
  }

  // 자동 업데이트
  if (args.includes('--update') || args.includes('-u')) {
    await autoUpdate();
    return;
  }

  // API 키 설정 (--key <provider> <key> 또는 --key <key>)
  const keyIndex = args.indexOf('--key');
  if (keyIndex !== -1) {
    const arg1 = args[keyIndex + 1];
    const arg2 = args[keyIndex + 2];

    let provider: 'deepseek' | 'openai' | 'anthropic' = 'deepseek';
    let apiKey = arg1;

    // provider가 지정된 경우
    if (['deepseek', 'openai', 'anthropic'].includes(arg1)) {
      provider = arg1 as 'deepseek' | 'openai' | 'anthropic';
      apiKey = arg2;
    }

    if (!apiKey) {
      console.log(`${c.red}✕${c.reset} API 키를 입력하세요`);
      console.log(`${c.dim}  사용법: kcode --key <provider> <key>${c.reset}`);
      console.log(`${c.dim}  예: kcode --key openai sk-...${c.reset}`);
      console.log(`${c.dim}  예: kcode --key anthropic sk-ant-...${c.reset}`);
      console.log(`${c.dim}  예: kcode --key deepseek sk-...${c.reset}`);
      return;
    }

    if (saveApiKey(apiKey, provider)) {
      const providerName = { deepseek: 'DeepSeek', openai: 'OpenAI', anthropic: 'Anthropic' }[provider];
      console.log(`${c.green}✓${c.reset} ${providerName} API 키가 저장되었습니다.`);
      console.log(`${c.dim}  위치: .onesaas/config.json${c.reset}`);
    } else {
      console.log(`${c.red}✕${c.reset} API 키 저장 실패`);
    }
    return;
  }

  // 배너 출력
  printBanner();

  // 버전 체크 (비동기, 백그라운드)
  checkVersion();

  // API 키 검사
  if (!await checkApiKey()) {
    process.exit(1);
  }

  // 프롬프트 추출
  const prompts: string[] = [];
  let modelId = 'deepseek';
  let pipeline = true;
  let multi = false;
  let interactive = false;


  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-m' || arg === '--model') {
      modelId = args[++i];
    } else if (arg === '--pipe' || arg === '--pipeline') {
      pipeline = true;
    } else if (arg === '--multi') {
      multi = true;
      pipeline = false;
    } else if (arg === '-i' || arg === '--interactive') {
      interactive = true;
    } else if (!arg.startsWith('-')) {
      prompts.push(arg);
    }
  }

  // 인터랙티브 모드 (기본값: 프롬프트 없으면 자동 시작)
  if (interactive || prompts.length === 0) {
    await runInteractiveMode(modelId);
    return;
  }

  if (multi || prompts.length > 1) {
    // 멀티 태스크 모드
    await runMultiTasks(prompts, modelId);
  } else if (prompts.length === 1 && isDevPrompt(prompts[0])) {
    await runDevPipeline(prompts[0]);
  } else if (pipeline) {
    await runPipeline(prompts[0]);
  } else {
    await runSingle(prompts[0], modelId);
  }
}

main().catch((error) => {
  console.error(`${c.red}오류:${c.reset}`, error.message);
  process.exit(1);
});
