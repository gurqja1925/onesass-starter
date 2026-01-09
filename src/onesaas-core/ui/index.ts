/**
 * OneSaaS UI 컴포넌트
 *
 * 공통으로 사용되는 UI 컴포넌트를 제공합니다.
 */

// 기존 컴포넌트 (레거시 호환)
// Button, Input → primitives에서 export
// Card → layout에서 export
// Badge → data-display에서 export
export * from './Modal'
// Loading에서 Skeleton은 feedback/Skeleton과 중복되므로 명시적 export
export { Loading, PageLoading } from './Loading'

// Primitives - 기본 UI 컴포넌트 (Button, Input 포함)
export * from './primitives'

// Layout - 레이아웃 컴포넌트
export * from './layout'

// Navigation - 네비게이션 컴포넌트
export * from './navigation'

// Feedback - 피드백 컴포넌트
export * from './feedback'

// Data Display - 데이터 표시 컴포넌트
export * from './data-display'

// Forms - 고급 폼 컴포넌트
export * from './forms'

// Charts - 차트 컴포넌트 (Chart.js)
export * from './charts'

// Marketing - 마케팅 섹션 컴포넌트
export * from './marketing'

// Korean - 한국 특화 컴포넌트
export * from './korean'
