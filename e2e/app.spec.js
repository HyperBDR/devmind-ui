/**
 * E2E tests for app shell: login, dashboard, navigation.
 */
import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('home redirects to dashboard or login', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const url = page.url()
    expect(url).toMatch(/\/(dashboard|login)?(\?|$)/)
  })

  test('LLM routes are reachable', async ({ page }) => {
    await page.goto('/llm/stats')
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/llm/stats')

    await page.goto('/llm/usage')
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/llm/usage')

    await page.goto('/llm/config')
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/llm/config')
  })
})
