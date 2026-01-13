import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 생성 시작...')

  // 기존 데이터 삭제 (순서 중요)
  await prisma.analytics.deleteMany()
  await prisma.aIUsage.deleteMany()
  await prisma.content.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.setting.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ 기존 데이터 삭제 완료')

  // 1. 사용자 생성
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: '관리자',
      role: 'admin',
      plan: 'enterprise',
      status: 'active',
      emailVerified: new Date(),
    },
  })

  const proUser = await prisma.user.create({
    data: {
      email: 'pro@example.com',
      name: '프로 사용자',
      role: 'user',
      plan: 'pro',
      status: 'active',
      emailVerified: new Date(),
    },
  })

  const freeUser = await prisma.user.create({
    data: {
      email: 'free@example.com',
      name: '무료 사용자',
      role: 'user',
      plan: 'free',
      status: 'active',
      emailVerified: new Date(),
    },
  })

  const inactiveUser = await prisma.user.create({
    data: {
      email: 'inactive@example.com',
      name: '비활성 사용자',
      role: 'user',
      plan: 'free',
      status: 'inactive',
    },
  })

  // 추가 샘플 사용자들
  const sampleUsers = await Promise.all([
    prisma.user.create({
      data: { email: 'kim@example.com', name: '김철수', role: 'user', plan: 'pro', status: 'active', emailVerified: new Date() },
    }),
    prisma.user.create({
      data: { email: 'lee@example.com', name: '이영희', role: 'user', plan: 'free', status: 'active', emailVerified: new Date() },
    }),
    prisma.user.create({
      data: { email: 'park@example.com', name: '박지민', role: 'user', plan: 'pro', status: 'active', emailVerified: new Date() },
    }),
    prisma.user.create({
      data: { email: 'choi@example.com', name: '최수진', role: 'user', plan: 'enterprise', status: 'active', emailVerified: new Date() },
    }),
    prisma.user.create({
      data: { email: 'jung@example.com', name: '정민호', role: 'user', plan: 'free', status: 'active' },
    }),
    prisma.user.create({
      data: { email: 'kang@example.com', name: '강서연', role: 'user', plan: 'pro', status: 'suspended' },
    }),
  ])

  console.log('✅ 사용자 10명 생성 완료')

  // 2. 구독 생성
  const now = new Date()
  const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  await prisma.subscription.createMany({
    data: [
      { userId: adminUser.id, plan: 'enterprise', planName: 'Enterprise 연간', amount: 960000, status: 'active', currentPeriodStart: now, currentPeriodEnd: oneMonthLater },
      { userId: proUser.id, plan: 'pro', planName: 'Pro 월간', amount: 30000, status: 'active', currentPeriodStart: now, currentPeriodEnd: oneMonthLater },
      { userId: freeUser.id, plan: 'free', planName: 'Free', amount: 0, status: 'active', currentPeriodStart: now, currentPeriodEnd: oneMonthLater },
      { userId: sampleUsers[0].id, plan: 'pro', planName: 'Pro 월간', amount: 30000, status: 'active', currentPeriodStart: now, currentPeriodEnd: oneMonthLater },
      { userId: sampleUsers[2].id, plan: 'pro', planName: 'Pro 월간', amount: 30000, status: 'active', currentPeriodStart: now, currentPeriodEnd: oneMonthLater },
      { userId: sampleUsers[3].id, plan: 'enterprise', planName: 'Enterprise 연간', amount: 960000, status: 'active', currentPeriodStart: now, currentPeriodEnd: oneMonthLater },
    ],
  })

  console.log('✅ 구독 데이터 생성 완료')

  // 3. 결제 데이터 생성 (최근 30일)
  const paymentData = []
  const paymentMethods = ['card', 'kakao', 'naver', 'bank']
  const paymentStatuses = ['completed', 'completed', 'completed', 'completed', 'pending', 'failed']
  const amounts = [29000, 29000, 99000, 29000, 29000, 99000, 290000]

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const userIndex = Math.floor(Math.random() * sampleUsers.length)
    const user = [adminUser, proUser, ...sampleUsers][userIndex] || proUser

    paymentData.push({
      userId: user.id,
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      currency: 'KRW',
      status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      provider: 'toss',
      transactionId: `TXN_${Date.now()}_${i}`,
      description: '월간 구독 결제',
      createdAt: date,
      updatedAt: date,
    })
  }

  await prisma.payment.createMany({ data: paymentData })
  console.log('✅ 결제 데이터 50건 생성 완료')

  // 4. AI 사용량 데이터 생성
  const aiUsageData = []
  const aiTypes = ['writer', 'image', 'code', 'translate']
  const aiModels = ['gpt-4', 'claude-3', 'dall-e-3', 'gpt-3.5-turbo']

  for (let i = 0; i < 200; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const userIndex = Math.floor(Math.random() * 8)
    const user = [adminUser, proUser, freeUser, ...sampleUsers][userIndex] || proUser
    const type = aiTypes[Math.floor(Math.random() * aiTypes.length)]

    aiUsageData.push({
      userId: user.id,
      type,
      tokens: Math.floor(Math.random() * 2000) + 100,
      cost: Math.random() * 0.1,
      model: aiModels[Math.floor(Math.random() * aiModels.length)],
      input: `샘플 입력 ${i}`,
      output: `샘플 출력 ${i}`,
      createdAt: date,
    })
  }

  await prisma.aIUsage.createMany({ data: aiUsageData })
  console.log('✅ AI 사용량 데이터 200건 생성 완료')

  // 5. 콘텐츠 데이터 생성
  const contentData = []
  const contentTitles = [
    'AI로 마케팅 문구 작성하기',
    '스타트업 성장 전략',
    '효과적인 이메일 마케팅',
    'SEO 최적화 가이드',
    '소셜 미디어 전략',
    '고객 유치 방법',
    '제품 출시 체크리스트',
    '브랜딩 전략 수립',
  ]

  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 60)
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const userIndex = Math.floor(Math.random() * 8)
    const user = [adminUser, proUser, freeUser, ...sampleUsers][userIndex] || proUser

    contentData.push({
      userId: user.id,
      title: contentTitles[Math.floor(Math.random() * contentTitles.length)] + ` #${i + 1}`,
      body: `이것은 샘플 콘텐츠 ${i + 1}입니다. AI를 활용하여 생성된 콘텐츠 예시입니다. 실제 사용 시에는 사용자가 직접 작성하거나 AI가 생성한 콘텐츠가 저장됩니다.`,
      type: Math.random() > 0.3 ? 'post' : 'draft',
      status: Math.random() > 0.4 ? 'published' : 'draft',
      createdAt: date,
      updatedAt: date,
    })
  }

  await prisma.content.createMany({ data: contentData })
  console.log('✅ 콘텐츠 데이터 30건 생성 완료')

  // 6. 분석/통계 데이터 생성 (최근 30일)
  const analyticsData = []
  const analyticsTypes = ['pageview', 'signup', 'payment', 'ai_usage']

  for (let day = 0; day < 30; day++) {
    const date = new Date(now.getTime() - day * 24 * 60 * 60 * 1000)
    date.setHours(0, 0, 0, 0)

    // 페이지뷰 (일별 100-500)
    analyticsData.push({
      date,
      type: 'pageview',
      value: Math.floor(Math.random() * 400) + 100,
      createdAt: date,
    })

    // 회원가입 (일별 0-10)
    analyticsData.push({
      date,
      type: 'signup',
      value: Math.floor(Math.random() * 10),
      createdAt: date,
    })

    // 결제 (일별 0-5)
    analyticsData.push({
      date,
      type: 'payment',
      value: Math.floor(Math.random() * 5),
      createdAt: date,
    })

    // AI 사용 (일별 10-50)
    analyticsData.push({
      date,
      type: 'ai_usage',
      value: Math.floor(Math.random() * 40) + 10,
      createdAt: date,
    })
  }

  await prisma.analytics.createMany({ data: analyticsData })
  console.log('✅ 분석 데이터 120건 생성 완료')

  // 7. 서비스 설정 데이터 생성
  await prisma.setting.createMany({
    data: [
      { key: 'site_name', value: 'OneSaaS', type: 'string', category: 'general' },
      { key: 'site_description', value: 'AI와 함께 만드는 나만의 SaaS', type: 'string', category: 'general' },
      { key: 'support_email', value: 'support@example.com', type: 'string', category: 'general' },
      { key: 'maintenance_mode', value: 'false', type: 'boolean', category: 'general' },
      { key: 'payment_enabled', value: 'true', type: 'boolean', category: 'payment' },
      { key: 'payment_provider', value: 'toss', type: 'string', category: 'payment' },
      { key: 'free_plan_limit', value: '100', type: 'number', category: 'ai' },
      { key: 'pro_plan_limit', value: '1000', type: 'number', category: 'ai' },
      { key: 'enterprise_plan_limit', value: '10000', type: 'number', category: 'ai' },
      { key: 'email_notifications', value: 'true', type: 'boolean', category: 'email' },
    ],
  })

  console.log('✅ 서비스 설정 데이터 생성 완료')

  console.log('')
  console.log('🎉 모든 시드 데이터 생성 완료!')
  console.log('')
  console.log('📊 생성된 데이터 요약:')
  console.log('   - 사용자: 10명')
  console.log('   - 구독: 6건')
  console.log('   - 결제: 50건')
  console.log('   - AI 사용량: 200건')
  console.log('   - 콘텐츠: 30건')
  console.log('   - 분석 데이터: 120건')
  console.log('   - 설정: 10건')
  console.log('')
  console.log('🔑 테스트 계정:')
  console.log('   - 관리자: admin@example.com')
  console.log('   - 프로: pro@example.com')
  console.log('   - 무료: free@example.com')
}

main()
  .catch((e) => {
    console.error('❌ 시드 실행 오류:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
