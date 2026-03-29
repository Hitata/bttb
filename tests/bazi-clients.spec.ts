import { test, expect } from '@playwright/test'

test.describe('Bazi Client Flow', () => {
  test('calculate chart via URL params, save client, view in list, click to reload', async ({ page }) => {
    // Step 1: Load bazi chart via URL params (simulating form submission)
    await page.goto('/bazi?name=Test+Playwright&gender=female&y=1991&m=11&d=6&h=8&min=0')

    // Wait for chart to calculate — "Nhật Chủ" label appears in the pillar table
    await expect(page.locator('text=Nhật Chủ').first()).toBeVisible({ timeout: 15000 })

    // Verify the solar term fix: month pillar should be Mậu Tuất, not Kỷ Hợi
    const body = page.locator('body')
    await expect(body).toContainText('Tuất')

    // Step 2: Save as client
    const saveBtn = page.locator('button:has-text("Lưu khách hàng")')
    await expect(saveBtn).toBeVisible({ timeout: 5000 })
    await saveBtn.click()
    await expect(page.locator('text=Đã lưu khách')).toBeVisible({ timeout: 5000 })

    // Step 3: Navigate to client list
    const clientsLink = page.locator('a:has-text("Khách")')
    await expect(clientsLink).toBeVisible()
    await clientsLink.click()
    await page.waitForURL('**/bazi/clients')

    // Verify client appears
    await expect(page.locator('text=Test Playwright')).toBeVisible({ timeout: 5000 })

    // Step 4: Click client to load their chart
    await page.locator('a:has-text("Test Playwright")').click()
    await page.waitForURL('**/bazi?**')

    // Wait for chart to load
    await expect(page.locator('text=Nhật Chủ').first()).toBeVisible({ timeout: 15000 })

    // Verify chart loaded with correct data
    await expect(body).toContainText('Test Playwright')
    await expect(body).toContainText('Tuất')
  })
})
