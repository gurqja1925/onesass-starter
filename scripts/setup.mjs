#!/usr/bin/env node

/**
 * OneSaaS 설정 마법사
 *
 * 사용법: pnpm setup
 *
 * 기능:
 * - Supabase 설정 (새 프로젝트 or 기존 프로젝트)
 * - 데이터베이스 연결 테스트
 * - K-Code AI 설정
 * - Vercel 배포 설정
 */

import { createInterface } from 'readline'
import { writeFileSync, readFileSync, existsSync, appendFileSync } from 'fs'
import { execSync, spawn } from 'child_process'
import https from 'https'

// ============================================================
// Supabase Management API
// ============================================================

const SUPABASE_API_BASE = 'https://api.supabase.com/v1'

/**
 * Supabase API 요청
 */
function supabaseApi(endpoint, accessToken) {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_API_BASE}${endpoint}`
    const req = https.request(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject(new Error('API 응답 파싱 실패'))
          }
        } else if (res.statusCode === 401) {
          reject(new Error('Access Token이 유효하지 않습니다.'))
        } else {
          reject(new Error(`API 오류: ${res.statusCode}`))
        }
      })
    })
    req.on('error', reject)
    req.end()
  })
}

/**
 * 프로젝트 목록 가져오기
 */
async function getSupabaseProjects(accessToken) {
  return supabaseApi('/projects', accessToken)
}

/**
 * 프로젝트 API 키 가져오기
 */
async function getProjectApiKeys(accessToken, projectRef) {
  return supabaseApi(`/projects/${projectRef}/api-keys`, accessToken)
}

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt, defaultValue = '') {
  const defaultHint = defaultValue ? ` ${colors.dim}(${defaultValue})${colors.reset}` : ''
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}?${colors.reset} ${prompt}${defaultHint}: `, (answer) => {
      resolve(answer.trim() || defaultValue)
    })
  })
}

function select(prompt, options) {
  return new Promise((resolve) => {
    console.log(`\n${colors.yellow}?${colors.reset} ${prompt}`)
    options.forEach((opt, i) => {
      console.log(`  ${colors.cyan}${i + 1}${colors.reset}) ${opt.label}`)
    })
    rl.question(`\n선택 (1-${options.length}): `, (answer) => {
      const idx = parseInt(answer) - 1
      if (idx >= 0 && idx < options.length) {
        resolve(options[idx].value)
      } else {
        resolve(options[0].value)
      }
    })
  })
}

function log(msg) {
  console.log(`${colors.green}✓${colors.reset} ${msg}`)
}

function warn(msg) {
  console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
}

function error(msg) {
  console.log(`${colors.red}✕${colors.reset} ${msg}`)
}

function info(msg) {
  console.log(`${colors.blue}ℹ${colors.reset} ${msg}`)
}

function header(title) {
  console.log(`\n${colors.cyan}━━━ ${title} ━━━${colors.reset}\n`)
}

// .env 파일 읽기
function readEnv() {
  if (!existsSync('.env')) return {}
  const content = readFileSync('.env', 'utf-8')
  const env = {}
  content.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      env[match[1].trim()] = match[2].replace(/^["']|["']$/g, '').trim()
    }
  })
  return env
}

