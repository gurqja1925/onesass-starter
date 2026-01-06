'use client'

/**
 * AddressSearch 컴포넌트
 * 한국 주소 검색 (다음 주소 API 연동)
 */

import { forwardRef, useState, useEffect } from 'react'
import { MapPin, Search, X } from 'lucide-react'

export interface AddressResult {
  zonecode: string      // 우편번호
  address: string       // 기본 주소
  addressEnglish: string
  roadAddress: string   // 도로명 주소
  jibunAddress: string  // 지번 주소
  buildingName: string  // 건물명
  sido: string          // 시/도
  sigungu: string       // 시/군/구
  bname: string         // 법정동
}

export interface AddressSearchProps {
  label?: string
  error?: string
  value?: AddressResult | null
  onChange?: (address: AddressResult | null) => void
  detailPlaceholder?: string
  showDetail?: boolean
  className?: string
}

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: AddressResult) => void
        onclose?: () => void
      }) => { open: () => void }
    }
  }
}

export const AddressSearch = forwardRef<HTMLInputElement, AddressSearchProps>(
  ({ label, error, value, onChange, detailPlaceholder = '상세 주소를 입력하세요', showDetail = true, className = '' }, ref) => {
    const [detail, setDetail] = useState('')
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)

    useEffect(() => {
      // 다음 주소 API 스크립트 로드
      if (typeof window !== 'undefined' && !window.daum) {
        const script = document.createElement('script')
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
        script.async = true
        script.onload = () => setIsScriptLoaded(true)
        document.head.appendChild(script)
      } else {
        setIsScriptLoaded(true)
      }
    }, [])

    const openAddressSearch = () => {
      if (!isScriptLoaded || !window.daum) {
        alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
        return
      }

      new window.daum.Postcode({
        oncomplete: (data: AddressResult) => {
          onChange?.(data)
          setDetail('')
        },
      }).open()
    }

    const clearAddress = () => {
      onChange?.(null)
      setDetail('')
    }

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
            {label}
          </label>
        )}

        {/* 주소 검색 버튼 */}
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--color-text-secondary)' }}
          />
          <input
            ref={ref}
            type="text"
            readOnly
            value={value ? `[${value.zonecode}] ${value.roadAddress || value.address}` : ''}
            onClick={openAddressSearch}
            placeholder="주소를 검색하세요"
            className="w-full pl-10 pr-20 py-2.5 rounded-lg border outline-none cursor-pointer"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: error ? '#ef4444' : 'var(--color-border)',
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {value && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearAddress(); }}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            )}
            <button
              type="button"
              onClick={openAddressSearch}
              className="px-3 py-1 rounded text-sm font-medium"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 상세 주소 입력 */}
        {showDetail && value && (
          <input
            type="text"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={detailPlaceholder}
            className="w-full mt-2 px-4 py-2.5 rounded-lg border outline-none focus:ring-2"
            style={{
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          />
        )}

        {/* 선택된 주소 정보 */}
        {value && (
          <div className="mt-2 p-3 rounded-lg text-sm" style={{ background: 'var(--color-bg-secondary)' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              우편번호: <span style={{ color: 'var(--color-text)' }}>{value.zonecode}</span>
            </p>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              도로명: <span style={{ color: 'var(--color-text)' }}>{value.roadAddress}</span>
            </p>
            {value.jibunAddress && (
              <p style={{ color: 'var(--color-text-secondary)' }}>
                지번: <span style={{ color: 'var(--color-text)' }}>{value.jibunAddress}</span>
              </p>
            )}
          </div>
        )}

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

AddressSearch.displayName = 'AddressSearch'
