'use client'

/**
 * Template Selection Provider
 * 템플릿 선택 상태 관리 - 랜딩, 어드민, 블로그 각각 선택 가능
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// 템플릿 카테고리별 선택 상태
export interface TemplateSelections {
  landing: string | null    // 'LandingSaaS', 'LandingStartup' 등
  admin: string | null      // 'DashboardAnalytics', 'DashboardSaaS' 등
  blog: string | null       // 'BlogGrid', 'BlogPost' 등
  ai: string | null         // 'ChatbotTemplate', 'ImageGenTemplate' 등
}

interface TemplateContextType {
  selections: TemplateSelections
  setTemplate: (category: keyof TemplateSelections, templateId: string | null) => void
  getTemplate: (category: keyof TemplateSelections) => string | null
  clearAll: () => void
}

const defaultSelections: TemplateSelections = {
  landing: null,
  admin: null,
  blog: null,
  ai: null,
}

const TemplateContext = createContext<TemplateContextType | null>(null)

const STORAGE_KEY = 'onesaas-template-selections'

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [selections, setSelections] = useState<TemplateSelections>(defaultSelections)
  const [isLoaded, setIsLoaded] = useState(false)

  // localStorage에서 초기값 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setSelections({ ...defaultSelections, ...parsed })
      }
    } catch (e) {
      console.error('템플릿 설정 로드 실패:', e)
    }
    setIsLoaded(true)
  }, [])

  // 변경 시 localStorage에 저장
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selections))
      } catch (e) {
        console.error('템플릿 설정 저장 실패:', e)
      }
    }
  }, [selections, isLoaded])

  const setTemplate = (category: keyof TemplateSelections, templateId: string | null) => {
    setSelections(prev => ({
      ...prev,
      [category]: templateId,
    }))
  }

  const getTemplate = (category: keyof TemplateSelections): string | null => {
    return selections[category]
  }

  const clearAll = () => {
    setSelections(defaultSelections)
  }

  return (
    <TemplateContext.Provider value={{ selections, setTemplate, getTemplate, clearAll }}>
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplateSelection() {
  const context = useContext(TemplateContext)
  if (!context) {
    throw new Error('useTemplateSelection must be used within a TemplateProvider')
  }
  return context
}

// 템플릿 메타 정보
export const TEMPLATE_INFO: Record<string, { name: string; category: keyof TemplateSelections; description: string }> = {
  // Landing
  LandingSaaS: { name: 'SaaS 랜딩', category: 'landing', description: 'SaaS 제품용 랜딩 페이지' },
  LandingStartup: { name: '스타트업 랜딩', category: 'landing', description: '스타트업용 랜딩 페이지' },

  // Admin
  DashboardAnalytics: { name: '분석 대시보드', category: 'admin', description: '데이터 분석용 대시보드' },
  DashboardEcommerce: { name: '이커머스 대시보드', category: 'admin', description: '쇼핑몰 관리용 대시보드' },
  DashboardSaaS: { name: 'SaaS 대시보드', category: 'admin', description: 'SaaS 관리용 대시보드' },
  UsersList: { name: '사용자 목록', category: 'admin', description: '사용자 관리 페이지' },
  OrdersList: { name: '주문 목록', category: 'admin', description: '주문 관리 페이지' },
  ProductsList: { name: '상품 목록', category: 'admin', description: '상품 관리 페이지' },
  SettingsProfile: { name: '프로필 설정', category: 'admin', description: '프로필 설정 페이지' },
  SettingsBilling: { name: '결제 설정', category: 'admin', description: '결제 관리 페이지' },
  SettingsTeam: { name: '팀 설정', category: 'admin', description: '팀 관리 페이지' },

  // Blog
  BlogGrid: { name: '블로그 그리드', category: 'blog', description: '그리드 레이아웃 블로그' },
  BlogPost: { name: '블로그 포스트', category: 'blog', description: '블로그 포스트 상세' },

  // AI
  ChatbotTemplate: { name: 'AI 챗봇', category: 'ai', description: '대화형 AI 어시스턴트' },
  ImageGenTemplate: { name: '이미지 생성', category: 'ai', description: 'AI 이미지 생성기' },
  TextGenTemplate: { name: '텍스트 생성', category: 'ai', description: '블로그/마케팅 카피 생성' },
  CodeAssistantTemplate: { name: '코드 어시스턴트', category: 'ai', description: '코드 생성 및 분석' },
  VoiceTemplate: { name: '음성 서비스', category: 'ai', description: 'TTS/STT 변환' },
  SummarizerTemplate: { name: '문서 요약', category: 'ai', description: '긴 문서 핵심 요약' },
  TranslatorTemplate: { name: 'AI 번역', category: 'ai', description: '다국어 번역 서비스' },
  RecommendationTemplate: { name: '추천 시스템', category: 'ai', description: '맞춤형 추천 엔진' },
}
