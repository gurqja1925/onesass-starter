/**
 * OnePage 템플릿 모듈
 * 100+ 비즈니스 유형별 원페이지 템플릿
 */

// 베이스 컴포넌트 export
export {
  Hero,
  Section,
  ServicesGrid,
  Gallery,
  Testimonials,
  Contact,
  SimpleFooter,
  type HeroProps,
  type BusinessInfo,
  type ServiceItem,
  type GalleryItem,
  type TestimonialItem,
  type FAQItem,
  type SectionProps,
} from './OnepageBase'

// 템플릿 데이터 export
export {
  ONEPAGE_TEMPLATES,
  ONEPAGE_CATEGORIES,
  type OnepageCategory,
  type OnepageTemplateMeta,
} from './templates'

// 템플릿 유틸리티 함수들
import { ONEPAGE_TEMPLATES, ONEPAGE_CATEGORIES, OnepageCategory, OnepageTemplateMeta } from './templates'

/**
 * 카테고리별 템플릿 가져오기
 */
export function getTemplatesByCategory(category: OnepageCategory): OnepageTemplateMeta[] {
  return ONEPAGE_TEMPLATES.filter(t => t.category === category)
}

/**
 * 템플릿 ID로 템플릿 가져오기
 */
export function getTemplateById(id: string): OnepageTemplateMeta | undefined {
  return ONEPAGE_TEMPLATES.find(t => t.id === id)
}

/**
 * 키워드로 템플릿 검색
 */
export function searchTemplates(query: string): OnepageTemplateMeta[] {
  const lowerQuery = query.toLowerCase()
  return ONEPAGE_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.nameEn.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.keywords.some(k => k.toLowerCase().includes(lowerQuery))
  )
}

/**
 * 모든 카테고리 목록 가져오기
 */
export function getAllCategories(): { id: OnepageCategory; name: string; icon: string; count: number }[] {
  return (Object.entries(ONEPAGE_CATEGORIES) as [OnepageCategory, { name: string; icon: string }][]).map(([id, info]) => ({
    id,
    name: info.name,
    icon: info.icon,
    count: ONEPAGE_TEMPLATES.filter(t => t.category === id).length,
  }))
}

/**
 * 총 템플릿 수 가져오기
 */
export function getTotalTemplateCount(): number {
  return ONEPAGE_TEMPLATES.length
}
