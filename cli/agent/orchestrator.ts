/**
 * Orchestrator - 작업 조율 상태 머신
 * DeepSeek 전용 (계획/분석/검증)
 *
 * 상태 흐름:
 * Understand → Plan → Act → Verify → Report
 */

import { LLM } from '../llm';
import { getApiKey } from '../models';
import { Role } from '../types';

// ============================================================
// 타입 정의
// ============================================================

export type OrchestratorState =
  | 'idle'
  | 'understanding'  // 작업 이해
  | 'planning'       // 계획 수립
  | 'acting'         // 실행 중
  | 'verifying'      // 검증
  | 'reporting'      // 보고서 작성
  | 'completed'
  | 'failed';

export interface OrchestratorEvent {
  type: 'state_change' | 'log' | 'progress' | 'error';
  state?: OrchestratorState;
  message: string;
  data?: unknown;
  timestamp: number;
}

export interface TaskUnderstanding {
  summary: string;           // 작업 요약
  intent: string;            // 사용자 의도
  complexity: 'simple' | 'medium' | 'complex';
  estimatedSteps: number;
  risks: string[];           // 잠재적 위험
  requiredTools: string[];   // 필요한 도구
}

export interface ExecutionPlan {
  steps: PlanStep[];
  estimatedTime: string;
  dependencies: string[];    // 필요한 파일/라이브러리
  preconditions: string[];   // 사전 조건
}

export interface PlanStep {
  id: string;
  description: string;
  action: string;            // 실행할 작업
  tool?: string;             // 사용할 도구
  expectedOutcome: string;   // 예상 결과
  riskLevel: 'low' | 'medium' | 'high';
}

export interface VerificationResult {
  success: boolean;
  issues: string[];
  suggestions: string[];
  testsPassed?: boolean;
  buildSucceeded?: boolean;
}

export interface ExecutionReport {
  task: string;
  status: 'success' | 'partial' | 'failed';
  understanding: TaskUnderstanding;
  plan: ExecutionPlan;
  verification: VerificationResult;
  summary: string;
  filesChanged: string[];
  duration: number;
  nextSteps?: string[];
}

// ============================================================
// Orchestrator - DeepSeek 전용
// ============================================================

export class Orchestrator {
  private state: OrchestratorState = 'idle';
  private deepseekLLM: LLM;
  private eventHandlers: Array<(event: OrchestratorEvent) => void> = [];
  private conversationHistory: Array<{ role: Role; content: string }> = [];

  constructor() {
    // DeepSeek 전용 LLM 초기화
    const deepseekKey = getApiKey('deepseek');
    if (!deepseekKey) {
      throw new Error('DeepSeek API 키가 필요합니다. /키 deepseek <key>로 설정하세요.');
    }

    this.deepseekLLM = new LLM({
      model: 'deepseek-chat',
      apiKey: deepseekKey,
      maxTokens: 8192,
      baseUrl: 'https://api.deepseek.com',
      provider: 'deepseek',
    });
  }

  /**
   * 이벤트 핸들러 등록
   */
  onEvent(handler: (event: OrchestratorEvent) => void) {
    this.eventHandlers.push(handler);
  }

  private emit(event: Omit<OrchestratorEvent, 'timestamp'>) {
    const fullEvent: OrchestratorEvent = {
      ...event,
      timestamp: Date.now(),
    };
    this.eventHandlers.forEach(h => h(fullEvent));
  }

  private changeState(newState: OrchestratorState, message: string) {
    this.state = newState;
    this.emit({
      type: 'state_change',
      state: newState,
      message,
    });
  }

