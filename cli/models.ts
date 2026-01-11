/**
 * K 코드 - 다중 모델 지원
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// API 키 저장 경로 (~/.onesaas/config)
const CONFIG_DIR = path.join(os.homedir(), '.onesaas');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config');

export type Provider = 'deepseek' | 'openai' | 'anthropic';

export interface ModelInfo {
  id: string;
  name: string;
  provider: Provider;
  model: string;
  description: string;
  maxTokens: number;
  contextWindow: number;
  inputPrice: number;
  outputPrice: number;
  baseUrl: string;
  capabilities: {
    vision?: boolean;
    functionCalling?: boolean;
    streaming?: boolean;
    json?: boolean;
    reasoning?: boolean;
  };
  releaseDate?: string;
}

// ============================================================
// 사용 가능한 모델 목록
// ============================================================

export const AVAILABLE_MODELS: ModelInfo[] = [
  // DeepSeek
  {
    id: 'deepseek',
    name: 'DeepSeek V3',
    provider: 'deepseek',
    model: 'deepseek-chat',
    description: '가성비 최고. 코딩 구현에 적합.',
    maxTokens: 8192,
    contextWindow: 128000,
    inputPrice: 0.27,
    outputPrice: 1.1,
    baseUrl: 'https://api.deepseek.com',
    capabilities: {
      vision: false,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: false,
    },
    releaseDate: '2025-01-10',
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: 'deepseek',
    model: 'deepseek-reasoner',
    description: '추론 특화. 분석/설계에 최적.',
    maxTokens: 8192,
    contextWindow: 128000,
    inputPrice: 0.55,  // 추론 모드는 더 비쌈
    outputPrice: 2.19,
    baseUrl: 'https://api.deepseek.com',
    capabilities: {
      vision: false,
      functionCalling: false,  // Reasoner는 function calling 미지원
      streaming: true,
      json: true,
      reasoning: true,
    },
    releaseDate: '2025-01-20',
  },
  // OpenAI
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    model: 'gpt-4o',
    description: 'OpenAI 최신 모델. 빠르고 강력함.',
    maxTokens: 16384,
    contextWindow: 128000,
    inputPrice: 2.5,
    outputPrice: 10,
    baseUrl: 'https://api.openai.com',
    capabilities: {
      vision: true,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: true,
    },
    releaseDate: '2024-05-13',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    model: 'gpt-4o-mini',
    description: 'GPT-4o 경량 버전. 빠르고 저렴함.',
    maxTokens: 16384,
    contextWindow: 128000,
    inputPrice: 0.15,
    outputPrice: 0.6,
    baseUrl: 'https://api.openai.com',
    capabilities: {
      vision: true,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: false,
    },
    releaseDate: '2024-07-18',
  },
  {
    id: 'o1',
    name: 'OpenAI o1',
    provider: 'openai',
    model: 'o1',
    description: '추론 특화 모델. 복잡한 문제 해결.',
    maxTokens: 100000,
    contextWindow: 200000,
    inputPrice: 15,
    outputPrice: 60,
    baseUrl: 'https://api.openai.com',
    capabilities: {
      vision: true,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: true,
    },
    releaseDate: '2024-12-17',
  },
  // Anthropic
  {
    id: 'claude-sonnet',
    name: 'Claude 4 Sonnet',
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
    description: 'Anthropic 최신 균형 모델.',
    maxTokens: 16000,
    contextWindow: 200000,
    inputPrice: 3,
    outputPrice: 15,
    baseUrl: 'https://api.anthropic.com',
    capabilities: {
      vision: true,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: true,
    },
    releaseDate: '2025-05-14',
  },
  {
    id: 'claude-opus',
    name: 'Claude 4.5 Opus',
    provider: 'anthropic',
    model: 'claude-opus-4-5-20251101',
    description: 'Anthropic 최강 모델. 복잡한 작업에 최적.',
    maxTokens: 16000,
    contextWindow: 200000,
    inputPrice: 15,
    outputPrice: 75,
    baseUrl: 'https://api.anthropic.com',
    capabilities: {
      vision: true,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: true,
    },
    releaseDate: '2025-11-01',
  },
  {
    id: 'claude-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    model: 'claude-3-5-haiku-20241022',
    description: 'Anthropic 경량 모델. 빠르고 저렴.',
    maxTokens: 8192,
    contextWindow: 200000,
    inputPrice: 0.8,
    outputPrice: 4,
    baseUrl: 'https://api.anthropic.com',
    capabilities: {
      vision: true,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: false,
    },
    releaseDate: '2024-10-22',
  },
];

// 현재 선택된 모델 ID
let currentModelId = 'deepseek';

// ============================================================
// 모델 함수
// ============================================================

export function getCurrentModel(): ModelInfo {
  return AVAILABLE_MODELS.find(m => m.id === currentModelId) || AVAILABLE_MODELS[0];
}

export function setCurrentModel(modelId: string): ModelInfo | null {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  if (model) {
    currentModelId = modelId;
    return model;
  }
  return null;
}

export function getAvailableModels(): ModelInfo[] {
  return AVAILABLE_MODELS;
}

export function getDefaultModel(): ModelInfo {
  return AVAILABLE_MODELS[0];
}

// ============================================================
// API 키 관리 (프로바이더별)
// ============================================================

interface Config {
  deepseekApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  defaultModel?: string;
}

function loadConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // 파일 읽기 실패 시 무시
  }
  return {};
}

function saveConfig(config: Config): boolean {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), { mode: 0o600 });
    return true;
  } catch {
    return false;
  }
}

// API 키 로드 (환경변수 → 로컬 파일)
export function getApiKey(provider?: Provider): string | undefined {
  const config = loadConfig();

  // provider가 지정되지 않으면 현재 모델의 provider 사용
  const p = provider || getCurrentModel().provider;

  switch (p) {
    case 'deepseek':
      return process.env.DEEPSEEK_API_KEY || config.deepseekApiKey;
    case 'openai':
      return process.env.OPENAI_API_KEY || config.openaiApiKey;
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY || config.anthropicApiKey;
    default:
      return undefined;
  }
}

// API 키 저장
export function saveApiKey(apiKey: string, provider?: Provider): boolean {
  const config = loadConfig();
  const p = provider || 'deepseek';

  switch (p) {
    case 'deepseek':
      config.deepseekApiKey = apiKey;
      break;
    case 'openai':
      config.openaiApiKey = apiKey;
      break;
    case 'anthropic':
      config.anthropicApiKey = apiKey;
      break;
  }

  return saveConfig(config);
}

// API 키 삭제
export function deleteApiKey(provider?: Provider): boolean {
  const config = loadConfig();
  const p = provider || 'deepseek';

  switch (p) {
    case 'deepseek':
      delete config.deepseekApiKey;
      break;
    case 'openai':
      delete config.openaiApiKey;
      break;
    case 'anthropic':
      delete config.anthropicApiKey;
      break;
  }

  return saveConfig(config);
}

// 기본 모델 저장/로드
export function getDefaultModelId(): string {
  const config = loadConfig();
  return config.defaultModel || 'deepseek';
}

export function setDefaultModelId(modelId: string): boolean {
  const config = loadConfig();
  config.defaultModel = modelId;
  return saveConfig(config);
}
