#!/usr/bin/env node

/**
 * Vercel 빌드 스크립트
 *
 * 1. Supabase 프로젝트 확인/생성
 * 2. DATABASE_URL 자동 설정
 * 3. Prisma generate
 * 4. Next.js build
 *
 * 필요한 환경변수:
 * - SUPABASE_ACCESS_TOKEN: Supabase Management API 토큰
 * - SUPABASE_ORG_ID: 조직 ID (없으면 자동 조회)
 * - SUPABASE_PROJECT_NAME: 프로젝트 이름 (기본: VERCEL_PROJECT_NAME 또는 'onesaas-app')
 * - SUPABASE_DB_PASSWORD: 데이터베이스 비밀번호 (없으면 자동 생성)
 * - SUPABASE_REGION: 리전 (기본: ap-northeast-2, 서울)
 */

import { execSync } from 'child_process'
import https from 'https'
import crypto from 'crypto'

const SUPABASE_API_BASE = 'https://api.supabase.com/v1'

// 색상
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
}

function log(msg) {
  console.log(`${c.green}✓${c.reset} ${msg}`)
}

function warn(msg) {
  console.log(`${c.yellow}⚠${c.reset} ${msg}`)
}

function error(msg) {
  console.log(`${c.red}✕${c.reset} ${msg}`)
}

function info(msg) {
  console.log(`${c.cyan}ℹ${c.reset} ${msg}`)
}

// ============================================================
// Supabase API
// ============================================================

