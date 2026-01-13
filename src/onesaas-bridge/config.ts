/**
 * OneSaaS 프로젝트 설정
 *
 * 서비스 이름, 기능 플래그, API 설정 등을 정의합니다.
 */

export const config = {
  // 서비스 기본 정보
  site: {
    name: 'OneSaaS',
    description: 'SaaS를 만드는 가장 쉬운 방법',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: '/logo.png',
    favicon: '/favicon.ico',
  },

  // 기능 플래그
  features: {
    auth: {
      enabled: process.env.NEXT_PUBLIC_AUTH_ENABLED !== 'false',
      providers: {
        email: (process.env.NEXT_PUBLIC_AUTH_PROVIDERS || 'email').includes('email'),
        google: (process.env.NEXT_PUBLIC_AUTH_PROVIDERS || 'email,google,kakao,github').includes('google'),
        kakao: (process.env.NEXT_PUBLIC_AUTH_PROVIDERS || 'email,google,kakao,github').includes('kakao'),
        github: (process.env.NEXT_PUBLIC_AUTH_PROVIDERS || 'email,google,kakao,github').includes('github'),
      },
      magicLink: false,
    },
    payment: {
      enabled: true,
      provider: 'portone', // 'portone' | 'tosspayments'
      currency: 'KRW',
    },
    admin: {
      enabled: true,
      analytics: true,
      userManagement: true,
    },
    ai: {
      enabled: true,
      providers: ['openai', 'anthropic', 'google'],
    },
    email: {
      enabled: true,
      provider: 'resend', // 'resend' | 'sendgrid' | 'mailgun'
    },
  },

  // 가격 플랜
  plans: [
    {
      id: 'free',
      name: '무료',
      price: 0,
      features: [
        '기본 기능 모두 포함',
        '월 100 사용자',
        '커뮤니티 지원',
      ],
    },
    {
      id: 'pro',
      name: '프로',
      price: 29000,
      features: [
        '무료 플랜의 모든 것',
        '무제한 사용자',
        '우선 이메일 지원',
        '고급 분석',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: '엔터프라이즈',
      price: null, // 문의
      features: [
        '프로 플랜의 모든 것',
        '전담 매니저',
        'SLA 보장',
        '커스텀 개발',
      ],
    },
  ],

  // 플랜별 사용량 한도
  planLimits: {
    free: {
      creates: 5,      // 월 5개 생성
      aiCalls: 10,     // 월 10회 AI 호출
      exports: 3,      // 월 3회 내보내기
      apiCalls: 100,   // 월 100회 API 호출
      storage: 100,    // 100MB 저장공간
    },
    pro: {
      creates: 100,    // 월 100개 생성
      aiCalls: 500,    // 월 500회 AI 호출
      exports: 50,     // 월 50회 내보내기
      apiCalls: 10000, // 월 10,000회 API 호출
      storage: 5000,   // 5GB 저장공간
    },
    enterprise: {
      creates: -1,     // 무제한 (-1)
      aiCalls: -1,     // 무제한
      exports: -1,     // 무제한
      apiCalls: -1,    // 무제한
      storage: -1,     // 무제한
    },
  } as Record<string, {
    creates: number
    aiCalls: number
    exports: number
    apiCalls: number
    storage: number
  }>,

  // 소셜 링크
  social: {
    twitter: '',
    github: '',
    discord: '',
  },

  // 연락처
  contact: {
    email: 'support@onesaas.kr',
    phone: '',
  },

  // SEO 기본값
  seo: {
    title: 'OneSaaS - SaaS를 만드는 가장 쉬운 방법',
    description: '결제, 인증, 관리자 대시보드까지 모두 포함. 코딩 없이 클릭 몇 번으로 완성하세요.',
    keywords: ['SaaS', '스타트업', '노코드', '창업', 'B2B'],
  },
}

// 환경별 설정
export const env = {
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
}
