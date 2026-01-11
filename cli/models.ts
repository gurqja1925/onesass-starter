/**
 * K 코드 - 다중 모델 지원
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { decryptString, encryptString, getEncryptionKey } from './crypto';
import { ensureProjectStorageDir, getProjectStorageDir } from './storage';

// API 키 저장 경로 (프로젝트 내부 .onesaas/config.json)
const CONFIG_FILE_NAME = 'config.json';
const LEGACY_CONFIG_DIR = path.join(os.homedir(), '.onesaas');
const LEGACY_CONFIG_FILE = path.join(LEGACY_CONFIG_DIR, 'config');

export type Provider = 'deepseek' | 'minimax' | 'qwen' | 'google' | 'groq';

export type TaskType = '문서작성' | '코딩' | '테스트' | '추론' | '빠른작업';

export interface ModelInfo {
  id: string;
  number: number; // 모델 번호 (1~8)
  name: string;
  provider: Provider;
  model: string;
  description: string;
  maxTokens: number;
  contextWindow: number;
  inputPrice: number;
  outputPrice: number;
  avgPrice: number; // 평균 가격 (하나의 숫자)
  baseUrl: string;
  bestFor: TaskType[]; // 적합한 작업 유형
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
// 사용 가능한 모델 목록 (가격순 정렬)
// ============================================================

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'deepseek',
    number: 1,
    name: 'DeepSeek V3.2',
    provider: 'deepseek',
    model: 'deepseek-chat',
    description: '$0.35',
    maxTokens: 8192,
    contextWindow: 128000,
    inputPrice: 0.28,
    outputPrice: 0.42,
    avgPrice: 0.35,
    baseUrl: 'https://api.deepseek.com',
    bestFor: ['코딩', '테스트'],
    capabilities: {
      vision: false,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: false,
    },
    releaseDate: '2026-01-10',
  },
  {
    id: 'qwen-turbo',
    number: 2,
    name: 'Qwen Turbo',
    provider: 'qwen',
    model: 'qwen-turbo-latest',
    description: '$0.125',
    maxTokens: 8192,
    contextWindow: 128000,
    inputPrice: 0.05,
    outputPrice: 0.20,
    avgPrice: 0.125,
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode',
    bestFor: ['문서작성', '빠른작업'],
    capabilities: {
      vision: false,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: false,
    },
    releaseDate: '2024-09-19',
  },
  {
    id: 'minimax-m21',
    number: 3,
    name: 'MiniMax M2.1',
    provider: 'minimax',
    model: 'abab-m2.1',
    description: '$0.175',
    maxTokens: 8192,
    contextWindow: 245000,
    inputPrice: 0.07,
    outputPrice: 0.28,
    avgPrice: 0.175,
    baseUrl: 'https://api.minimax.chat',
    bestFor: ['코딩', '문서작성'],
    capabilities: {
      vision: false,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: false,
    },
    releaseDate: '2025-12-22',
  },
  {
    id: 'groq-qwen3',
    number: 4,
    name: 'Qwen3 32B (Groq)',
    provider: 'groq',
    model: 'qwen3-32b',
    description: '$0.24',
    maxTokens: 32768,
    contextWindow: 128000,
    inputPrice: 0.24,
    outputPrice: 0.24,
    avgPrice: 0.24,
    baseUrl: 'https://api.groq.com/openai',
    bestFor: ['빠른작업', '코딩'],
    capabilities: {
      vision: false,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: false,
    },
    releaseDate: '2026-04-29',
  },
  {
    id: 'qwen3-235b',
    number: 5,
    name: 'Qwen3 235B',
    provider: 'qwen',
    model: 'qwen3-235b-a22b',
    description: '$0.6',
    maxTokens: 32768,
    contextWindow: 1000000,
    inputPrice: 0.2,
    outputPrice: 1.0,
    avgPrice: 0.6,
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode',
    bestFor: ['문서작성', '추론'],
    capabilities: {
      vision: false,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: true,
    },
    releaseDate: '2026-04-29',
  },
  {
    id: 'groq-llama-70b',
    number: 6,
    name: 'Llama 3.3 70B (Groq)',
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    description: '$0.69',
    maxTokens: 32768,
    contextWindow: 128000,
    inputPrice: 0.59,
    outputPrice: 0.79,
    avgPrice: 0.69,
    baseUrl: 'https://api.groq.com/openai',
    bestFor: ['빠른작업', '문서작성'],
    capabilities: {
      vision: false,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: false,
    },
    releaseDate: '2024-12-06',
  },
  {
    id: 'deepseek-reasoner',
    number: 7,
    name: 'DeepSeek Reasoner',
    provider: 'deepseek',
    model: 'deepseek-reasoner',
    description: '$1.37',
    maxTokens: 8192,
    contextWindow: 128000,
    inputPrice: 0.55,
    outputPrice: 2.19,
    avgPrice: 1.37,
    baseUrl: 'https://api.deepseek.com',
    bestFor: ['추론'],
    capabilities: {
      vision: false,
      functionCalling: false,
      streaming: true,
      json: true,
      reasoning: true,
    },
    releaseDate: '2026-01-20',
  },
  {
    id: 'gemini-3-flash',
    number: 8,
    name: 'Gemini 3 Flash',
    provider: 'google',
    model: 'gemini-3-flash',
    description: '$1.75',
    maxTokens: 8192,
    contextWindow: 1000000,
    inputPrice: 0.5,
    outputPrice: 3,
    avgPrice: 1.75,
    baseUrl: 'https://generativelanguage.googleapis.com',
    bestFor: ['문서작성', '빠른작업'],
    capabilities: {
      vision: true,
      functionCalling: true,
      streaming: true,
      json: true,
      reasoning: false,
    },
    releaseDate: '2026-01-01',
  },
];

// 현재 선택된 모델 ID
let currentModelId = 'deepseek';

// ============================================================
// 모델 함수
// ============================================================

/**
 * 사용 가능한 최고의 모델 찾기
 * 우선순위: DeepSeek 기본, 그 다음 가격순
 */