  /**
   * 1단계: Understand - 작업 이해 (DeepSeek)
   */
  async understand(task: string): Promise<TaskUnderstanding> {
    this.changeState('understanding', '작업 분석 중...');

    const prompt = `다음 작업을 분석해주세요:

작업: ${task}

다음 형식의 JSON으로 응답해주세요:
{
  "summary": "작업 요약 (한 줄)",
  "intent": "사용자 의도",
  "complexity": "simple | medium | complex",
  "estimatedSteps": 예상 단계 수,
  "risks": ["위험 요소 목록"],
  "requiredTools": ["필요한 도구 목록"]
}

JSON만 응답하세요.`;

    this.conversationHistory.push({ role: Role.USER, content: prompt });

    const response = await this.deepseekLLM.ask(
      this.conversationHistory,
      [{ role: Role.SYSTEM, content: 'You are a task analysis expert. Always respond in JSON format.' }]
    );

    const content = response.content || '';
    this.conversationHistory.push({ role: Role.ASSISTANT, content });

    try {
      const understanding = JSON.parse(content.replace(/```json\n?|```/g, ''));
      this.emit({
        type: 'log',
        message: `✓ 작업 이해 완료: ${understanding.summary}`,
        data: understanding,
      });
      return understanding;
    } catch {
      throw new Error('작업 이해 실패');
    }
  }

  /**
   * 2단계: Plan - 실행 계획 수립 (DeepSeek)
   */
  async plan(task: string, understanding: TaskUnderstanding): Promise<ExecutionPlan> {
    this.changeState('planning', '실행 계획 수립 중...');

    const prompt = `다음 작업의 실행 계획을 세워주세요:

작업: ${task}
복잡도: ${understanding.complexity}
예상 단계: ${understanding.estimatedSteps}

다음 형식의 JSON으로 응답해주세요:
{
  "steps": [
    {
      "id": "step-1",
      "description": "단계 설명",
      "action": "수행할 작업",
      "tool": "사용할 도구 (선택)",
      "expectedOutcome": "예상 결과",
      "riskLevel": "low | medium | high"
    }
  ],
  "estimatedTime": "예상 소요 시간",
  "dependencies": ["필요한 파일/라이브러리"],
  "preconditions": ["사전 조건 목록"]
}

JSON만 응답하세요.`;

    this.conversationHistory.push({ role: Role.USER, content: prompt });

    const response = await this.deepseekLLM.ask(
      this.conversationHistory,
      [{ role: Role.SYSTEM, content: 'You are an execution planning expert. Always respond in JSON format.' }]
    );

    const planContent = response.content || '';
    this.conversationHistory.push({ role: Role.ASSISTANT, content: planContent });

    try {
      const plan = JSON.parse(planContent.replace(/```json\n?|```/g, ''));
      this.emit({
        type: 'log',
        message: `✓ 실행 계획 완료: ${plan.steps.length}개 단계`,
        data: plan,
      });
      return plan;
    } catch {
      throw new Error('계획 수립 실패');
    }
  }

