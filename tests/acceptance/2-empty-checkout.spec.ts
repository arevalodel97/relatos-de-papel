import { test, expect } from '@playwright/test'

test.describe('Escenario 2: Validación de Flujo - Intento de Pago con Carrito Vacío', () => {
  // Sin beforeEach: cada test limpia localStorage de forma explícita

  test('2.1 - Cliente accede a checkout sin artículos muestra mensaje de carrito vacío', async ({ page }) => {
    // [Given] El carrito está vacío - navegar primero, luego limpiar
    await page.goto('http://localhost:5174/checkout')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.clear())
    // Recargar para asegurar que está limpio
    await page.reload()
    await page.waitForLoadState('networkidle')



    // [Then] Se muestra un mensaje indicando "No hay artículos para pagar"
    const emptyMessage = page.locator(
      'text=/[Nn]o hay artículos|[Ee]l carrito está vacío|[Aa]ñade algún libro/i'
    )
    await expect(emptyMessage).toBeVisible()

    const messageText = await emptyMessage.textContent()
    expect(messageText?.toLowerCase()).toContain('artículos')
  })

  test('2.2 - El botón "Pagar" no está visible cuando el carrito está vacío', async ({ page }) => {
    // [Given] El carrito está vacío y cliente está en checkout
    await page.goto('http://localhost:5174/checkout')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')

    // [Then] El botón "Pagar" NO debe estar visible
    const payButton = page.locator('button:has-text("Pagar"), button:has-text("Pay")')
    const isVisible = await payButton.isVisible().catch(() => false)
    expect(isVisible).toBe(false)
  })

  test('2.3 - Se muestra botón "Explorar libros" con carrito vacío', async ({ page }) => {
    // [Given] El carrito está vacío
    await page.goto('http://localhost:5174/checkout')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')

    // [When] Cliente navega a /checkout (ya está navegado)

    // [Then] Se muestra botón "Explorar libros"
    const exploreButton = page.locator('button:has-text("Explorar libros"), button:has-text("Continue Shopping")')
    await expect(exploreButton).toBeVisible()
    await expect(exploreButton).toBeEnabled()
  })

  test('2.4 - Clic en "Explorar libros" navega a /home', async ({ page }) => {
    // [Given] Cliente en checkout con carrito vacío
    await page.goto('http://localhost:5174/checkout')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')

    // [When] Hace clic en "Explorar libros"
    const exploreButton = page.locator('button:has-text("Explorar libros"), button:has-text("Continue Shopping")')
    await exploreButton.click()

    // [Then] Se navega a /home
    await page.waitForURL(/\/home/)
    await expect(page).toHaveURL(/\/home/)

    // [Then] El catálogo de libros es visible
    await page.locator('.book-card').first().waitFor({ state: 'visible' })
    const bookCards = page.locator('.book-card')
    const count = await bookCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('2.5 - El mensaje de carrito vacío está en español correcto', async ({ page }) => {
    // [Given] Cliente en checkout vacío
    await page.goto('http://localhost:5174/checkout')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')

    // [Then] El mensaje debe ser claro y en español
    const emptyMessage = page.locator(
      'text=/[Nn]o hay artículos|[Ee]l carrito|vacío|[Áá]ñade/i'
    )
    const messageText = await emptyMessage.textContent()
    
    // Verificar que el texto contiene palabras en español
    const lowerText = messageText?.toLowerCase() || ''
    expect(
      lowerText.includes('artículos') ||
      lowerText.includes('carrito') ||
      lowerText.includes('vacío') ||
      lowerText.includes('ñade') ||
      lowerText.includes('libro')
    ).toBe(true)
  })
})