export function getBestAvailableModel(): ModelInfo {
  // 1. DeepSeek V3.2 (기본)
  const deepseek = AVAILABLE_MODELS.find(m => m.id === 'deepseek');
  if (deepseek && getApiKey('deepseek')) {
    return deepseek;
  }

  // 2. Qwen Turbo (저렴)
  const qwen = AVAILABLE_MODELS.find(m => m.id === 'qwen-turbo');
  if (qwen && getApiKey('qwen')) {
    return qwen;
  }

  // 3. MiniMax M2.1
  const minimax = AVAILABLE_MODELS.find(m => m.id === 'minimax-m21');
  if (minimax && getApiKey('minimax')) {
    return minimax;
  }

  // 4. Groq
  const groq = AVAILABLE_MODELS.find(m => m.id === 'groq-qwen3');
  if (groq && getApiKey('groq')) {
    return groq;
  }

  // 5. Google
  const google = AVAILABLE_MODELS.find(m => m.id === 'gemini-3-flash');
  if (google && getApiKey('google')) {
    return google;
  }

  // 기본값: DeepSeek
  return AVAILABLE_MODELS.find(m => m.id === 'deepseek') || AVAILABLE_MODELS[0];
}

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
  return AVAILABLE_MODELS.find(m => m.id === 'deepseek') || AVAILABLE_MODELS[0];
}

// ============================================================
// API 키 관리 (프로바이더별)
// ============================================================

interface Config {
  deepseekApiKeyEnc?: string;
  minimaxApiKeyEnc?: string;
  qwenApiKeyEnc?: string;
  googleApiKeyEnc?: string;
  groqApiKeyEnc?: string;
  defaultModel?: string;
  taskModels?: Record<TaskType, number>; // 작업별 모델 번호
}

function readConfigFile(filePath: string): Config {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // 파일 읽기 실패 시 무시
  }
  return {};
}

// 전역 설정 디렉토리 (API 키는 모든 프로젝트에서 공유)
function ensureGlobalConfigDir(): string {
  if (!fs.existsSync(LEGACY_CONFIG_DIR)) {
    fs.mkdirSync(LEGACY_CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
  return LEGACY_CONFIG_DIR;
}

function getConfigFilePath(): string {
  const dir = ensureGlobalConfigDir();
  return path.join(dir, CONFIG_FILE_NAME);
}

function loadConfig(): Config {
  const configFile = getConfigFilePath();
  const config = readConfigFile(configFile);
  if (Object.keys(config).length > 0) {
    return config;
  }

  const legacy = readConfigFile(LEGACY_CONFIG_FILE);
  if (Object.keys(legacy).length > 0) {
    const migrated = migrateLegacyConfig(legacy);
    saveConfig(migrated);
    return migrated;
  }
  return {};
}

function saveConfig(config: Config): boolean {
  try {
    const configFile = getConfigFilePath();
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2), { mode: 0o600 });
    return true;
  } catch {
    return false;
  }
}

function migrateLegacyConfig(legacy: Config & {
  deepseekApiKey?: string;
  minimaxApiKey?: string;
  qwenApiKey?: string;
  googleApiKey?: string;
  groqApiKey?: string;
}): Config {
  const config: Config = { defaultModel: legacy.defaultModel };
  const storageDir = ensureGlobalConfigDir();
  const key = getEncryptionKey({ allowCreate: true, storageDir });

  if (legacy.deepseekApiKey && key) {
    config.deepseekApiKeyEnc = encryptString(legacy.deepseekApiKey, key);
  }
  if (legacy.minimaxApiKey && key) {
    config.minimaxApiKeyEnc = encryptString(legacy.minimaxApiKey, key);
  }
  if (legacy.qwenApiKey && key) {
    config.qwenApiKeyEnc = encryptString(legacy.qwenApiKey, key);
  }
  if (legacy.googleApiKey && key) {
    config.googleApiKeyEnc = encryptString(legacy.googleApiKey, key);
  }
  if (legacy.groqApiKey && key) {
    config.groqApiKeyEnc = encryptString(legacy.groqApiKey, key);
  }

  return config;
}

