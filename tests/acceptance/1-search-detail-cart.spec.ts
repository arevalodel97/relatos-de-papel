import { test, expect } from '@playwright/test'

test.describe('Escenario 1: Flow Completo - Búsqueda → Detalle → Carrito → Resumen', () => {
  test('1.1 - Cliente busca un libro, lo ve en detalle, lo añade al carrito y revisa el resumen', async ({
    page,
  }) => {
    // [Given] El cliente está en Home, catálogo contiene 40 libros, carrito vacío
    await page.goto('http://localhost:5173/home')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.clear())
    
    await expect(page).toHaveURL(/\/home/)
    // Esperar a que carguen los libros
    await page.locator('.book-card').first().waitFor({ state: 'visible' })
    const bookCardInitial = page.locator('.book-card')
    const initialCount = await bookCardInitial.count()
    expect(initialCount).toBeGreaterThan(0)

    // [When] Escribir "Sombras" en la barra de búsqueda
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.waitFor({ state: 'visible' })
    await searchInput.fill('Sombras')
    await page.waitForTimeout(450)

    // [Then] Se filtran los resultados
    const filteredCards = page.locator('.book-card')
    const filteredCount = await filteredCards.count()
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
    
    for (let i = 0; i < filteredCount; i++) {
      const titleText = await filteredCards.nth(i).locator('.book-card__title').textContent()
      expect(titleText?.toLowerCase()).toContain('sombras')
    }

    // [When] Hacer clic en el primer libro
    const firstBook = filteredCards.first()
    const firstBookTitle = await firstBook.locator('.book-card__title').textContent()
    await firstBook.click()
    
    // [Then] Se navega a /book/:id
    await page.waitForURL(/\/book\/\d+/)
    await expect(page).toHaveURL(/\/book\//)

    // [Then] Se muestra el título, precio, descripción e imagen
    await expect(page.locator('.book-detail__title')).toContainText(firstBookTitle || 'Sombras')
    const priceElement = page.locator('.book-detail__price')
    await expect(priceElement).toBeVisible()
    const priceText = await priceElement.textContent()
    expect(priceText).toMatch(/\$\d+\.\d{2}/)

    await expect(page.locator('.book-detail__desc')).toBeVisible()
    await expect(page.locator('.book-detail__media')).toBeVisible()

    // [When] Hacer clic en "Añadir al carrito"
    const addBtn = page.locator('.book-detail__buy button:has-text("Añadir al carrito")')
    await expect(addBtn).toBeVisible()
    await addBtn.click()

    // [Then] Aparece la modal
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    const modalAddBtn = page.locator('[role="dialog"] button:has-text("Añadir")').first()
    await expect(modalAddBtn).toBeVisible()
    await modalAddBtn.click()
    await page.waitForTimeout(300)

    // [Then] El carrito se actualiza (Badge visible)
    const badge = page.locator('.MuiBadge-badge')
    await expect(badge).toBeVisible()

    // [Then] Navegar a /cart y verificar
    await page.goto('http://localhost:5173/cart')
    await page.waitForLoadState('networkidle')

    const cartItems = page.locator('.cart-item')
    await expect(cartItems).toHaveCount(1)
    const cartItemText = await cartItems.first().textContent()
    expect(cartItemText?.toLowerCase()).toContain('sombras')

    // [Then] El total es correcto
    const totalText = await page.locator('.cart__footer').textContent()
    expect(totalText).toMatch(/Total: \$\d+\.\d{2}/)
  })

  test('1.2 - El carrito persiste después de recargar la página', async ({ page }) => {
    // [Given] Navegar a home
    await page.goto('http://localhost:5173/home')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.clear())

    // [When] Añadir un libro
    const firstBook = page.locator('.book-card').first()
    await firstBook.click()
    await page.waitForURL(/\/book\//)

    const addBtn = page.locator('button:has-text("Añadir al carrito")').first()
    await addBtn.click()
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    const modalAddBtn = page.locator('[role="dialog"] button:has-text("Añadir")').first()
    await modalAddBtn.click()
    await page.waitForTimeout(300)

    // Navegar al carrito
    await page.goto('http://localhost:5173/cart')
    const cartCountBefore = await page.locator('.cart-item').count()
    expect(cartCountBefore).toBe(1)

    // [When] Recargar
    await page.reload()
    await page.waitForLoadState('networkidle')

    // [Then] El carrito sigue igual
    const cartCountAfter = await page.locator('.cart-item').count()
    expect(cartCountAfter).toBe(cartCountBefore)
  })

  test('1.3 - Búsqueda sin resultados muestra lista vacía', async ({ page }) => {
    // [Given] Navegar a home
    await page.goto('http://localhost:5173/home')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.clear())

    // [When] Buscar término que no existe
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.fill('xyz1234567890notexist')
    await page.waitForTimeout(450)

    // [Then] Lista vacía
    const bookCards = page.locator('.book-card')
    const count = await bookCards.count()
    expect(count).toBe(0)

    // [Then] Se muestra mensaje
    await expect(page.locator('.book-list__empty')).toBeVisible()
  })
})
