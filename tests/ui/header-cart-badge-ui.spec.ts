import { test, expect } from '@playwright/test'

/**
 * Pruebas funcionales de UI – Criterio 2 Actividad 3
 * Componente: Header - Badge del carrito
 * Objetivo: Validar el comportamiento del badge del carrito (contador de items)
 */
test.describe('Pruebas funcionales de UI – Criterio 2 Actividad 3: Header Cart Badge', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('http://localhost:5173/home')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Esperar a que carguen los libros
    await page.locator('.book-card').first().waitFor({ state: 'visible', timeout: 5000 })
  })

  test('debe mostrar badge con 0 items cuando el carrito está vacío', async ({ page }) => {
    // [Given] El carrito está vacío (localStorage limpio)
    const cartIcon = page.locator('.header__toolbar .MuiBadge-root')
    await expect(cartIcon).toBeVisible()

    // [Then] El badge debe mostrar 0 o no mostrar número
    const badge = page.locator('.MuiBadge-badge')
    const badgeText = await badge.textContent()
    
    // Material UI puede no mostrar el badge cuando es 0, o mostrar "0"
    if (badgeText && badgeText.trim() !== '') {
      expect(badgeText.trim()).toBe('0')
    }
  })

  test('debe actualizar el badge al añadir un libro al carrito', async ({ page }) => {
    // [Given] El carrito está vacío
    const badge = page.locator('.MuiBadge-badge')
    
    // [When] El usuario añade un libro al carrito
    const firstCard = page.locator('.book-card').first()
    const addButton = firstCard.locator('button:has-text("Añadir")')
    await addButton.click()

    // Esperar el modal y confirmar
    await page.waitForTimeout(300)
    const modalAddButton = page.locator('[role="dialog"] button:has-text("Añadir")').last()
    await expect(modalAddButton).toBeVisible()
    await modalAddButton.click()

    // Esperar a que se cierre el modal
    await page.waitForTimeout(500)

    // [Then] El badge debe mostrar "1"
    await expect(badge).toBeVisible()
    const badgeText = await badge.textContent()
    expect(badgeText?.trim()).toBe('1')
  })

  test('debe mostrar el número correcto después de añadir múltiples libros', async ({ page }) => {
    // [Given] El carrito está vacío
    const badge = page.locator('.MuiBadge-badge')

    // [When] El usuario añade 3 libros diferentes al carrito
    for (let i = 0; i < 3; i++) {
      const card = page.locator('.book-card').nth(i)
      const addButton = card.locator('button:has-text("Añadir")')
      await addButton.click()
      
      await page.waitForTimeout(300)
      const modalAddButton = page.locator('[role="dialog"] button:has-text("Añadir")').last()
      await modalAddButton.click()
      await page.waitForTimeout(500)
    }

    // [Then] El badge debe mostrar "3"
    await expect(badge).toBeVisible()
    const badgeText = await badge.textContent()
    expect(badgeText?.trim()).toBe('3')
  })

  test('debe persistir el valor del badge después de recargar la página (localStorage)', async ({ page }) => {
    // [Given] El usuario añade un libro al carrito
    const firstCard = page.locator('.book-card').first()
    const addButton = firstCard.locator('button:has-text("Añadir")')
    await addButton.click()

    await page.waitForTimeout(300)
    const modalAddButton = page.locator('[role="dialog"] button:has-text("Añadir")').last()
    await modalAddButton.click()
    await page.waitForTimeout(500)

    // [Then] El badge muestra "1"
    const badge = page.locator('.MuiBadge-badge')
    let badgeText = await badge.textContent()
    expect(badgeText?.trim()).toBe('1')

    // [When] El usuario recarga la página
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.locator('.book-card').first().waitFor({ state: 'visible' })

    // [Then] El badge debe seguir mostrando "1" (persistencia en localStorage)
    const badgeAfterReload = page.locator('.MuiBadge-badge')
    await expect(badgeAfterReload).toBeVisible()
    badgeText = await badgeAfterReload.textContent()
    expect(badgeText?.trim()).toBe('1')
  })

  test('debe incrementar el badge al añadir el mismo libro varias veces', async ({ page }) => {
    // [Given] El carrito está vacío
    const badge = page.locator('.MuiBadge-badge')
    
    // [When] El usuario añade el mismo libro 2 veces
    const firstCard = page.locator('.book-card').first()
    
    // Primera vez
    await firstCard.locator('button:has-text("Añadir")').click()
    await page.waitForTimeout(300)
    await page.locator('[role="dialog"] button:has-text("Añadir")').last().click()
    await page.waitForTimeout(500)

    // Segunda vez
    await firstCard.locator('button:has-text("Añadir")').click()
    await page.waitForTimeout(300)
    await page.locator('[role="dialog"] button:has-text("Añadir")').last().click()
    await page.waitForTimeout(500)

    // [Then] El badge debe mostrar "1" (mismo libro, cantidad incrementada)
    // Nota: El badge muestra el número de items únicos, no la cantidad total
    const badgeText = await badge.textContent()
    expect(badgeText?.trim()).toBe('1')
  })

  test('debe navegar al carrito al hacer clic en el icono del badge', async ({ page }) => {
    // [Given] El usuario está en la página de inicio
    await expect(page).toHaveURL(/\/home/)

    // [When] El usuario hace clic en el icono del carrito
    const cartButton = page.locator('.header__toolbar button:has(.MuiBadge-root)')
    await cartButton.click()

    // [Then] Debe navegar a la página del carrito
    await page.waitForURL(/\/cart/)
    await expect(page).toHaveURL(/\/cart/)
  })

  test('debe mantener el badge visible después de navegar entre páginas', async ({ page }) => {
    // [Given] El usuario añade un libro al carrito
    const firstCard = page.locator('.book-card').first()
    await firstCard.locator('button:has-text("Añadir")').click()
    await page.waitForTimeout(300)
    await page.locator('[role="dialog"] button:has-text("Añadir")').last().click()
    await page.waitForTimeout(500)

    // [Then] El badge muestra "1"
    const badge = page.locator('.MuiBadge-badge')
    let badgeText = await badge.textContent()
    expect(badgeText?.trim()).toBe('1')

    // [When] El usuario navega al detalle de un libro
    await page.locator('.book-card').nth(2).click()
    await page.waitForURL(/\/book\//)

    // [Then] El badge debe seguir mostrando "1"
    const badgeInDetail = page.locator('.MuiBadge-badge')
    await expect(badgeInDetail).toBeVisible()
    badgeText = await badgeInDetail.textContent()
    expect(badgeText?.trim()).toBe('1')

    // [When] El usuario vuelve a home
    const brandLink = page.locator('.header__brand')
    await brandLink.click()
    await page.waitForURL(/\/home/)

    // [Then] El badge debe seguir mostrando "1"
    const badgeInHome = page.locator('.MuiBadge-badge')
    await expect(badgeInHome).toBeVisible()
    badgeText = await badgeInHome.textContent()
    expect(badgeText?.trim()).toBe('1')
  })
})
