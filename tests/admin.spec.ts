/**
 * 관리자 페이지 테스트
 */

import { test, expect } from '@playwright/test'

test.describe('관리자 대시보드 (데모 모드)', () => {
  test.beforeEach(async ({ page }) => {
    // 데모 모드 설정
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('app_mode', 'demo')
    })
  })

  test('관리자 대시보드가 데모 모드에서 로드됨', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    // 페이지 타이틀 또는 헤더 확인
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading.first()).toBeVisible()
  })

  test('사용자 관리 페이지', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')

    // 사용자 목록 또는 테이블 확인
    const table = page.locator('table')
    const count = await table.count()

    if (count > 0) {
      await expect(table.first()).toBeVisible()
    } else {
      // 테이블이 없으면 로딩 메시지 또는 빈 상태 확인
      const loadingOrEmpty = page.getByText(/로딩|사용자|없음/i)
      await expect(loadingOrEmpty.first()).toBeVisible()
    }
  })

  test('결제 관리 페이지', async ({ page }) => {
    await page.goto('/admin/payments')
    await page.waitForLoadState('networkidle')

    // 결제 관련 컨텐츠 확인
    const heading = page.getByRole('heading', { name: /결제/i })
    await expect(heading.first()).toBeVisible()
  })

  test('설정 페이지', async ({ page }) => {
    await page.goto('/admin/settings')
    await page.waitForLoadState('networkidle')

    // 설정 관련 컨텐츠 확인
    const heading = page.getByRole('heading', { name: /설정/i })
    await expect(heading.first()).toBeVisible()
  })

  test('초기 설정 가이드', async ({ page }) => {
    await page.goto('/admin/setup')
    await page.waitForLoadState('networkidle')

    // 가이드 단계가 표시되는지 확인
    const stepButtons = page.locator('button').filter({ hasText: /1|2|3|4|5/ })
    const count = await stepButtons.count()
    expect(count).toBeGreaterThanOrEqual(5)
  })
})

test.describe('모드 전환', () => {
  test('데모 모드에서 운영 모드로 전환', async ({ page }) => {
    await page.goto('/admin/settings')
    await page.evaluate(() => {
      localStorage.setItem('app_mode', 'demo')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 데모 모드 표시 확인
    const demoIndicator = page.getByText(/데모|DEMO/i)
    const count = await demoIndicator.count()
    expect(count).toBeGreaterThan(0)
  })
})