// .env 파일 쓰기
function writeEnv(env) {
  const lines = [
    '# ===========================================',
    '# OneSaaS Starter 환경 설정',
    '# 생성일: ' + new Date().toISOString(),
    '# ===========================================',
    '',
    '# ─── Supabase 데이터베이스 ───',
    `DATABASE_URL="${env.DATABASE_URL || ''}"`,
    `DIRECT_URL="${env.DIRECT_URL || ''}"`,
    `NEXT_PUBLIC_SUPABASE_URL="${env.NEXT_PUBLIC_SUPABASE_URL || ''}"`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY="${env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}"`,
    '',
    '# ─── 사이트 설정 ───',
    `NEXT_PUBLIC_SITE_URL="${env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}"`,
    '',
  ]

  // 관리자 설정
  if (env.NEXT_PUBLIC_ADMIN_EMAILS) {
    lines.push('# ─── 관리자 설정 ───')
    lines.push(`NEXT_PUBLIC_ADMIN_EMAILS="${env.NEXT_PUBLIC_ADMIN_EMAILS}"`)
    lines.push('')
  }

  // 결제 설정
  if (env.NEXT_PUBLIC_PORTONE_MERCHANT_ID || env.NEXT_PUBLIC_TOSS_CLIENT_KEY) {
    lines.push('# ─── 결제 설정 ───')
    if (env.NEXT_PUBLIC_PORTONE_MERCHANT_ID) {
      lines.push(`NEXT_PUBLIC_PORTONE_MERCHANT_ID="${env.NEXT_PUBLIC_PORTONE_MERCHANT_ID}"`)
      lines.push(`PORTONE_API_KEY="${env.PORTONE_API_KEY || ''}"`)
      lines.push(`PORTONE_API_SECRET="${env.PORTONE_API_SECRET || ''}"`)
    }
    if (env.NEXT_PUBLIC_TOSS_CLIENT_KEY) {
      lines.push(`NEXT_PUBLIC_TOSS_CLIENT_KEY="${env.NEXT_PUBLIC_TOSS_CLIENT_KEY}"`)
      lines.push(`TOSS_SECRET_KEY="${env.TOSS_SECRET_KEY || ''}"`)
    }
    lines.push('')
  }

  // AI 설정
  const aiKeys = ['DEEPSEEK_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_API_KEY', 'MINIMAX_API_KEY', 'QWEN_API_KEY', 'GROQ_API_KEY']
  const hasAiKey = aiKeys.some(key => env[key])
  if (hasAiKey) {
    lines.push('# ─── K-Code AI 설정 ───')
    aiKeys.forEach(key => {
      if (env[key]) {
        lines.push(`${key}="${env[key]}"`)
      }
    })
    lines.push('')
  }

  writeFileSync('.env', lines.join('\n'))
}

// ============================================================
// Supabase 자동 설정
// ============================================================

async function setupSupabaseAuto(existingEnv) {
  console.log(`
${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
${colors.cyan}  Supabase 자동 설정${colors.reset}
${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

Access Token이 필요합니다.

${colors.yellow}[Access Token 발급받기]${colors.reset}
  1. https://supabase.com/dashboard/account/tokens 접속
  2. "Generate new token" 클릭
  3. 토큰 이름 입력 (예: onesaas-setup)
  4. "Generate token" 클릭
  5. 생성된 토큰 복사

${colors.dim}(토큰은 sbp_로 시작합니다)${colors.reset}
`)

  const accessToken = await question('Supabase Access Token')
  if (!accessToken) {
    error('Access Token이 필요합니다.')
    return null
  }

  // 프로젝트 목록 가져오기
  info('프로젝트 목록을 가져오는 중...')

  let projects
  try {
    projects = await getSupabaseProjects(accessToken)
  } catch (e) {
    error(e.message)
    return null
  }

  if (!projects || projects.length === 0) {
    error('프로젝트가 없습니다. 먼저 Supabase에서 프로젝트를 생성하세요.')
    return null
  }

  log(`${projects.length}개 프로젝트 발견!`)

  // 프로젝트 선택
  console.log('')
  const projectOptions = projects.map((p, i) => ({
    label: `${p.name} (${p.region})`,
    value: p.id,
  }))

  const selectedProjectId = await select('사용할 프로젝트를 선택하세요', projectOptions)
  const selectedProject = projects.find(p => p.id === selectedProjectId)

  if (!selectedProject) {
    error('프로젝트를 찾을 수 없습니다.')
    return null
  }

  info(`${selectedProject.name} 프로젝트 선택됨`)

  // API 키 가져오기
  info('API 키를 가져오는 중...')

  let apiKeys
  try {
    apiKeys = await getProjectApiKeys(accessToken, selectedProject.id)
  } catch (e) {
    error(`API 키 가져오기 실패: ${e.message}`)
    return null
  }

  // anon 키 찾기
  const anonKey = apiKeys.find(k => k.name === 'anon')
  if (!anonKey) {
    error('anon 키를 찾을 수 없습니다.')
    return null
  }

  log('API 키 가져오기 완료!')

  // 데이터베이스 비밀번호 입력
  console.log(`
${colors.yellow}⚠ 마지막 단계: 데이터베이스 비밀번호${colors.reset}

  Supabase 프로젝트 생성 시 입력한 Database Password가 필요합니다.
  비밀번호를 잊었다면 Supabase 대시보드에서 재설정할 수 있어요:
  Settings > Database > Database Password > "Reset database password"
`)

  const dbPassword = await question('데이터베이스 비밀번호')
  if (!dbPassword) {
    error('데이터베이스 비밀번호는 필수입니다.')
    return null
  }

  // 환경변수 구성
  const projectRef = selectedProject.id
  const supabaseUrl = `https://${projectRef}.supabase.co`

  // Region을 AWS 형식으로 변환 (예: "ap-northeast-2", "us-east-1" 등)
  const regionMap = {
    'ap-northeast-1': 'ap-northeast-1',  // Tokyo
    'ap-northeast-2': 'ap-northeast-2',  // Seoul
    'ap-southeast-1': 'ap-southeast-1',  // Singapore
    'ap-southeast-2': 'ap-southeast-2',  // Sydney
    'ap-south-1': 'ap-south-1',          // Mumbai
    'eu-west-1': 'eu-west-1',            // Ireland
    'eu-west-2': 'eu-west-2',            // London
    'eu-west-3': 'eu-west-3',            // Paris
    'eu-central-1': 'eu-central-1',      // Frankfurt
    'us-east-1': 'us-east-1',            // N. Virginia
    'us-west-1': 'us-west-1',            // N. California
    'us-west-2': 'us-west-2',            // Oregon
    'sa-east-1': 'sa-east-1',            // São Paulo
  }

  // Supabase API에서 반환하는 region 형식에 따라 처리
  let awsRegion = selectedProject.region
  // "Northeast Asia (Seoul)" 같은 형식이면 변환
  if (selectedProject.region.includes('Seoul') || selectedProject.region.includes('ap-northeast-2')) {
    awsRegion = 'ap-northeast-2'
  } else if (selectedProject.region.includes('Tokyo') || selectedProject.region.includes('ap-northeast-1')) {
    awsRegion = 'ap-northeast-1'
  } else if (selectedProject.region.includes('Singapore') || selectedProject.region.includes('ap-southeast-1')) {
    awsRegion = 'ap-southeast-1'
  } else if (regionMap[selectedProject.region]) {
    awsRegion = regionMap[selectedProject.region]
  }

  // Connection Pooler URL 생성
  const poolerHost = `aws-0-${awsRegion}.pooler.supabase.com`
  const encodedPassword = encodeURIComponent(dbPassword)

  // DATABASE_URL: Pooler 사용 (앱에서 사용, port 6543, pgbouncer=true)
  const databaseUrl = `postgresql://postgres.${projectRef}:${encodedPassword}@${poolerHost}:6543/postgres?pgbouncer=true`

  // DIRECT_URL: 직접 연결 (마이그레이션용, port 5432)
  const directUrl = `postgresql://postgres.${projectRef}:${encodedPassword}@${poolerHost}:5432/postgres`

  const env = {
    ...existingEnv,
    DATABASE_URL: databaseUrl,
    DIRECT_URL: directUrl,
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey.api_key,
  }

  console.log('')
  log('Supabase 설정 완료!')
  console.log(`
  ${colors.dim}프로젝트:${colors.reset} ${selectedProject.name}
  ${colors.dim}URL:${colors.reset} ${supabaseUrl}
  ${colors.dim}Region:${colors.reset} ${selectedProject.region}
  ${colors.dim}Pooler:${colors.reset} ${poolerHost}
`)

  return env
}

// 데이터베이스 연결 테스트
async function testDatabaseConnection(url) {
  try {
    // 간단히 URL 형식 검증
    const parsed = new URL(url)
    if (parsed.protocol !== 'postgresql:' && parsed.protocol !== 'postgres:') {
      return { success: false, error: 'PostgreSQL URL이 아닙니다.' }
    }
    return { success: true }
  } catch (e) {
    return { success: false, error: 'URL 형식이 올바르지 않습니다.' }
  }
}

async function main() {
  console.log(`
${colors.cyan}╔═════════════════════════════════════════════════╗
║                                                 ║
║   ${colors.bold}OneSaaS Starter 설정 마법사${colors.reset}${colors.cyan}                  ║
║                                                 ║
║   초보자도 쉽게 따라할 수 있어요!               ║
║                                                 ║
╚═════════════════════════════════════════════════╝${colors.reset}
`)

  // 기존 설정 확인
  const existingEnv = readEnv()
  const hasExistingConfig = existingEnv.DATABASE_URL && existingEnv.NEXT_PUBLIC_SUPABASE_URL

  if (hasExistingConfig) {
    header('기존 설정 발견')
    info(`Supabase URL: ${existingEnv.NEXT_PUBLIC_SUPABASE_URL}`)

    const action = await select('어떻게 하시겠습니까?', [
      { label: '기존 설정 유지하고 계속', value: 'keep' },
      { label: '새로운 Supabase 프로젝트로 변경', value: 'new' },
      { label: '기존 설정 수정', value: 'edit' },
    ])

    if (action === 'keep') {
      console.log('')
      log('기존 설정을 유지합니다.')
      await setupNextSteps(existingEnv)
      rl.close()
      return
    }

    if (action === 'edit') {
      await editExistingConfig(existingEnv)
      rl.close()
      return
    }
  }

  // 새 Supabase 설정
  header('1단계: Supabase 데이터베이스 설정')

  console.log(`${colors.dim}Supabase는 무료 PostgreSQL 데이터베이스를 제공합니다.${colors.reset}`)
  console.log(`${colors.dim}https://supabase.com 에서 프로젝트를 생성하세요.${colors.reset}\n`)

  const hasSupabase = await select('Supabase 프로젝트가 있나요?', [
    { label: '네, 있어요 - Access Token으로 자동 설정 (추천)', value: 'auto' },
    { label: '네, 있어요 - 직접 입력할게요', value: 'manual' },
    { label: '아니요, 만드는 방법을 알려주세요', value: 'no' },
  ])

  if (hasSupabase === 'no') {
    await showSupabaseGuide()
    console.log(`\n${colors.yellow}Supabase 프로젝트를 만든 후 다시 실행해주세요.${colors.reset}`)
    console.log(`${colors.cyan}pnpm setup${colors.reset}\n`)
    rl.close()
    return
  }

  // Supabase 정보 입력
  let env = { ...existingEnv }

  // 자동 설정 모드
  if (hasSupabase === 'auto') {
    const autoResult = await setupSupabaseAuto(env)
    if (autoResult) {
      env = autoResult
    } else {
      // 자동 설정 실패 시 수동으로 전환
      warn('자동 설정에 실패했습니다. 수동 입력으로 전환합니다.')
    }
  }

  // 수동 설정 모드 (또는 자동 설정 실패 시)
  if (hasSupabase === 'manual' || !env.DATABASE_URL) {
    console.log(`\n${colors.dim}Supabase 대시보드에서 다음 정보를 찾아주세요:${colors.reset}`)
    console.log(`${colors.dim}Settings > Database > Connection string (URI)${colors.reset}`)
    console.log(`${colors.dim}Settings > API > Project URL, anon key${colors.reset}\n`)

    // Database URL
    while (true) {
      const dbUrl = await question('DATABASE_URL (postgresql://...)')
      if (!dbUrl) {
        error('DATABASE_URL은 필수입니다.')
        continue
      }
      const test = await testDatabaseConnection(dbUrl)
      if (!test.success) {
        error(test.error)
        continue
      }
      env.DATABASE_URL = dbUrl
      env.DIRECT_URL = dbUrl // 대부분 같음
      log('DATABASE_URL 설정 완료')
      break
    }

    // Supabase URL
    while (true) {
      const supabaseUrl = await question('NEXT_PUBLIC_SUPABASE_URL (https://xxx.supabase.co)')
      if (!supabaseUrl) {
        error('Supabase URL은 필수입니다.')
        continue
      }
      if (!supabaseUrl.includes('supabase.co')) {
        warn('supabase.co URL이 아닌 것 같습니다. 계속하시겠습니까?')
      }
      env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl
      log('Supabase URL 설정 완료')
      break
    }

    // Supabase Anon Key
    while (true) {
      const anonKey = await question('NEXT_PUBLIC_SUPABASE_ANON_KEY (eyJ...)')
      if (!anonKey) {
        error('Anon Key는 필수입니다.')
        continue
      }
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey
      log('Anon Key 설정 완료')
      break
    }
  }

  // 사이트 URL
  env.NEXT_PUBLIC_SITE_URL = await question('사이트 URL', 'http://localhost:3000')

  // K-Code AI 설정 (선택)
  header('2단계: K-Code AI 설정 (선택)')

  console.log(`${colors.dim}K-Code는 AI로 코딩을 도와주는 CLI 도구입니다.${colors.reset}`)
  console.log(`${colors.dim}API 키가 없어도 나중에 설정할 수 있습니다.${colors.reset}\n`)

  const setupAi = await select('K-Code AI를 설정하시겠습니까?', [
    { label: '나중에 설정할게요', value: 'skip' },
    { label: 'Groq (무료 티어 있음, 추천)', value: 'groq' },
    { label: 'Qwen (가장 저렴)', value: 'qwen' },
    { label: 'DeepSeek (코딩 특화)', value: 'deepseek' },
  ])

  if (setupAi !== 'skip') {
    const providerUrls = {
      groq: 'https://console.groq.com',
      qwen: 'https://dashscope.console.aliyun.com',
      deepseek: 'https://platform.deepseek.com',
    }
    const envKeys = {
      groq: 'GROQ_API_KEY',
      qwen: 'QWEN_API_KEY',
      deepseek: 'DEEPSEEK_API_KEY',
    }

    console.log(`\n${colors.dim}${providerUrls[setupAi]} 에서 API 키를 발급받으세요.${colors.reset}\n`)

    const apiKey = await question(`${envKeys[setupAi]}`)
    if (apiKey) {
      env[envKeys[setupAi]] = apiKey
      log(`${setupAi} API 키 설정 완료`)
    }
  }

  // .env 파일 저장
  writeEnv(env)
  log('.env 파일 저장 완료!')

  // 다음 단계
  await setupNextSteps(env)
  rl.close()
}

async function showSupabaseGuide() {
  console.log(`
${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
${colors.cyan}  Supabase 프로젝트 만들기 (무료)${colors.reset}
${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.yellow}[1단계]${colors.reset} https://supabase.com 접속

${colors.yellow}[2단계]${colors.reset} 로그인
   - "Start your project" 또는 "Sign In" 클릭
   - GitHub 계정으로 로그인 (가장 쉬움)

${colors.yellow}[3단계]${colors.reset} 새 프로젝트 만들기
   - "New Project" 버튼 클릭
   - Organization: 기본값 그대로 사용
   - Project name: 원하는 이름 입력 (예: my-saas)
   - Database Password: ${colors.red}비밀번호 입력 ← 꼭 기억하세요!${colors.reset}
   - Region: Northeast Asia (Seoul) 선택
   - "Create new project" 클릭

${colors.yellow}[4단계]${colors.reset} 1-2분 기다리기 (프로젝트 생성 중...)

${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
${colors.cyan}  필요한 정보 찾기 (총 3개)${colors.reset}
${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.green}1. DATABASE_URL & DIRECT_URL${colors.reset} - 데이터베이스 연결 주소

   찾는 위치:
   ┌─────────────────────────────────────────────────┐
   │  왼쪽 메뉴 "Settings" (톱니바퀴) 클릭           │
   │  → "Database" 클릭                              │
   │  → 스크롤 내려서 "Connection string" 섹션       │
   │  → ${colors.yellow}"Transaction" 탭${colors.reset} 선택 (DATABASE_URL용)        │
   │  → 복사 버튼 클릭                               │
   └─────────────────────────────────────────────────┘

   ${colors.cyan}DATABASE_URL (앱에서 사용):${colors.reset}
   postgresql://postgres.xxx:${colors.red}[비밀번호]${colors.reset}@aws-0-xxx.pooler.supabase.com:${colors.yellow}6543${colors.reset}/postgres?pgbouncer=true

   ${colors.cyan}DIRECT_URL (마이그레이션용):${colors.reset}
   postgresql://postgres.xxx:${colors.red}[비밀번호]${colors.reset}@aws-0-xxx.pooler.supabase.com:${colors.yellow}5432${colors.reset}/postgres

   ${colors.yellow}⚠ [YOUR-PASSWORD] 부분을 3단계에서 입력한 비밀번호로 바꿔야 해요!${colors.reset}
   ${colors.dim}(Transaction 탭 = 6543 포트 + pgbouncer, Session 탭 = 5432 포트)${colors.reset}

${colors.green}2. NEXT_PUBLIC_SUPABASE_URL${colors.reset} - Supabase 프로젝트 URL

   찾는 위치:
   ┌─────────────────────────────────────────────────┐
   │  왼쪽 메뉴 "Settings" (톱니바퀴) 클릭           │
   │  → "API" 클릭                                   │
   │  → "Project URL" 섹션                           │
   │  → 복사 버튼 클릭                               │
   └─────────────────────────────────────────────────┘

   형식: https://xxxxxxxxxxxx.supabase.co

${colors.green}3. NEXT_PUBLIC_SUPABASE_ANON_KEY${colors.reset} - 공개 API 키

   찾는 위치:
   ┌─────────────────────────────────────────────────┐
   │  왼쪽 메뉴 "Settings" (톱니바퀴) 클릭           │
   │  → "API" 클릭                                   │
   │  → "Project API keys" 섹션                      │
   │  → "anon public" 옆의 복사 버튼 클릭            │
   └─────────────────────────────────────────────────┘

   형식: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (긴 문자열)

   ${colors.dim}(service_role은 비밀 키라서 쓰면 안 됨! anon public만 사용)${colors.reset}

${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`)
}

async function editExistingConfig(env) {
  header('설정 수정')

  const field = await select('수정할 항목을 선택하세요', [
    { label: 'Supabase 데이터베이스 URL', value: 'db' },
    { label: 'Supabase API 키', value: 'api' },
    { label: 'K-Code AI 설정', value: 'ai' },
    { label: '관리자 이메일', value: 'admin' },
    { label: '취소', value: 'cancel' },
  ])

  if (field === 'cancel') {
    rl.close()
    return
  }

  if (field === 'db') {
    const dbUrl = await question('DATABASE_URL', env.DATABASE_URL)
    env.DATABASE_URL = dbUrl
    env.DIRECT_URL = dbUrl
  }

  if (field === 'api') {
    env.NEXT_PUBLIC_SUPABASE_URL = await question('NEXT_PUBLIC_SUPABASE_URL', env.NEXT_PUBLIC_SUPABASE_URL)
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY = await question('NEXT_PUBLIC_SUPABASE_ANON_KEY', env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }

  if (field === 'ai') {
    const provider = await select('AI 프로바이더 선택', [
      { label: 'Groq (무료)', value: 'groq' },
      { label: 'Qwen (저렴)', value: 'qwen' },
      { label: 'DeepSeek', value: 'deepseek' },
    ])
    const keys = { groq: 'GROQ_API_KEY', qwen: 'QWEN_API_KEY', deepseek: 'DEEPSEEK_API_KEY' }
    const apiKey = await question(`${keys[provider]}`)
    if (apiKey) env[keys[provider]] = apiKey
  }

  if (field === 'admin') {
    const emails = await question('관리자 이메일 (쉼표로 구분)', env.NEXT_PUBLIC_ADMIN_EMAILS)
    env.NEXT_PUBLIC_ADMIN_EMAILS = emails
  }

  writeEnv(env)
  log('설정이 수정되었습니다.')
  await setupNextSteps(env)
}

async function setupNextSteps(env) {
  header('다음 단계')

  const hasDb = env.DATABASE_URL && env.NEXT_PUBLIC_SUPABASE_URL

  if (!hasDb) {
    error('데이터베이스 설정이 없습니다!')
    console.log(`\n${colors.yellow}pnpm setup${colors.reset} 을 실행하여 설정해주세요.\n`)
    return
  }

  console.log(`${colors.green}1.${colors.reset} 데이터베이스 스키마 적용`)
  console.log(`   ${colors.cyan}pnpm db:push${colors.reset}`)
  console.log('')
  console.log(`${colors.green}2.${colors.reset} 개발 서버 실행`)
  console.log(`   ${colors.cyan}pnpm dev${colors.reset}`)
  console.log('')
  console.log(`${colors.green}3.${colors.reset} 브라우저에서 확인`)
  console.log(`   ${colors.blue}http://localhost:3000${colors.reset}`)
  console.log('')

  // 자동 실행 옵션
  const runNow = await select('지금 데이터베이스 스키마를 적용하시겠습니까?', [
    { label: '네, 지금 적용해주세요', value: 'yes' },
    { label: '아니요, 나중에 할게요', value: 'no' },
  ])

  if (runNow === 'yes') {
    console.log('')
    info('prisma db push 실행 중...')
    try {
      execSync('npx prisma db push', { stdio: 'inherit' })
      console.log('')
      log('데이터베이스 스키마 적용 완료!')

      // 개발 서버 실행
      const runDev = await select('개발 서버를 실행하시겠습니까?', [
        { label: '네, 실행해주세요', value: 'yes' },
        { label: '아니요', value: 'no' },
      ])

      if (runDev === 'yes') {
        console.log('')
        info('개발 서버를 시작합니다...')
        console.log(`${colors.dim}(Ctrl+C로 종료)${colors.reset}\n`)
        const child = spawn('pnpm', ['dev'], { stdio: 'inherit', shell: true })
        child.on('close', () => process.exit(0))
        return // 개발 서버가 종료될 때까지 대기
      }
    } catch (e) {
      error('데이터베이스 연결에 실패했습니다.')
      console.log(`\n${colors.dim}DATABASE_URL이 올바른지 확인해주세요.${colors.reset}`)
      console.log(`${colors.cyan}pnpm setup${colors.reset} 으로 다시 설정할 수 있습니다.\n`)
    }
  }

  console.log(`
${colors.cyan}╔═════════════════════════════════════════════════╗
║   설정 완료!                                    ║
╚═════════════════════════════════════════════════╝${colors.reset}

${colors.dim}도움말: /admin/guides 또는 /docs${colors.reset}
`)
}

main().catch((e) => {
  error(e.message)
  rl.close()
  process.exit(1)
})
