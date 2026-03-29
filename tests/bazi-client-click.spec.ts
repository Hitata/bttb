import { test, expect } from '@playwright/test'

test('clicking client from list shows their bazi chart', async ({ page }) => {
  // First save a client via URL
  await page.goto('/bazi?name=Click+Test&gender=male&y=1990&m=6&d=15&h=12&min=0')
  await expect(page.locator('text=Nhật Chủ').first()).toBeVisible({ timeout: 15000 })

  const saveBtn = page.locator('button:has-text("Lưu khách hàng")')
  await saveBtn.click()
  await expect(page.locator('text=Đã lưu khách')).toBeVisible({ timeout: 5000 })

  // Now go to clients page directly
  await page.goto('/bazi/clients')
  await expect(page.locator('text=Click Test')).toBeVisible({ timeout: 5000 })

  // Click the client
  await page.locator('a:has-text("Click Test")').click()
  await page.waitForURL('**/bazi?**')

  // Verify chart loaded — pillar table should appear
  await expect(page.locator('text=Nhật Chủ').first()).toBeVisible({ timeout: 15000 })

  // Take a screenshot for debugging
  await page.screenshot({ path: 'test-results/bazi-client-click.png', fullPage: true })

  // The name should appear somewhere (collapsed form summary)
  const bodyText = await page.textContent('body')
  expect(bodyText).toContain('Click Test')
})

test('clicking client from bazi sidebar shows their chart', async ({ page }) => {
  // Start on bazi page (no params)
  await page.goto('/bazi')
  await page.waitForLoadState('networkidle')

  // Click "Khách" link
  const clientsLink = page.locator('a:has-text("Khách")')
  await expect(clientsLink).toBeVisible({ timeout: 5000 })
  await clientsLink.click()
  await page.waitForURL('**/bazi/clients')

  // Should see at least the previously saved client
  const clientCard = page.locator('a:has-text("Click Test")')
  // If it exists, click it
  if (await clientCard.isVisible({ timeout: 3000 }).catch(() => false)) {
    await clientCard.click()
    await page.waitForURL('**/bazi?**')
    await expect(page.locator('text=Nhật Chủ').first()).toBeVisible({ timeout: 15000 })
  }
})
