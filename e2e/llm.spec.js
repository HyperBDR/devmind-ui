/**
 * E2E tests for LLM stats, usage, and config pages.
 * Assumes app is served at baseURL (container or host). May require login first.
 */
import { test, expect } from '@playwright/test'

test.describe('LLM pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const url = page.url()
    if (url.includes('/login')) {
      await page.fill('input[type="text"], input[name="username"], input[placeholder*="mail" i]', process.env.TEST_USERNAME || 'admin')
      await page.fill('input[type="password"], input[name="password"]', process.env.TEST_PASSWORD || 'admin')
      await page.click('button[type="submit"], input[type="submit"], button:has-text("登录"), button:has-text("Login")')
      await page.waitForLoadState('networkidle')
    }
  })

  test('LLM menu is visible and navigates to stats', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const llmMenu = page.locator('text=LLM').or(page.locator('text=大模型')).first()
    await expect(llmMenu).toBeVisible({ timeout: 10000 })
    await llmMenu.click()
    const statsLink = page.locator('a[href*="/llm/stats"]').or(page.locator('text=Token 统计')).or(page.locator('text=Token Statistics')).first()
    await expect(statsLink).toBeVisible({ timeout: 5000 })
    await statsLink.click()
    await page.waitForURL(/\/llm\/stats/)
    await expect(page).toHaveURL(/\/llm\/stats/)
  })

  test('LLM Stats page shows summary and filters', async ({ page }) => {
    await page.goto('/llm/stats')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Token').or(page.locator('text=统计')).first()).toBeVisible({ timeout: 10000 })
    const userFilter = page.locator('select').first()
    await expect(userFilter).toBeVisible({ timeout: 5000 })
  })

  test('LLM Usage page shows table or empty state', async ({ page }) => {
    await page.goto('/llm/usage')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=明细').or(page.locator('text=Usage')).or(page.locator('text=暂无数据')).or(page.locator('table')).first()).toBeVisible({ timeout: 10000 })
  })

  test('LLM Config page shows global form', async ({ page }) => {
    await page.goto('/llm/config')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=配置').or(page.locator('text=Configuration')).or(page.locator('text=全局')).first()).toBeVisible({ timeout: 10000 })
    const providerSelect = page.locator('select').first()
    await expect(providerSelect).toBeVisible({ timeout: 5000 })
  })
})
