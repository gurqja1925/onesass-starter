/**
 * 인증 테스트
 */

import { test, expect } from '@playwright/test'

test.describe('인증 페이지', () => {
  test('로그인 페이지가 정상적으로 로드됨', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // 로그인 폼 또는 소셜 로그인 버튼 확인
    const loginForm = page.locator('form')
    const socialButtons = page.getByRole('button', { name: /google|kakao|github|로그인/i })

    const formCount = await loginForm.count()
    const buttonCount = await socialButtons.count()

    // 폼이나 버튼 중 하나는 있어야 함
    expect(formCount + buttonCount).toBeGreaterThan(0)
  })

  test('회원가입 페이지가 정상적으로 로드됨', async ({ page }) => {
    await page.goto('/signup')
    await page.waitForLoadState('networkidle')

    // 회원가입 관련 컨텐츠 확인
    const signupContent = page.getByText(/회원가입|가입|sign up/i)
    await expect(signupContent.first()).toBeVisible()
  })
})

test.describe('결제 플로우 (데모)', () => {
  test('가격 페이지가 정상적으로 로드됨', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    // 가격 플랜 확인
    const plans = page.getByText(/무료|프로|엔터프라이즈|free|pro|enterprise/i)
    const count = await plans.count()

    // 최소한 하나의 플랜이 보여야 함
    expect(count).toBeGreaterThan(0)
  })

  test('결제 성공 페이지', async ({ page }) => {
    await page.goto('/payment/success')
    await page.waitForLoadState('networkidle')

    // 성공 메시지 확인
    const successContent = page.getByText(/성공|완료|감사|success|thank/i)
    await expect(successContent.first()).toBeVisible()
  })

  test('결제 실패 페이지', async ({ page }) => {
    await page.goto('/payment/fail')
    await page.waitForLoadState('networkidle')

    // 실패 메시지 확인
    const failContent = page.getByText(/실패|취소|오류|fail|error|cancel/i)
    await expect(failContent.first()).toBeVisible()
  })
})
