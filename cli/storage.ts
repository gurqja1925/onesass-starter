import * as fs from 'fs';
import * as path from 'path';

const PROJECT_MARKER = 'onesaas.json';

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
  return path.join(findProjectRoot(startDir), '.onesaas');
}

export function ensureProjectStorageDir(startDir: string = process.cwd()): string {
  const dir = getProjectStorageDir(startDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
  return dir;
}
