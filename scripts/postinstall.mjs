#!/usr/bin/env node

/**
 * postinstall 스크립트
 * pnpm install 후 자동으로 실행
 *
 * - .env 파일이 없으면 .env.example 복사
 * - 설정 안내 메시지 표시
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const envPath = path.join(rootDir, '.env')
const envExamplePath = path.join(rootDir, '.env.example')

// 색상 코드
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

// CI 환경에서는 조용히
if (process.env.CI || process.env.VERCEL) {
  process.exit(0)
}

console.log('')
console.log(`${c.cyan}╔═══════════════════════════════════════════════╗${c.reset}`)
console.log(`${c.cyan}║${c.reset}                                               ${c.cyan}║${c.reset}`)
console.log(`${c.cyan}║${c.reset}   ${c.bold}OneSaaS Starter${c.reset} 설치 완료!                  ${c.cyan}║${c.reset}`)
console.log(`${c.cyan}║${c.reset}                                               ${c.cyan}║${c.reset}`)
console.log(`${c.cyan}╚═══════════════════════════════════════════════╝${c.reset}`)
console.log('')

// .env 파일 체크
const envExists = fs.existsSync(envPath)
const envExampleExists = fs.existsSync(envExamplePath)

if (!envExists) {
  // .env.example이 있으면 복사
  if (envExampleExists) {
    fs.copyFileSync(envExamplePath, envPath)
    console.log(`${c.green}✓${c.reset} .env 파일이 생성되었습니다.`)
    console.log('')
  }

  // 설정 필요 안내
  console.log(`${c.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`)
  console.log(`${c.red}${c.bold}  ⚠  중요: 설정이 필요합니다!${c.reset}`)
  console.log(`${c.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`)
  console.log('')
  console.log(`  .env 파일에 ${c.bold}Supabase 데이터베이스${c.reset} 정보가 필요합니다.`)
  console.log('')
  console.log(`  ${c.dim}Supabase가 없으면:${c.reset}`)
  console.log(`  https://supabase.com 에서 무료로 만들 수 있어요`)
  console.log('')
  console.log(`${c.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`)
  console.log('')
  console.log(`  ${c.bold}설정 마법사 실행:${c.reset}`)
  console.log('')
  console.log(`    ${c.cyan}pnpm setup${c.reset}`)
  console.log('')
  console.log(`  ${c.dim}↑ 이 명령어를 실행하면 단계별로 안내해드려요!${c.reset}`)
  console.log('')
  console.log(`${c.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`)
  console.log('')

} else {
  // .env가 있는 경우 - 내용 체크
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const hasDbUrl = envContent.includes('DATABASE_URL=') && !envContent.includes('DATABASE_URL=""')
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') && !envContent.includes('NEXT_PUBLIC_SUPABASE_URL=""')

  if (!hasDbUrl || !hasSupabaseUrl) {
    console.log(`${c.yellow}⚠${c.reset}  .env 파일에 데이터베이스 설정이 비어있습니다.`)
    console.log('')
    console.log(`   ${c.bold}설정 마법사 실행:${c.reset}`)
    console.log(`   ${c.cyan}pnpm setup${c.reset}`)
    console.log('')
  } else {
    console.log(`${c.green}✓${c.reset} .env 파일이 설정되어 있습니다.`)
    console.log('')
    console.log(`${c.bold}다음 단계:${c.reset}`)
    console.log('')
    console.log(`  1. 데이터베이스 스키마 적용 (처음만)`)
    console.log(`     ${c.cyan}pnpm db:push${c.reset}`)
    console.log('')
    console.log(`  2. 개발 서버 실행`)
    console.log(`     ${c.cyan}pnpm dev${c.reset}`)
    console.log('')
    console.log(`  3. K-Code AI 코딩 (선택)`)
    console.log(`     ${c.cyan}pnpm kcode "버그 수정해줘"${c.reset}`)
    console.log('')
  }
}

console.log(`${c.dim}문서: http://localhost:3000/docs${c.reset}`)
console.log('')