function supabaseRequest(method, endpoint, accessToken, body = null) {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_API_BASE}${endpoint}`
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }

    const req = https.request(url, options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(data ? JSON.parse(data) : {})
          } catch {
            resolve(data)
          }
        } else if (res.statusCode === 401) {
          reject(new Error('SUPABASE_ACCESS_TOKEN이 유효하지 않습니다.'))
        } else {
          reject(new Error(`Supabase API 오류: ${res.statusCode} - ${data}`))
        }
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }
    req.end()
  })
}

async function getOrganizations(token) {
  return supabaseRequest('GET', '/organizations', token)
}

async function getProjects(token) {
  return supabaseRequest('GET', '/projects', token)
}

async function getProject(token, ref) {
  return supabaseRequest('GET', `/projects/${ref}`, token)
}

async function getApiKeys(token, ref) {
  return supabaseRequest('GET', `/projects/${ref}/api-keys`, token)
}

async function createProject(token, orgId, name, dbPassword, region) {
  return supabaseRequest('POST', '/projects', token, {
    organization_id: orgId,
    name,
    db_pass: dbPassword,
    region,
    plan: 'free',
  })
}

async function waitForProjectReady(token, ref, maxWaitMs = 300000) {
  const startTime = Date.now()
  const checkInterval = 10000 // 10초마다

  info(`프로젝트 생성 중... (최대 5분 대기)`)

  while (Date.now() - startTime < maxWaitMs) {
    try {
      const project = await getProject(token, ref)
      if (project.status === 'ACTIVE_HEALTHY') {
        return project
      }
      process.stdout.write('.')
    } catch {
      // 아직 준비 안 됨
    }
    await new Promise(resolve => setTimeout(resolve, checkInterval))
  }

  throw new Error('프로젝트 생성 시간 초과 (5분)')
}

// ============================================================
// 메인 로직
// ============================================================

async function main() {
  console.log('')
  console.log(`${c.cyan}━━━ Vercel Build: Supabase 설정 ━━━${c.reset}`)
  console.log('')

  const accessToken = process.env.SUPABASE_ACCESS_TOKEN
  const existingDbUrl = process.env.DATABASE_URL

  // 1. 이미 DATABASE_URL이 있으면 바로 빌드
  if (existingDbUrl && existingDbUrl.includes('supabase')) {
    log('DATABASE_URL이 설정되어 있습니다.')
    await runBuild()
    return
  }

  // 2. SUPABASE_ACCESS_TOKEN이 없으면 에러
  if (!accessToken) {
    console.log('')
    error('데이터베이스 설정이 없습니다!')
    console.log('')
    console.log(`${c.yellow}다음 중 하나를 설정하세요:${c.reset}`)
    console.log('')
    console.log(`  ${c.bold}옵션 1: DATABASE_URL 직접 설정${c.reset}`)
    console.log(`  Vercel 환경변수에 DATABASE_URL 추가`)
    console.log('')
    console.log(`  ${c.bold}옵션 2: 자동 생성 (추천)${c.reset}`)
    console.log(`  다음 환경변수를 Vercel에 추가:`)
    console.log(`    - SUPABASE_ACCESS_TOKEN (필수)`)
    console.log(`    - SUPABASE_DB_PASSWORD (필수)`)
    console.log(`    - SUPABASE_ORG_ID (선택, 없으면 첫 번째 조직 사용)`)
    console.log('')
    console.log(`  ${c.dim}Access Token 발급: https://supabase.com/dashboard/account/tokens${c.reset}`)
    console.log('')
    process.exit(1)
  }

  // 3. 자동 생성 모드
  info('Supabase 자동 설정 모드')

  // 프로젝트 이름 결정
  const projectName = process.env.SUPABASE_PROJECT_NAME
    || process.env.VERCEL_PROJECT_NAME
    || 'onesaas-app'

  // DB 비밀번호
  const dbPassword = process.env.SUPABASE_DB_PASSWORD
  if (!dbPassword) {
    error('SUPABASE_DB_PASSWORD 환경변수가 필요합니다.')
    console.log('')
    console.log(`${c.dim}Vercel 환경변수에 안전한 비밀번호를 설정하세요.${c.reset}`)
    console.log(`${c.dim}예: openssl rand -base64 24${c.reset}`)
    console.log('')
    process.exit(1)
  }

  // 리전
  const region = process.env.SUPABASE_REGION || 'ap-northeast-2'

  try {
    // 기존 프로젝트 확인
    info('기존 프로젝트 확인 중...')
    const projects = await getProjects(accessToken)

    // 같은 이름의 프로젝트 찾기
    let project = projects.find(p => p.name === projectName)

    if (project) {
      log(`기존 프로젝트 발견: ${project.name}`)

      // 상태 확인
      if (project.status !== 'ACTIVE_HEALTHY') {
        info('프로젝트가 준비될 때까지 대기 중...')
        project = await waitForProjectReady(accessToken, project.id)
      }
    } else {
      // 새 프로젝트 생성
      warn(`프로젝트 '${projectName}'이 없습니다. 새로 생성합니다.`)

      // 조직 ID 확인
      let orgId = process.env.SUPABASE_ORG_ID
      if (!orgId) {
        const orgs = await getOrganizations(accessToken)
        if (orgs.length === 0) {
          error('Supabase 조직이 없습니다. supabase.com에서 먼저 조직을 만드세요.')
          process.exit(1)
        }
        orgId = orgs[0].id
        info(`조직 선택: ${orgs[0].name}`)
      }

      info(`새 프로젝트 생성 중: ${projectName} (${region})`)
      project = await createProject(accessToken, orgId, projectName, dbPassword, region)
      console.log('')

      // 생성 완료 대기
      project = await waitForProjectReady(accessToken, project.id)
      console.log('')
      log('프로젝트 생성 완료!')
    }

    // API 키 가져오기
    info('API 키 가져오는 중...')
    const apiKeys = await getApiKeys(accessToken, project.id)
    const anonKey = apiKeys.find(k => k.name === 'anon')

    if (!anonKey) {
      error('anon 키를 찾을 수 없습니다.')
      process.exit(1)
    }

    // DATABASE_URL 생성
    const projectRef = project.id
    const poolerHost = `aws-0-${region}.pooler.supabase.com`
    const encodedPassword = encodeURIComponent(dbPassword)

    const databaseUrl = `postgresql://postgres.${projectRef}:${encodedPassword}@${poolerHost}:6543/postgres?pgbouncer=true`
    const directUrl = `postgresql://postgres.${projectRef}:${encodedPassword}@${poolerHost}:5432/postgres`
    const supabaseUrl = `https://${projectRef}.supabase.co`

    // 환경변수 설정 (현재 프로세스)
    process.env.DATABASE_URL = databaseUrl
    process.env.DIRECT_URL = directUrl
    process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey.api_key

    log('데이터베이스 설정 완료')
    console.log('')
    console.log(`  ${c.dim}프로젝트:${c.reset} ${project.name}`)
    console.log(`  ${c.dim}URL:${c.reset} ${supabaseUrl}`)
    console.log(`  ${c.dim}Region:${c.reset} ${region}`)
    console.log('')

    // 빌드 실행
    await runBuild()

  } catch (err) {
    console.log('')
    error(err.message)
    console.log('')
    process.exit(1)
  }
}

async function runBuild() {
  console.log(`${c.cyan}━━━ Prisma & Next.js Build ━━━${c.reset}`)
  console.log('')

  try {
    // Prisma generate
    info('Prisma 클라이언트 생성 중...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    log('Prisma 클라이언트 생성 완료')

    // Prisma db push (테이블 생성)
    info('데이터베이스 스키마 적용 중...')
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' })
    log('데이터베이스 스키마 적용 완료')

    // Next.js build
    console.log('')
    info('Next.js 빌드 중...')
    execSync('next build', { stdio: 'inherit' })
    log('빌드 완료!')

  } catch (err) {
    error('빌드 실패')
    process.exit(1)
  }
}

main()
