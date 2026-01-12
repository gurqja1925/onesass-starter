/**
 * Vercel Blob 이미지 업로드 API
 * 프로필 이미지, 컨텐츠 이미지 등 업로드에 사용
 */

import { NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// 허용된 MIME 타입
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]

// 최대 파일 크기 (5MB)
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ success: false, error: '파일이 없습니다' }, { status: 400 })
    }

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: `허용되지 않는 파일 형식입니다. 허용: ${ALLOWED_TYPES.join(', ')}`
      }, { status: 400 })
    }

    // 파일 크기 검증
    if (file.size > MAX_SIZE) {
      return NextResponse.json({
        success: false,
        error: `파일이 너무 큽니다. 최대 ${MAX_SIZE / 1024 / 1024}MB까지 허용됩니다`
      }, { status: 400 })
    }

    // 파일명 생성 (user-id/folder/timestamp-originalname)
    const userId = session.user.id || session.user.email || 'anonymous'
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const pathname = `${userId}/${folder}/${timestamp}-${safeName}`

    // Vercel Blob에 업로드
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: file.size,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      error: `업로드 실패: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 })
  }
}

// 파일 삭제
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL이 필요합니다' }, { status: 400 })
    }

    // 사용자의 파일인지 확인
    const userId = session.user.id || session.user.email || ''
    if (!url.includes(`/${userId}/`)) {
      return NextResponse.json({ success: false, error: '권한이 없습니다' }, { status: 403 })
    }

    await del(url)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({
      success: false,
      error: `삭제 실패: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 })
  }
}