function decryptApiKey(value?: string): string | undefined {
  if (!value) return undefined;
  const storageDir = ensureGlobalConfigDir();
  const key = getEncryptionKey({ allowCreate: false, storageDir });
  if (!key) return undefined;
  try {
    return decryptString(value, key);
  } catch {
    return undefined;
  }
}

function encryptApiKey(value: string): string | undefined {
  const storageDir = ensureGlobalConfigDir();
  const key = getEncryptionKey({ allowCreate: true, storageDir });
  if (!key) return undefined;
  return encryptString(value, key);
}

// API 키 로드 (환경변수 → 로컬 파일)
export function getApiKey(provider?: Provider): string | undefined {
  const config = loadConfig();

  // provider가 지정되지 않으면 현재 모델의 provider 사용
  const p = provider || getCurrentModel().provider;

  switch (p) {
    case 'deepseek':
      return process.env.DEEPSEEK_API_KEY || decryptApiKey(config.deepseekApiKeyEnc);
    case 'minimax':
      return process.env.MINIMAX_API_KEY || decryptApiKey(config.minimaxApiKeyEnc);
    case 'qwen':
      return process.env.QWEN_API_KEY || decryptApiKey(config.qwenApiKeyEnc);
    case 'google':
      return process.env.GOOGLE_API_KEY || decryptApiKey(config.googleApiKeyEnc);
    case 'groq':
      return process.env.GROQ_API_KEY || decryptApiKey(config.groqApiKeyEnc);
    default:
      return undefined;
  }
}

// API 키 저장
export function saveApiKey(apiKey: string, provider?: Provider): boolean {
  const config = loadConfig();
  const p = provider || 'qwen';
  const encrypted = encryptApiKey(apiKey);
  if (!encrypted) {
    return false;
  }

  switch (p) {
    case 'deepseek':
      config.deepseekApiKeyEnc = encrypted;
      break;
    case 'minimax':
      config.minimaxApiKeyEnc = encrypted;
      break;
    case 'qwen':
      config.qwenApiKeyEnc = encrypted;
      break;
    case 'google':
      config.googleApiKeyEnc = encrypted;
      break;
    case 'groq':
      config.groqApiKeyEnc = encrypted;
      break;
  }

  return saveConfig(config);
}

// API 키 삭제
export function deleteApiKey(provider?: Provider): boolean {
  const config = loadConfig();
  const p = provider || 'qwen';

  switch (p) {
    case 'deepseek':
      delete config.deepseekApiKeyEnc;
      break;
    case 'minimax':
      delete config.minimaxApiKeyEnc;
      break;
    case 'qwen':
      delete config.qwenApiKeyEnc;
      break;
    case 'google':
      delete config.googleApiKeyEnc;
      break;
    case 'groq':
      delete config.groqApiKeyEnc;
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

// ============================================================
// 작업별 모델 설정
// ============================================================

/**
 * 번호로 모델 찾기
 */
export function getModelByNumber(num: number): ModelInfo | undefined {
  return AVAILABLE_MODELS.find(m => m.number === num);
}

/**
 * 작업별 모델 설정 가져오기
 */
export function getTaskModels(): Record<TaskType, number> {
  const config = loadConfig();
  return config.taskModels || {
    '문서작성': 1, // DeepSeek (기본)
    '코딩': 1,     // DeepSeek (기본)
    '테스트': 1,   // DeepSeek (기본)
    '추론': 7,     // DeepSeek Reasoner
    '빠른작업': 1, // DeepSeek (기본)
  };
}

/**
 * 작업별 모델 설정
 */
export function setTaskModel(taskType: TaskType, modelNumber: number): boolean {
  const model = getModelByNumber(modelNumber);
  if (!model) return false;

  const config = loadConfig();
  if (!config.taskModels) {
    config.taskModels = getTaskModels();
  }
  config.taskModels[taskType] = modelNumber;
  return saveConfig(config);
}

/**
 * 모든 작업별 모델 한번에 설정
 */
export function setAllTaskModels(taskModels: Record<TaskType, number>): boolean {
  const config = loadConfig();
  config.taskModels = taskModels;
  return saveConfig(config);
}

/**
 * 작업 유형에 맞는 모델 가져오기
 */
export function getModelForTask(taskType: TaskType): ModelInfo {
  const taskModels = getTaskModels();
  const modelNumber = taskModels[taskType];
  const model = getModelByNumber(modelNumber);

  if (model && getApiKey(model.provider)) {
    return model;
  }

  // API 키가 없으면 기본 모델 사용
  return getBestAvailableModel();
}
