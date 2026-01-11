/**
 * K Code Dashboard - ink (React) 기반 터미널 UI
 */

import React, { useState, useEffect, useCallback } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import {
  ensureProjectStorageDir,
  getProjectStorageDir,
  generateSessionId,
  saveSession,
  loadProjectMetadata,
  updateProjectMetadata,
  type SessionData,
  type ProjectMetadata,
} from './storage';

// 타입
import type { TokenUsage } from './agent/coding';
import {
  AVAILABLE_MODELS,
  type ModelInfo,
  type TaskType,
  getApiKey,
  saveApiKey,
  type Provider,
  getModelByNumber,
  getTaskModels,
  setTaskModel,
} from './models';

// ============================================================
// 유틸리티 함수
// ============================================================

const USD_TO_KRW = 1450;

function formatCostKRW(usdCost: number): string {
  const krw = Math.round(usdCost * USD_TO_KRW);
  return krw.toLocaleString('ko-KR') + '원';
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

function calculateCost(inTok: number, outTok: number): number {
  const inputCost = (inTok / 1_000_000) * 0.27;
  const outputCost = (outTok / 1_000_000) * 1.10;
  return inputCost + outputCost;
}

// ============================================================
// 월별 사용량
// ============================================================

const USAGE_DIR = path.join(getProjectStorageDir(), 'kcode-usage');

interface MonthlyUsage {
  month: string;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  lastUpdated: string;
}

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function loadMonthlyUsage(): MonthlyUsage {
  try {
    const filePath = path.join(USAGE_DIR, `${getCurrentMonth()}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch {}
  return {
    month: getCurrentMonth(),
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalCost: 0,
    lastUpdated: new Date().toISOString(),
  };
}

function saveMonthlyUsage(usage: MonthlyUsage): void {
  try {
    ensureProjectStorageDir();
    if (!fs.existsSync(USAGE_DIR)) {
      fs.mkdirSync(USAGE_DIR, { recursive: true });
    }
    usage.lastUpdated = new Date().toISOString();
    fs.writeFileSync(
      path.join(USAGE_DIR, `${getCurrentMonth()}.json`),
      JSON.stringify(usage, null, 2),
      'utf-8'
    );
  } catch {}
}

// ============================================================
// 타입 정의
// ============================================================

interface Task {
  id: number;
  prompt: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  tokens?: number;
  inputTokens?: number;
  outputTokens?: number;
  cost?: number;
  progress?: number;
  worker?: Worker;
  logs: string[];
  result?: string; // 작업 결과
}

interface Stats {
  totalTasks: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  startTime: number;
  monthlyUsage: MonthlyUsage;
}

// ============================================================
// 컴포넌트
// ============================================================

// 프로그레스 바
function ProgressBar({ value, width = 20, color = 'green' }: { value: number; width?: number; color?: string }) {
  const filled = Math.round(value * width);
  const empty = width - filled;
  return (
    <Text>
      <Text color={color}>{'█'.repeat(filled)}</Text>
      <Text color="gray">{'░'.repeat(empty)}</Text>
    </Text>
  );
}

// 헤더
function Header({ modelName }: { modelName: string }) {
  return (
    <Box borderStyle="round" borderColor="blue" paddingX={1}>
      <Text color="yellow" bold>K</Text>
      <Text bold> Code </Text>
      <Text color="gray">| </Text>
      <Text color="cyan">{modelName}</Text>
    </Box>
  );
}

function CommandSummary({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) return null;

  const recent = tasks.slice(-5).map(t => t.prompt);
  const title = recent
    .map((item, idx) => `${idx + 1}. ${item.slice(0, 30)}`)
    .join(' | ');

  return (
    <Box marginTop={1}>
      <Text color="gray">명령 요약: </Text>
      <Text>{title}</Text>
    </Box>
  );
}

// 통계
function StatsPanel({ stats }: { stats: Stats }) {
  const elapsed = ((Date.now() - stats.startTime) / 1000 / 60).toFixed(1);
  const totalTasks = stats.totalTasks || 1;
  const percent = Math.round((stats.completedTasks / totalTasks) * 100);
  const sessionTokens = stats.totalInputTokens + stats.totalOutputTokens;
  const monthlyTokens = stats.monthlyUsage.inputTokens + stats.monthlyUsage.outputTokens;

  return (
    <Box flexDirection="column" marginY={1}>
      <Box>
        <Text color="gray">진행: </Text>
        <ProgressBar value={stats.completedTasks / totalTasks} width={15} />
        <Text> {percent}% </Text>
        <Text color="gray">({elapsed}분)</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="yellow">◐</Text><Text> {stats.runningTasks} </Text>
        <Text color="green">●</Text><Text> {stats.completedTasks} </Text>
        <Text color="red">●</Text><Text> {stats.failedTasks}</Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text>
          <Text color="gray">세션: </Text>
          <Text>{formatTokens(sessionTokens)}</Text>
          <Text color="gray"> | </Text>
          <Text color="green">{formatCostKRW(stats.totalCost)}</Text>
        </Text>
        <Text>
          <Text color="gray">이번달: </Text>
          <Text>{formatTokens(monthlyTokens)}</Text>
          <Text color="gray"> | </Text>
          <Text color="green" bold>{formatCostKRW(stats.monthlyUsage.totalCost)}</Text>
          <Text color="gray"> ({stats.monthlyUsage.completedTasks}작업)</Text>
        </Text>
      </Box>
    </Box>
  );
}

// 작업 목록
function TaskList({ tasks }: { tasks: Task[] }) {
  const recentTasks = tasks.slice(-5);

  if (recentTasks.length === 0) {
    return (
      <Box marginY={1}>
        <Text color="gray">작업을 입력하세요...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginY={1}>
      <Text color="cyan" bold>작업 목록</Text>
      {recentTasks.map((task) => {
        const dur = task.startTime ? Math.round((Date.now() - task.startTime) / 1000) : 0;
        let icon = '○';
        let iconColor = 'gray';
        let statusText = '';
        const prog = task.progress || 0;

        if (task.status === 'running') {
          icon = '◐';
          iconColor = 'yellow';
          statusText = ` ${Math.round(prog * 100)}%`;
        } else if (task.status === 'completed') {
          icon = '●';
          iconColor = 'green';
          statusText = ` ${formatTokens(task.tokens || 0)} ${formatCostKRW(task.cost || 0)}`;
        } else if (task.status === 'failed') {
          icon = '✕';
          iconColor = 'red';
        }

        return (
          <Box key={task.id} flexDirection="column">
            <Box>
              <Text color={iconColor}>{icon}</Text>
              <Text> [{task.id}] {task.prompt.slice(0, 35)}</Text>
              <Text color="gray">{statusText} {dur}s</Text>
            </Box>
            <Box marginLeft={2}>
              <ProgressBar value={prog} width={18} color={task.status === 'completed' ? 'green' : 'yellow'} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// 시스템 로그
function SystemLogPanel({ logs }: { logs: string[] }) {
  const recentLogs = logs.slice(-30); // 최근 30개 표시

  if (recentLogs.length === 0) return null;

  return (
    <Box flexDirection="column" marginY={1} borderStyle="single" borderColor="gray" paddingX={1}>
      <Text color="gray" bold>시스템 로그</Text>
      {recentLogs.map((log, i) => (
        <Text key={i} color="gray" wrap="wrap">{log}</Text>
      ))}
    </Box>
  );
}

// 태스크별 로그 (스트림 방식)
function TaskLogsPanel({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) return null;

  // 로그 색상 및 아이콘 결정
  const getLogStyle = (log: string) => {
    if (log.includes('📋')) return { color: 'cyan' as const, icon: '📋' };
    if (log.includes('🧠')) return { color: 'magenta' as const, icon: '🧠' };
    if (log.includes('🚀')) return { color: 'green' as const, icon: '🚀' };
    if (log.includes('✓') || log.includes('완료')) return { color: 'green' as const, icon: '✓' };
    if (log.includes('✕') || log.includes('실패')) return { color: 'red' as const, icon: '✕' };
    if (log.includes('도구')) return { color: 'blue' as const, icon: '🔧' };
    if (log.includes('Step')) return { color: 'yellow' as const, icon: '▶' };
    return { color: 'gray' as const, icon: '·' };
  };

  return (
    <Box flexDirection="column" marginY={1}>
      <Text color="cyan" bold>🔴 실시간 로그 스트림</Text>
      {tasks.map((task) => {
        // 모든 로그 표시 (스트림 모드)
        const allLogs = task.logs;
        const statusColor = task.status === 'completed' ? 'green' : task.status === 'failed' ? 'red' : 'yellow';

        return (
          <Box key={task.id} flexDirection="column" borderStyle="single" borderColor={statusColor} paddingX={1} marginTop={1}>
            <Text color={statusColor} bold>
              {task.status === 'running' && '◐ '}
              {task.status === 'completed' && '● '}
              {task.status === 'failed' && '✕ '}
              [{task.id}] {task.prompt}
            </Text>

            {allLogs.length === 0 ? (
              <Text color="gray" dimColor>대기 중...</Text>
            ) : (
              allLogs.map((log, i) => {
                const style = getLogStyle(log);
                return (
                  <Text key={i} color={style.color} wrap="wrap">
                    {log}
                  </Text>
                );
              })
            )}

            {task.status === 'completed' && task.result && (
              <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor="green" paddingX={1}>
                <Text color="green" bold>✓ 최종 결과</Text>
                <Text color="white" wrap="wrap">{task.result}</Text>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// 메인 대시보드
interface DashboardProps {
  initialModelId: string;
}

function Dashboard({ initialModelId }: DashboardProps) {
  const { exit } = useApp();
  const [input, setInput] = useState('');
  const [model, setModel] = useState<ModelInfo>(
    AVAILABLE_MODELS.find(m => m.id === initialModelId) || AVAILABLE_MODELS[0]
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskIdCounter, setTaskIdCounter] = useState(0);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    '🚀 K-Code - DeepSeek 기본 모델 (코딩 특화)',
    '',
    '💡 빠른 시작:',
    '  1. /키 deepseek sk-xxx  → 인증키 설정',
    '  2. "로그인 기능 추가해줘" → 작업 입력',
    '',
    '📋 명령어: / (목록) | /모델 (모델보기) | /설정 (작업별 모델)',
  ]);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    runningTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCost: 0,
    startTime: Date.now(),
    monthlyUsage: loadMonthlyUsage(),
  });

  // 세션 관리
  const [sessionId] = useState(() => generateSessionId());
  const [sessionData, setSessionData] = useState<SessionData>({
    id: sessionId,
    startedAt: new Date().toISOString(),
    tasks: [],
    totalTokens: 0,
    totalCost: 0,
  });

  // 프로젝트 메타데이터 로드
  useEffect(() => {
    try {
      const metadata = loadProjectMetadata();
      addSystemLog(`📂 프로젝트: ${metadata.name} (${metadata.type})`);
      addSystemLog(`📊 총 ${metadata.totalSessions}개 세션 | ${metadata.totalTasks}개 작업`);
    } catch (err) {
      // 메타데이터 로드 실패는 무시 (초기화됨)
    }
  }, []);

  // 세션 저장 (언마운트 또는 주기적)
  useEffect(() => {
    const interval = setInterval(() => {
      // 30초마다 세션 저장
      saveSession(sessionData);
    }, 30000);

    return () => {
      clearInterval(interval);
      // 세션 종료 시 최종 저장
      const finalSession: SessionData = {
        ...sessionData,
        endedAt: new Date().toISOString(),
      };
      saveSession(finalSession);

      // 프로젝트 메타데이터 업데이트
      try {
        const metadata = loadProjectMetadata();
        updateProjectMetadata({
          totalSessions: metadata.totalSessions + 1,
          totalTasks: metadata.totalTasks + sessionData.tasks.length,
          totalTokens: metadata.totalTokens + sessionData.totalTokens,
          totalCost: metadata.totalCost + sessionData.totalCost,
        });
      } catch {}
    };
  }, [sessionData]);

  // Worker 경로
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const workerPath = path.join(__dirname, 'worker.mjs');

  const addSystemLog = useCallback((msg: string) => {
    setSystemLogs(prev => [...prev.slice(-50), msg]);
  }, []);

  const addTaskLog = useCallback((taskId: number, msg: string) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, logs: [...t.logs.slice(-50), msg] } : t
    ));
  }, []);

  const startTask = useCallback((prompt: string) => {
    const newId = taskIdCounter + 1;
    setTaskIdCounter(newId);

    const task: Task = {
      id: newId,
      prompt,
      status: 'running',
      startTime: Date.now(),
      logs: [],
    };

    setTasks(prev => [...prev, task]);
    setStats(prev => ({
      ...prev,
      totalTasks: prev.totalTasks + 1,
      runningTasks: prev.runningTasks + 1,
    }));
    addTaskLog(newId, `▶ 시작: ${prompt.slice(0, 60)}...`);

    // Worker 시작
    const worker = new Worker(workerPath, {
      workerData: { prompt, modelId: model.id },
    });

    worker.on('message', (msg: any) => {
      if (msg.type === 'log') {
        const stepMatch = msg.log.message.match(/Step (\d+)\/(\d+)/);
        if (stepMatch) {
          const cur = parseInt(stepMatch[1]);
          const max = parseInt(stepMatch[2]);
          setTasks(prev => prev.map(t =>
            t.id === newId ? { ...t, progress: cur / max } : t
          ));
        }
        addTaskLog(newId, msg.log.message);
      } else if (msg.type === 'done') {
        const usage = msg.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
        const cost = calculateCost(usage.promptTokens, usage.completionTokens);

        setTasks(prev => prev.map(t =>
          t.id === newId ? {
            ...t,
            status: msg.success ? 'completed' : 'failed',
            endTime: Date.now(),
            result: msg.result, // 작업 결과 저장
            tokens: usage.totalTokens,
            inputTokens: usage.promptTokens,
            outputTokens: usage.completionTokens,
            cost,
          } : t
        ));

        setStats(prev => {
          const newMonthly = { ...prev.monthlyUsage };
          newMonthly.totalTasks++;
          if (msg.success) {
            newMonthly.completedTasks++;
          } else {
            newMonthly.failedTasks++;
          }
          newMonthly.inputTokens += usage.promptTokens;
          newMonthly.outputTokens += usage.completionTokens;
          newMonthly.totalCost += cost;
          saveMonthlyUsage(newMonthly);

          return {
            ...prev,
            runningTasks: Math.max(0, prev.runningTasks - 1),
            completedTasks: msg.success ? prev.completedTasks + 1 : prev.completedTasks,
            failedTasks: msg.success ? prev.failedTasks : prev.failedTasks + 1,
            totalInputTokens: prev.totalInputTokens + usage.promptTokens,
            totalOutputTokens: prev.totalOutputTokens + usage.completionTokens,
            totalCost: prev.totalCost + cost,
            monthlyUsage: newMonthly,
          };
        });

        // 세션 데이터 업데이트
        setSessionData(prev => ({
          ...prev,
          tasks: [
            ...prev.tasks,
            {
              id: `task-${newId}`,
              prompt,
              status: msg.success ? 'completed' : 'failed',
              tokens: usage.totalTokens,
              cost,
              filesChanged: msg.filesChanged || [],
              startedAt: new Date(task.startTime).toISOString(),
              completedAt: new Date().toISOString(),
            },
          ],
          totalTokens: prev.totalTokens + usage.totalTokens,
          totalCost: prev.totalCost + cost,
        }));

        const icon = msg.success ? '✓' : '✕';
        addTaskLog(newId, `${icon} 완료 ${formatTokens(usage.totalTokens)} ${formatCostKRW(cost)}`);

        // 실패한 경우 에러 메시지 표시
        if (!msg.success && msg.result) {
          addTaskLog(newId, `📋 에러: ${msg.result}`);
        }

        worker.terminate();
      }
    });

    worker.on('error', (err) => {
      setTasks(prev => prev.map(t =>
        t.id === newId ? { ...t, status: 'failed', endTime: Date.now() } : t
      ));
      setStats(prev => ({
        ...prev,
        runningTasks: Math.max(0, prev.runningTasks - 1),
        failedTasks: prev.failedTasks + 1,
      }));
      addTaskLog(newId, `✕ 에러: ${err.message}`);
      worker.terminate();
    });
  }, [taskIdCounter, model.id, addTaskLog, workerPath]);

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // /만 입력하면 명령어 목록 표시
    if (trimmed === '/') {
      addSystemLog('━━━ 💡 사용 가능한 명령어 ━━━');
      addSystemLog('');
      addSystemLog('  /키 <제공자> <키값>');
      addSystemLog('    예: /키 qwen sk-xxx');
      addSystemLog('    예: /키 deepseek sk-xxx');
      addSystemLog('');
      addSystemLog('  /설정');
      addSystemLog('    작업별 모델 설정 (번호로 간편 설정)');
      addSystemLog('    예: /설정 추론 7');
      addSystemLog('');
      addSystemLog('  /모델');
      addSystemLog('    전체 모델 목록 보기');
      addSystemLog('');
      addSystemLog('  /지우기');
      addSystemLog('    화면 정리');
      addSystemLog('');
      addSystemLog('  ESC 키 → 작업 중단');
      addSystemLog('  종료   → 프로그램 종료');
      setInput('');
      return;
    }

    // 명령어 처리
    if (trimmed === '종료' || trimmed === 'q') {
      tasks.forEach(t => t.worker?.terminate());
      exit();
      return;
    }

    if (trimmed === '/모델') {
      const taskTypes: Array<{ emoji: string; name: string; type: import('./models').TaskType }> = [
        { emoji: '📝', name: '문서작성', type: '문서작성' },
        { emoji: '🔧', name: '코딩', type: '코딩' },
        { emoji: '🧪', name: '테스트', type: '테스트' },
        { emoji: '🧠', name: '추론', type: '추론' },
        { emoji: '⚡', name: '빠른작업', type: '빠른작업' },
      ];

      taskTypes.forEach(({ emoji, name, type }) => {
        const models = AVAILABLE_MODELS.filter(m => m.bestFor.includes(type));
        if (models.length > 0) {
          addSystemLog(`━━━ ${emoji} ${name}에 추천 ━━━`);
          models.forEach((m) => {
            const hasKey = !!getApiKey(m.provider);
            const keyStatus = hasKey ? '✓' : '○';
            addSystemLog(`  ${keyStatus} ${m.name.padEnd(18)} ${m.description}`);
          });
          addSystemLog('');
        }
      });

      addSystemLog('💡 모델 변경: /모델 <모델명>');
      addSystemLog('   예시: /모델 qwen-turbo');
      setInput('');
      return;
    }

    if (trimmed.startsWith('/모델 ')) {
      const arg = trimmed.replace(/^\/모델\s+/, '');
      const idx = parseInt(arg);
      const target = !isNaN(idx) ? AVAILABLE_MODELS[idx] : AVAILABLE_MODELS.find(m => m.id === arg);
      if (target && getApiKey(target.provider)) {
        setModel(target);
        addSystemLog(`✓ 모델 변경: ${target.name}`);
      } else {
        addSystemLog('✕ 모델을 찾을 수 없거나 인증키가 없습니다');
      }
      setInput('');
      return;
    }

    if (trimmed === '/지우기') {
      setSystemLogs([]);
      setInput('');
      return;
    }

    // /키 - 인증키 목록
    if (trimmed === '/키') {
      const providerInfo = [
        { id: 'qwen' as Provider, name: '큐웬 (알리바바)', emoji: '💰' },
        { id: 'minimax' as Provider, name: '미니맥스', emoji: '🔧' },
        { id: 'deepseek' as Provider, name: '딥시크', emoji: '🚀' },
        { id: 'groq' as Provider, name: '그록', emoji: '⚡' },
        { id: 'google' as Provider, name: '구글 제미나이', emoji: '🌟' },
      ];

      addSystemLog('━━━ 인증키 설정 현황 ━━━');
      providerInfo.forEach(p => {
        const hasKey = !!getApiKey(p.id);
        const status = hasKey ? '✓ 설정됨' : '○ 없음';
        addSystemLog(`  ${p.emoji} ${p.name.padEnd(18)} ${status}`);
      });
      addSystemLog('');
      addSystemLog('━━━ 키 설정 방법 ━━━');
      addSystemLog('  아래처럼 직접 입력하세요:');
      addSystemLog('');
      addSystemLog('  /키 qwen sk-xxxxxxxxxxxxxxxx');
      addSystemLog('  /키 minimax sk-xxxxxxxxxxxxxxxx');
      addSystemLog('  /키 deepseek sk-xxxxxxxxxxxxxxxx');
      addSystemLog('  /키 groq gsk-xxxxxxxxxxxxxxxx');
      addSystemLog('  /키 google AIza-xxxxxxxxxxxxxxxx');
      setInput('');
      return;
    }

    // /키 <provider> <key> - 인증키 저장
    if (trimmed.startsWith('/키 ')) {
      const parts = trimmed.split(' ').filter(p => p);
      if (parts.length === 3) {
        const provider = parts[1] as Provider;
        const key = parts[2];
        const providerNames: Record<Provider, string> = {
          qwen: '큐웬',
          minimax: '미니맥스',
          deepseek: '딥시크',
          groq: '그록',
          google: '구글 제미나이',
        };
        if (['qwen', 'minimax', 'deepseek', 'groq', 'google'].includes(provider)) {
          if (saveApiKey(key, provider)) {
            addSystemLog(`✓ ${providerNames[provider]} 인증키가 저장되었습니다!`);
          } else {
            addSystemLog(`✕ 인증키 저장 실패`);
          }
        } else {
          addSystemLog(`✕ 잘못된 제공자명: ${provider}`);
          addSystemLog('사용 가능: qwen, minimax, deepseek, groq, google');
        }
      } else {
        addSystemLog('사용법: /키 <제공자> <키값>');
        addSystemLog('예시: /키 qwen sk-xxx');
      }
      setInput('');
      return;
    }

    // /설정 - 작업별 모델 설정
    if (trimmed === '/설정') {
      const taskModels = getTaskModels();
      addSystemLog('━━━ 📋 작업별 모델 설정 ━━━');
      addSystemLog('');
      addSystemLog('현재 설정:');
      addSystemLog(`  📝 문서작성: ${taskModels['문서작성']}번 (${getModelByNumber(taskModels['문서작성'])?.name})`);
      addSystemLog(`  🔧 코딩:     ${taskModels['코딩']}번 (${getModelByNumber(taskModels['코딩'])?.name})`);
      addSystemLog(`  🧪 테스트:   ${taskModels['테스트']}번 (${getModelByNumber(taskModels['테스트'])?.name})`);
      addSystemLog(`  🧠 추론:     ${taskModels['추론']}번 (${getModelByNumber(taskModels['추론'])?.name})`);
      addSystemLog(`  ⚡ 빠른작업: ${taskModels['빠른작업']}번 (${getModelByNumber(taskModels['빠른작업'])?.name})`);
      addSystemLog('');
      addSystemLog('모델 번호:');
      AVAILABLE_MODELS.forEach(m => {
        const hasKey = !!getApiKey(m.provider);
        const keyStatus = hasKey ? '✓' : '○';
        addSystemLog(`  ${keyStatus} ${m.number}번: ${m.name.padEnd(20)} ${m.description}`);
      });
      addSystemLog('');
      addSystemLog('설정 방법:');
      addSystemLog('  /설정 <작업> <번호>');
      addSystemLog('');
      addSystemLog('예시:');
      addSystemLog('  /설정 추론 7     → 추론 작업에 7번(DeepSeek Reasoner) 사용');
      addSystemLog('  /설정 코딩 1     → 코딩 작업에 1번(DeepSeek V3.2) 사용');
      addSystemLog('  /설정 문서작성 2 → 문서작성에 2번(Qwen Turbo) 사용');
      setInput('');
      return;
    }

    // /설정 <작업> <번호>
    if (trimmed.startsWith('/설정 ')) {
      const parts = trimmed.split(' ').filter(p => p);
      if (parts.length === 3) {
        const taskName = parts[1];
        const modelNum = parseInt(parts[2]);

        const taskTypeMap: Record<string, TaskType> = {
          '문서작성': '문서작성',
          '코딩': '코딩',
          '테스트': '테스트',
          '추론': '추론',
          '빠른작업': '빠른작업',
        };

        const taskType = taskTypeMap[taskName];
        if (!taskType) {
          addSystemLog('✕ 잘못된 작업명');
          addSystemLog('사용 가능: 문서작성, 코딩, 테스트, 추론, 빠른작업');
          setInput('');
          return;
        }

        const model = getModelByNumber(modelNum);
        if (!model) {
          addSystemLog(`✕ ${modelNum}번 모델을 찾을 수 없습니다`);
          setInput('');
          return;
        }

        if (setTaskModel(taskType, modelNum)) {
          addSystemLog(`✓ ${taskName} 작업: ${modelNum}번 (${model.name})으로 설정됨`);
        } else {
          addSystemLog('✕ 설정 실패');
        }
      } else {
        addSystemLog('사용법: /설정 <작업> <번호>');
        addSystemLog('예시: /설정 추론 7');
      }
      setInput('');
      return;
    }

    // 작업 실행
    startTask(trimmed);
    setInput('');
  }, [tasks, exit, addSystemLog, startTask]);

  // Ctrl+C 처리
  useInput((input, key) => {
    // Ctrl+C: 전체 종료
    if (key.ctrl && input === 'c') {
      tasks.forEach(t => t.worker?.terminate());
      exit();
    }

    // ESC: 실행 중인 모든 작업 중단
    if (key.escape) {
      const runningTasks = tasks.filter(t => t.status === 'running');
      if (runningTasks.length > 0) {
        runningTasks.forEach(t => {
          t.worker?.terminate();
          setTasks(prev => prev.map(task =>
            task.id === t.id ? { ...task, status: 'failed' as const, logs: [...task.logs, '✕ 사용자에 의해 중단됨'] } : task
          ));
        });
        addSystemLog(`⚠ ${runningTasks.length}개 작업이 중단되었습니다`);
      } else {
        addSystemLog('실행 중인 작업이 없습니다');
      }
      setInput('');
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Header modelName={model.name} />
      <CommandSummary tasks={tasks} />
      <StatsPanel stats={stats} />
      <TaskList tasks={tasks} />
      <SystemLogPanel logs={systemLogs} />
      <TaskLogsPanel tasks={tasks} />

      <Box borderStyle="single" borderColor="green" paddingX={1}>
        <Text color="green">▸ </Text>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="작업 입력 (/ 명령어, ESC 중단, 종료)"
        />
      </Box>
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          💡 팁: "/" 입력 후 엔터 → 명령어 목록 | "/키 qwen sk-xxx" → 키 설정
        </Text>
      </Box>
    </Box>
  );
}

// ============================================================
// 엔트리 포인트
// ============================================================

export function runInkDashboard(modelId: string) {
  // API 키 없이도 시작 가능 - 대시보드에서 /키 명령어로 설정 가능
  render(<Dashboard initialModelId={modelId} />);
}
