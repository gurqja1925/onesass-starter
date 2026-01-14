#!/usr/bin/env node

/**
 * postinstall 스크립트
 * pnpm install 후 자동으로 실행
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const envPath = path.join(rootDir, '.env')
const envExamplePath = path.join(rootDir, '.env.example')

// CI 환경에서는 조용히
if (process.env.CI || process.env.VERCEL) {
  process.exit(0)
}

// .env 파일이 없으면 .env.example 복사
if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath)
}
