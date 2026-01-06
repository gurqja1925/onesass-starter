/**
 * AI 서비스 템플릿 통합 Export
 * 다양한 AI 기능을 위한 프로덕션 레디 템플릿
 */

// 챗봇 - 대화형 AI 인터페이스
export { ChatbotTemplate } from './chatbot/ChatbotTemplate'

// 이미지 생성 - DALL-E, Stable Diffusion 등
export { ImageGenTemplate } from './image-gen/ImageGenTemplate'

// 텍스트 생성 - 블로그, 마케팅, 이메일 등
export { TextGenTemplate } from './text-gen/TextGenTemplate'

// 코드 어시스턴트 - 코드 생성, 설명, 리팩토링
export { CodeAssistantTemplate } from './code-assistant/CodeAssistantTemplate'

// 음성 서비스 - TTS, STT
export { VoiceTemplate } from './voice/VoiceTemplate'

// 요약 - 문서, URL 요약
export { SummarizerTemplate } from './summarizer/SummarizerTemplate'

// 번역 - 다국어 번역 및 로컬라이징
export { TranslatorTemplate } from './translator/TranslatorTemplate'

// 추천 시스템 - 상품, 콘텐츠 추천
export { RecommendationTemplate } from './recommendation/RecommendationTemplate'

// AI 템플릿 메타데이터
export const AI_TEMPLATES = [
  {
    id: 'chatbot',
    name: 'AI 챗봇',
    description: '대화형 AI 어시스턴트',
    icon: 'Bot',
    category: 'conversation',
  },
  {
    id: 'image-gen',
    name: '이미지 생성',
    description: 'AI 이미지 생성기',
    icon: 'Image',
    category: 'creative',
  },
  {
    id: 'text-gen',
    name: '텍스트 생성',
    description: '블로그, 마케팅 카피 생성',
    icon: 'FileText',
    category: 'creative',
  },
  {
    id: 'code-assistant',
    name: '코드 어시스턴트',
    description: '코드 생성 및 분석',
    icon: 'Code',
    category: 'developer',
  },
  {
    id: 'voice',
    name: '음성 서비스',
    description: 'TTS/STT 변환',
    icon: 'Volume2',
    category: 'accessibility',
  },
  {
    id: 'summarizer',
    name: '문서 요약',
    description: '긴 문서 핵심 요약',
    icon: 'FileText',
    category: 'productivity',
  },
  {
    id: 'translator',
    name: 'AI 번역',
    description: '다국어 번역 서비스',
    icon: 'Languages',
    category: 'localization',
  },
  {
    id: 'recommendation',
    name: '추천 시스템',
    description: '맞춤형 추천 엔진',
    icon: 'Sparkles',
    category: 'personalization',
  },
] as const

export type AITemplateId = typeof AI_TEMPLATES[number]['id']
