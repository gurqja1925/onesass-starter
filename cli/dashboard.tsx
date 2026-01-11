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
import { ensureProjectStorageDir, getProjectStorageDir } from './storage';

// 타입
import type { TokenUsage } from './agent/coding';
import { AVAILABLE_MODELS, type ModelInfo, getApiKey } from './models';

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

        if (task.status === 'running') {
          icon = '◐';
          iconColor = 'yellow';
          const prog = task.progress || 0;
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
          <Box key={task.id}>
            <Text color={iconColor}>{icon}</Text>
            <Text> [{task.id}] {task.prompt.slice(0, 35)}</Text>
            <Text color="gray">{statusText} {dur}s</Text>
          </Box>
        );
      })}
    </Box>
  );
}

// 시스템 로그
function SystemLogPanel({ logs }: { logs: string[] }) {
  const recentLogs = logs.slice(-6);

  if (recentLogs.length === 0) return null;

  return (
    <Box flexDirection="column" marginY={1} borderStyle="single" borderColor="gray" paddingX={1}>
      <Text color="gray" bold>시스템 로그</Text>
      {recentLogs.map((log, i) => (
        <Text key={i} color="gray" wrap="truncate">{log.slice(0, 70)}</Text>
      ))}
    </Box>
  );
}

// 태스크별 로그
function TaskLogsPanel({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) return null;

  return (
    <Box flexDirection="column" marginY={1}>
      <Text color="cyan" bold>작업별 로그</Text>
      {tasks.map((task) => {
        const recentLogs = task.logs.slice(-8);
        return (
          <Box key={task.id} flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1} marginTop={1}>
            <Text color="gray" bold>로그 [{task.id}]</Text>
            {recentLogs.length === 0 ? (
              <Text color="gray">로그 없음</Text>
            ) : (
              recentLogs.map((log, i) => (
                <Text key={i} color="gray" wrap="truncate">{log.slice(0, 70)}</Text>
              ))
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
  const [systemLogs, setSystemLogs] = useState<string[]>(['K Code 시작됨']);
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

        const icon = msg.success ? '✓' : '✕';
        addTaskLog(newId, `${icon} 완료 ${formatTokens(usage.totalTokens)} ${formatCostKRW(cost)}`);
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

    // 명령어 처리
    if (trimmed === 'q' || trimmed === '/quit') {
      tasks.forEach(t => t.worker?.terminate());
      exit();
      return;
    }

    if (trimmed === '/model' || trimmed === '/m') {
      addSystemLog('모델: ' + AVAILABLE_MODELS.map((m, i) => `${i})${m.id}`).join(' '));
      setInput('');
      return;
    }

    if (trimmed.startsWith('/m ') || trimmed.startsWith('/model ')) {
      const arg = trimmed.replace(/^\/(m|model)\s+/, '');
      const idx = parseInt(arg);
      const target = !isNaN(idx) ? AVAILABLE_MODELS[idx] : AVAILABLE_MODELS.find(m => m.id === arg);
      if (target && getApiKey(target.provider)) {
        setModel(target);
        addSystemLog(`모델 변경: ${target.name}`);
      } else {
        addSystemLog('모델을 찾을 수 없거나 API 키가 없습니다');
      }
      setInput('');
      return;
    }

    if (trimmed === '/clear') {
      setSystemLogs([]);
      setInput('');
      return;
    }

    // 작업 실행
    startTask(trimmed);
    setInput('');
  }, [tasks, exit, addSystemLog, startTask]);

  // Ctrl+C 처리
  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      tasks.forEach(t => t.worker?.terminate());
      exit();
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Header modelName={model.name} />
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
          placeholder="작업 입력 (/m 모델, q 종료)"
        />
      </Box>
    </Box>
  );
}

// ============================================================
// 엔트리 포인트
// ============================================================

export function runInkDashboard(modelId: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log('DEEPSEEK_API_KEY가 필요합니다');
    console.log('  kcode --key YOUR_API_KEY');
    process.exit(1);
  }

  render(<Dashboard initialModelId={modelId} />);
}
