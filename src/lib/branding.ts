/**
 * 브랜딩 설정 유틸리티 (클라이언트/서버 공용)
 *
 * 환경 변수에서 브랜딩 정보를 읽어옵니다.
 * 배포 시 Vercel 환경 변수로 설정하면 자동 적용됩니다.
 */

export interface BrandingConfig {
  appName: string
  appDescription: string
  companyName: string
  appIcon: string
}

// 기본값 (환경 변수 미설정 시)
const defaultBranding: BrandingConfig = {
  appName: 'OneSaaS',
  appDescription: '클릭 몇 번으로 완성하는 SaaS',
  companyName: 'OneSaaS',
  appIcon: '🚀',
}

/**
 * 브랜딩 설정 가져오기
 * 환경 변수가 있으면 환경 변수 사용, 없으면 기본값
 */
export function getBranding(): BrandingConfig {
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME || defaultBranding.appName,
    appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || defaultBranding.appDescription,
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || defaultBranding.companyName,
    appIcon: process.env.NEXT_PUBLIC_APP_ICON || defaultBranding.appIcon,
  }
}

// 개별 값 가져오기 헬퍼
export const getAppName = () => getBranding().appName
export const getAppDescription = () => getBranding().appDescription
export const getCompanyName = () => getBranding().companyName
export const getAppIcon = () => getBranding().appIcon

// 앱 이름의 첫 글자 (로고용)
export const getAppInitial = () => {
  const name = getAppName()
  return name.charAt(0).toUpperCase()
}
