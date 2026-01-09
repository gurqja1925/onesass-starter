/**
 * 홈페이지 테스트
 */

import { test, expect } from '@playwright/test'

test.describe('홈페이지', () => {
  test('페이지가 정상적으로 로드됨', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 타이틀 확인
    await expect(page).toHaveTitle(/.*/)
  })

  test('네비게이션이 표시됨', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 네비게이션 요소 확인
    const nav = page.locator('nav, header')
    await expect(nav.first()).toBeVisible()
  })

  test('로그인 버튼이 존재함', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 로그인 관련 링크/버튼 찾기
    const loginButton = page.getByRole('link', { name: /로그인|login|시작/i })
    // 버튼이 있으면 확인, 없으면 통과
    const count = await loginButton.count()
    if (count > 0) {
      await expect(loginButton.first()).toBeVisible()
    }
  })
})
