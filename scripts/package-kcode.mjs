#!/usr/bin/env node

/**
 * K-Code CLI npm 패키지 준비 스크립트
 *
 * 1. cli-dist/ → packages/kcode/dist/ 복사
 * 2. tsup.config.ts, CLI 소스 파일들 복사
 * 3. LICENSE 파일 생성
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const packageDir = path.join(rootDir, 'packages', 'kcode');
const distDir = path.join(packageDir, 'dist');
const srcDir = path.join(packageDir, 'src');

console.log('📦 K-Code 패키지 준비 중...\n');

// 1. packages/kcode/dist 디렉토리 생성
if (fs.existsSync(distDir)) {
  console.log('🗑️  기존 dist 폴더 삭제...');
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });
console.log('✅ dist 폴더 생성');

// 2. cli-dist/ → packages/kcode/dist/ 복사
console.log('📁 빌드 파일 복사 중...');
const cliDistDir = path.join(rootDir, 'cli-dist');
if (fs.existsSync(cliDistDir)) {
  const files = fs.readdirSync(cliDistDir);
  files.forEach(file => {
    fs.copyFileSync(
      path.join(cliDistDir, file),
      path.join(distDir, file)
    );
  });
  console.log(`✅ ${files.length}개 파일 복사 완료`);
} else {
  console.error('❌ cli-dist/ 폴더가 없습니다. pnpm cli:build를 먼저 실행하세요.');
  process.exit(1);
}

// 3. src/ 디렉토리 생성 및 소스 복사
if (fs.existsSync(srcDir)) {
  fs.rmSync(srcDir, { recursive: true, force: true });
}
fs.mkdirSync(srcDir, { recursive: true });

console.log('📄 소스 파일 복사 중...');
const cliDir = path.join(rootDir, 'cli');
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyDir(cliDir, srcDir);
console.log('✅ 소스 파일 복사 완료');

// 4. tsup.config.ts 복사
const tsupConfig = path.join(rootDir, 'tsup.config.ts');
if (fs.existsSync(tsupConfig)) {
  fs.copyFileSync(tsupConfig, path.join(packageDir, 'tsup.config.ts'));
  console.log('✅ tsup.config.ts 복사');
}

// 5. LICENSE 파일 생성 (MIT)
const licenseContent = `MIT License

Copyright (c) 2026 OneSaaS Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
fs.writeFileSync(path.join(packageDir, 'LICENSE'), licenseContent);
console.log('✅ LICENSE 파일 생성');

// 6. .npmignore 생성
const npmignoreContent = `# 소스 파일 (dist만 배포)
src/
tsup.config.ts

# 개발 파일
*.log
.DS_Store
node_modules/
.env*

# Git
.git/
.gitignore
`;
fs.writeFileSync(path.join(packageDir, '.npmignore'), npmignoreContent);
console.log('✅ .npmignore 파일 생성');

console.log('\n✨ K-Code 패키지 준비 완료!');
console.log(`\n📍 패키지 위치: ${packageDir}`);
console.log('\n다음 명령어로 배포하세요:');
console.log('  pnpm kcode:publish:patch   # 패치 버전 (1.0.0 → 1.0.1)');
console.log('  pnpm kcode:publish:minor   # 마이너 버전 (1.0.0 → 1.1.0)');
console.log('  pnpm kcode:publish:major   # 메이저 버전 (1.0.0 → 2.0.0)');
console.log('  pnpm kcode:publish:dry     # 테스트 (실제 배포 안함)');
