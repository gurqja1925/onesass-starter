/**
 * XSS 방지를 위한 HTML Sanitizer
 *
 * 사용자 입력에서 악성 스크립트를 제거합니다.
 */

// 허용할 HTML 태그 목록
const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'strike', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
])

// 허용할 속성 목록
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
  '*': new Set(['class', 'id', 'style']),
}

// 위험한 프로토콜
const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:']

// 위험한 CSS 속성
const DANGEROUS_CSS = [
  'expression',
  'javascript:',
  'behavior',
  '-moz-binding',
]

/**
 * HTML 엔티티 이스케이프
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return text.replace(/[&<>"'/]/g, (char) => map[char])
}

/**
 * HTML 엔티티 언이스케이프
 */
export function unescapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
  }
  return text.replace(/&(amp|lt|gt|quot|#x27|#x2F);/g, (match) => map[match] || match)
}

/**
 * URL이 안전한지 검사
 */
function isSafeUrl(url: string): boolean {
  const trimmedUrl = url.trim().toLowerCase()
  return !DANGEROUS_PROTOCOLS.some(protocol => trimmedUrl.startsWith(protocol))
}

/**
 * CSS가 안전한지 검사
 */
function isSafeCss(css: string): boolean {
  const lowerCss = css.toLowerCase()
  return !DANGEROUS_CSS.some(pattern => lowerCss.includes(pattern))
}

/**
 * 속성 값 검증 및 정제
 */
function sanitizeAttribute(tag: string, attr: string, value: string): string | null {
  const tagAttrs = ALLOWED_ATTRS[tag] || new Set()
  const globalAttrs = ALLOWED_ATTRS['*']

  // 허용된 속성인지 확인
  if (!tagAttrs.has(attr) && !globalAttrs.has(attr)) {
    return null
  }

  // href/src 속성 URL 검증
  if ((attr === 'href' || attr === 'src') && !isSafeUrl(value)) {
    return null
  }

  // style 속성 CSS 검증
  if (attr === 'style' && !isSafeCss(value)) {
    return null
  }

  // target 속성은 _blank만 허용
  if (attr === 'target' && value !== '_blank') {
    return '_self'
  }

  // a 태그의 rel 속성에 noopener noreferer 강제 추가 (_blank인 경우)
  if (tag === 'a' && attr === 'rel') {
    return 'noopener noreferrer'
  }

  return escapeHtml(value)
}

/**
 * HTML 문자열 정제 (간단한 구현)
 *
 * 주의: 프로덕션 환경에서는 DOMPurify 같은 검증된 라이브러리 사용 권장
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  // 스크립트 태그 완전 제거
  let result = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // on* 이벤트 핸들러 제거
  result = result.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  result = result.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')

  // javascript: URL 제거
  result = result.replace(/javascript\s*:/gi, '')

  // data: URL 제거 (이미지 제외)
  result = result.replace(/data\s*:[^"'\s>]*(?!image\/(png|jpg|jpeg|gif|webp))/gi, '')

  // style 태그 제거
  result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // iframe, object, embed 제거
  result = result.replace(/<(iframe|object|embed|form|input|button)[^>]*>.*?<\/\1>/gi, '')
  result = result.replace(/<(iframe|object|embed|form|input|button)[^>]*\/?>/gi, '')

  return result
}

/**
 * 텍스트 전용 정제 (모든 HTML 태그 제거)
 */
export function sanitizeText(text: string): string {
  if (!text) return ''

  // 모든 HTML 태그 제거
  const withoutTags = text.replace(/<[^>]*>/g, '')

  // HTML 엔티티 이스케이프
  return escapeHtml(withoutTags)
}

/**
 * JSON 값 정제 (재귀적으로 모든 문자열 이스케이프)
 */
export function sanitizeJson<T>(data: T): T {
  if (typeof data === 'string') {
    return escapeHtml(data) as T
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeJson(item)) as T
  }

  if (data !== null && typeof data === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      result[key] = sanitizeJson(value)
    }
    return result as T
  }

  return data
}

/**
 * SQL Injection 방지를 위한 이스케이프
 * (Prisma 사용 시 기본적으로 처리되지만, raw query 사용 시 필요)
 */
export function escapeSql(text: string): string {
  return text.replace(/['"\\\x00\x1a]/g, (char) => {
    const map: Record<string, string> = {
      "'": "\\'",
      '"': '\\"',
      '\\': '\\\\',
      '\x00': '\\0',
      '\x1a': '\\Z',
    }
    return map[char] || char
  })
}

/**
 * 파일명 정제 (경로 순회 공격 방지)
 */
export function sanitizeFilename(filename: string): string {
  // 경로 구분자 제거
  let safe = filename.replace(/[\/\\]/g, '')

  // 숨김 파일 방지
  safe = safe.replace(/^\.+/, '')

  // 특수 문자 제거
  safe = safe.replace(/[<>:"|?*\x00-\x1f]/g, '')

  // 빈 문자열 방지
  return safe || 'unnamed'
}