  /**
   * 3단계: Act - 실행 (사용자 선택 모델)
   * 주의: 실제 코딩 작업은 여기서 CodingAgent를 호출하며, 사용자가 선택한 모델 사용
   */
  async act(plan: ExecutionPlan, executor: (step: PlanStep) => Promise<string>): Promise<string[]> {
    this.changeState('acting', '작업 실행 중...');

    const results: string[] = [];

    for (const step of plan.steps) {
      this.emit({
        type: 'progress',
        message: `▶ ${step.description}`,
        data: step,
      });

      try {
        const result = await executor(step);
        results.push(result);

        this.emit({
          type: 'log',
          message: `✓ ${step.description} 완료`,
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : '알 수 없는 오류';
        this.emit({
          type: 'error',
          message: `✕ ${step.description} 실패: ${msg}`,
        });
        throw error;
      }
    }

    return results;
  }

  /**
   * 4단계: Verify - 검증 (DeepSeek)
   */
  async verify(task: string, results: string[]): Promise<VerificationResult> {
    this.changeState('verifying', '결과 검증 중...');

    const prompt = `다음 작업의 실행 결과를 검증해주세요:

원래 작업: ${task}

실행 결과:
${results.join('\n\n')}

다음 형식의 JSON으로 응답해주세요:
{
  "success": true/false,
  "issues": ["발견된 문제 목록"],
  "suggestions": ["개선 제안 목록"],
  "testsPassed": true/false (선택),
  "buildSucceeded": true/false (선택)
}

JSON만 응답하세요.`;

    this.conversationHistory.push({ role: Role.USER, content: prompt });

    const response = await this.deepseekLLM.chat({
      messages: this.conversationHistory,
      systemPrompt: 'You are a code verification expert. Always respond in JSON format.',
    });

    const verifyContent = response.content || '';
    this.conversationHistory.push({ role: Role.ASSISTANT, content: verifyContent });

    try {
      const verification = JSON.parse(verifyContent.replace(/```json\n?|```/g, ''));
      this.emit({
        type: 'log',
        message: verification.success ? '✓ 검증 성공' : '⚠ 검증 실패',
        data: verification,
      });
      return verification;
    } catch {
      throw new Error('검증 실패');
    }
  }

  /**
   * 5단계: Report - 최종 보고서 (DeepSeek)
   */
  async report(
    task: string,
    understanding: TaskUnderstanding,
    plan: ExecutionPlan,
    verification: VerificationResult,
    filesChanged: string[],
    duration: number
  ): Promise<ExecutionReport> {
    this.changeState('reporting', '보고서 작성 중...');

    const prompt = `다음 작업의 최종 보고서를 작성해주세요:

작업: ${task}
소요 시간: ${duration}ms
변경된 파일: ${filesChanged.join(', ')}
검증 결과: ${verification.success ? '성공' : '실패'}

다음 형식의 JSON으로 응답해주세요:
{
  "status": "success | partial | failed",
  "summary": "작업 요약 (2-3문장)",
  "nextSteps": ["다음 단계 제안 (선택)"]
}

JSON만 응답하세요.`;

    this.conversationHistory.push({ role: Role.USER, content: prompt });

    const response = await this.deepseekLLM.chat({
      messages: this.conversationHistory,
      systemPrompt: 'You are a technical report writer. Always respond in JSON format.',
    });

    const reportContent = response.content || '';
    try {
      const reportData = JSON.parse(reportContent.replace(/```json\n?|```/g, ''));

      const report: ExecutionReport = {
        task,
        status: reportData.status,
        understanding,
        plan,
        verification,
        summary: reportData.summary,
        filesChanged,
        duration,
        nextSteps: reportData.nextSteps,
      };

      this.changeState('completed', '✓ 작업 완료');

      this.emit({
        type: 'log',
        message: `보고서: ${report.summary}`,
        data: report,
      });

      return report;
    } catch {
      throw new Error('보고서 작성 실패');
    }
  }

  /**
   * 전체 워크플로우 실행
   */
  async execute(
    task: string,
    executor: (step: PlanStep) => Promise<string>
  ): Promise<ExecutionReport> {
    const startTime = Date.now();
    const filesChanged: string[] = [];

    try {
      // 1. Understand
      const understanding = await this.understand(task);

      // 2. Plan
      const plan = await this.plan(task, understanding);

      // 3. Act (사용자 선택 모델 사용)
      const results = await this.act(plan, executor);

      // 4. Verify
      const verification = await this.verify(task, results);

      // 5. Report
      const duration = Date.now() - startTime;
      const report = await this.report(
        task,
        understanding,
        plan,
        verification,
        filesChanged,
        duration
      );

      return report;
    } catch (error) {
      this.changeState('failed', '작업 실패');
      throw error;
    }
  }

  /**
   * 현재 상태 가져오기
   */
  getState(): OrchestratorState {
    return this.state;
  }

  /**
   * 대화 기록 초기화
   */
  reset() {
    this.state = 'idle';
    this.conversationHistory = [];
  }
}
