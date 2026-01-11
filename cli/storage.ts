import * as fs from 'fs';
import * as path from 'path';

const PROJECT_MARKER = 'onesaas.json';
const STORAGE_DIR_NAME = '.kcode'; // 프로젝트별 K-Code 설정 폴더

// ============================================================
// 프로젝트 메타데이터
// ============================================================

export interface ProjectMetadata {
  name: string;
  type: 'onesaas' | 'nextjs' | 'react' | 'node' | 'unknown';
  createdAt: string;
  lastUsedAt: string;
  totalSessions: number;
  totalTasks: number;
  totalTokens: number;
  totalCost: number;
}

export interface SessionData {
  id: string;
  startedAt: string;
  endedAt?: string;
  tasks: Array<{
    id: string;
    prompt: string;
    status: 'running' | 'completed' | 'failed';
    tokens?: number;
    cost?: number;
    filesChanged?: string[];
    startedAt: string;
    completedAt?: string;
  }>;
  totalTokens: number;
  totalCost: number;
}

// ============================================================
// 프로젝트 루트 찾기
// ============================================================

export function findProjectRoot(startDir: string = process.cwd()): string {
  let current = path.resolve(startDir);
  while (true) {
    const marker = path.join(current, PROJECT_MARKER);
    if (fs.existsSync(marker)) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return path.resolve(startDir);
    }
    current = parent;
  }
}

export function getProjectStorageDir(startDir: string = process.cwd()): string {
  return path.join(findProjectRoot(startDir), STORAGE_DIR_NAME);
}

export function ensureProjectStorageDir(startDir: string = process.cwd()): string {
  const dir = getProjectStorageDir(startDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });

    // .gitignore 생성 (API 키 보안)
    const gitignorePath = path.join(dir, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath,
        '# K-Code - API 키와 세션 기록 보안\n' +
        'config.json\n' +
        'sessions/\n' +
        '*.log\n'
      );
    }
  }
  return dir;
}

// ============================================================
// 세션 디렉토리
// ============================================================

export function getSessionsDir(startDir: string = process.cwd()): string {
  const storageDir = ensureProjectStorageDir(startDir);
  const sessionsDir = path.join(storageDir, 'sessions');
  if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true, mode: 0o700 });
  }
  return sessionsDir;
}

export function generateSessionId(): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${dateStr}-${timeStr}-${randomStr}`;
}

export function saveSession(sessionData: SessionData, startDir: string = process.cwd()): void {
  const sessionsDir = getSessionsDir(startDir);
  const sessionFile = path.join(sessionsDir, `${sessionData.id}.json`);
  fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2), { mode: 0o600 });
}

export function loadSession(sessionId: string, startDir: string = process.cwd()): SessionData | null {
  const sessionsDir = getSessionsDir(startDir);
  const sessionFile = path.join(sessionsDir, `${sessionId}.json`);
  if (!fs.existsSync(sessionFile)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
}

export function listSessions(startDir: string = process.cwd()): string[] {
  const sessionsDir = getSessionsDir(startDir);
  if (!fs.existsSync(sessionsDir)) {
    return [];
  }
  return fs.readdirSync(sessionsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .sort()
    .reverse(); // 최신순
}

// ============================================================
// 프로젝트 메타데이터
// ============================================================

export function getProjectMetadataPath(startDir: string = process.cwd()): string {
  const storageDir = ensureProjectStorageDir(startDir);
  return path.join(storageDir, 'project.json');
}

export function loadProjectMetadata(startDir: string = process.cwd()): ProjectMetadata {
  const metadataPath = getProjectMetadataPath(startDir);

  if (!fs.existsSync(metadataPath)) {
    // 프로젝트 타입 감지
    const projectRoot = findProjectRoot(startDir);
    let projectType: ProjectMetadata['type'] = 'unknown';

    if (fs.existsSync(path.join(projectRoot, 'onesaas.json'))) {
      projectType = 'onesaas';
    } else if (fs.existsSync(path.join(projectRoot, 'next.config.js')) ||
               fs.existsSync(path.join(projectRoot, 'next.config.mjs'))) {
      projectType = 'nextjs';
    } else if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
      const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));
      if (pkg.dependencies?.react) {
        projectType = 'react';
      } else {
        projectType = 'node';
      }
    }

    // 초기 메타데이터 생성
    const metadata: ProjectMetadata = {
      name: path.basename(projectRoot),
      type: projectType,
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
      totalSessions: 0,
      totalTasks: 0,
      totalTokens: 0,
      totalCost: 0,
    };

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), { mode: 0o600 });
    return metadata;
  }

  return JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
}

export function saveProjectMetadata(metadata: ProjectMetadata, startDir: string = process.cwd()): void {
  const metadataPath = getProjectMetadataPath(startDir);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), { mode: 0o600 });
}

export function updateProjectMetadata(
  updates: Partial<ProjectMetadata>,
  startDir: string = process.cwd()
): void {
  const metadata = loadProjectMetadata(startDir);
  Object.assign(metadata, updates);
  metadata.lastUsedAt = new Date().toISOString();
  saveProjectMetadata(metadata, startDir);
}
