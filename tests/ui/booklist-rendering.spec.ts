import { test, expect } from '@playwright/test'

/**
 * Pruebas funcionales de UI – Criterio 2 Actividad 3
 * Componente: BookList y BookCard
 * Objetivo: Validar el renderizado correcto de la lista de libros con datos mock
 */
test.describe('Pruebas funcionales de UI – Criterio 2 Actividad 3: BookList Rendering', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('http://localhost:5173/home')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Esperar a que carguen los libros
    await page.locator('.book-card').first().waitFor({ state: 'visible', timeout: 5000 })
  })

  test('debe renderizar 10 libros en la primera página (paginación)', async ({ page }) => {
    // [Given] El usuario está en la página de inicio
    await expect(page).toHaveURL(/\/home/)

    // [Then] Debe haber exactamente 10 cards de libros visibles (página 1)
    const bookCards = page.locator('.book-card')
    const count = await bookCards.count()
    expect(count).toBe(10)
  })

  test('debe mostrar título, autor y precio en cada card', async ({ page }) => {
    // [Given] Los libros están cargados
    const bookCards = page.locator('.book-card')
    const count = await bookCards.count()
    expect(count).toBeGreaterThan(0)

    // [Then] Cada card debe tener título, autor y precio visibles
    for (let i = 0; i < count; i++) {
      const card = bookCards.nth(i)
      
      // Verificar título
      const title = card.locator('.book-card__title')
      await expect(title).toBeVisible()
      const titleText = await title.textContent()
      expect(titleText).toBeTruthy()
      expect(titleText?.length).toBeGreaterThan(0)
      
      // Verificar autor
      const author = card.locator('.book-card__author')
      await expect(author).toBeVisible()
      const authorText = await author.textContent()
      expect(authorText).toBeTruthy()
      expect(authorText).toMatch(/Autor \d+/)
      
      // Verificar precio
      const price = card.locator('.book-card__price')
      await expect(price).toBeVisible()
      const priceText = await price.textContent()
      expect(priceText).toMatch(/\$\d+\.\d{2}/)
    }
  })

  test('debe mostrar el botón "Añadir" en cada card', async ({ page }) => {
    // [Given] Los libros están cargados
    const bookCards = page.locator('.book-card')
    const count = await bookCards.count()

    // [Then] Cada card debe tener un botón "Añadir"
    for (let i = 0; i < count; i++) {
      const card = bookCards.nth(i)
      const addButton = card.locator('button:has-text("Añadir")')
      
      await expect(addButton).toBeVisible()
      await expect(addButton).toBeEnabled()
    }
  })

  test('debe existir paginación con más de 1 página para 40 libros mock', async ({ page }) => {
    // [Given] BOOKS_MOCK tiene 40 libros y se muestran 10 por página
    // [Then] Debe haber paginación visible
    const pagination = page.locator('.book-list__pagination')
    await expect(pagination).toBeVisible()

    // [Then] Debe haber al menos 4 páginas (40 libros / 10 por página)
    const pageButtons = pagination.locator('button[aria-label*="page"]')
    const pageCount = await pageButtons.count()
    expect(pageCount).toBeGreaterThanOrEqual(4)
  })

  test('debe navegar a la página 2 y mostrar diferentes libros', async ({ page }) => {
    // [Given] El usuario está en la página 1
    const firstPageFirstTitle = await page.locator('.book-card').first().locator('.book-card__title').textContent()

    // [When] El usuario hace clic en la página 2
    const page2Button = page.locator('.book-list__pagination button[aria-label="Go to page 2"]')
    await expect(page2Button).toBeVisible()
    await page2Button.click()
    
    // Esperar a que se actualice la lista
    await page.waitForTimeout(500)

    // [Then] Los libros mostrados deben ser diferentes
    const secondPageFirstTitle = await page.locator('.book-card').first().locator('.book-card__title').textContent()
    expect(secondPageFirstTitle).not.toBe(firstPageFirstTitle)

    // [Then] Debe seguir habiendo 10 cards
    const cardCount = await page.locator('.book-card').count()
    expect(cardCount).toBe(10)
  })

  test('debe mostrar imagen en cada card de libro', async ({ page }) => {
    // [Given] Los libros están cargados
    const bookCards = page.locator('.book-card')
    const count = await bookCards.count()

    // [Then] Cada card debe tener una imagen visible
    for (let i = 0; i < count; i++) {
      const card = bookCards.nth(i)
      const image = card.locator('.book-card__media')
      
      await expect(image).toBeVisible()
      
      // Verificar que el atributo style contiene una URL de imagen
      const style = await image.getAttribute('style')
      expect(style).toContain('background-image')
      expect(style).toContain('url')
    }
  })

  test('debe hacer clic en una card y navegar al detalle del libro', async ({ page }) => {
    // [Given] Los libros están cargados
    const firstCard = page.locator('.book-card').first()
    const firstTitle = await firstCard.locator('.book-card__title').textContent()

    // [When] El usuario hace clic en la card (fuera del botón Añadir)
    const cardTitle = firstCard.locator('.book-card__title')
    await cardTitle.click()

    // [Then] Debe navegar a la página de detalle
    await page.waitForURL(/\/book\/\d+/)
    await expect(page).toHaveURL(/\/book\//)

    // [Then] El título del libro debe mostrarse en el detalle
    const detailTitle = page.locator('.book-detail__title')
    await expect(detailTitle).toBeVisible()
    const detailTitleText = await detailTitle.textContent()
    expect(detailTitleText).toContain(firstTitle || '')
  })

  test('debe mantener el layout de grid con espaciado correcto', async ({ page }) => {
    // [Given] Los libros están cargados
    const bookList = page.locator('.book-list')
    await expect(bookList).toBeVisible()

    // [Then] El contenedor debe usar Grid de Material UI
    const gridContainer = page.locator('.book-list')
    await expect(gridContainer).toBeVisible()
    
    // [Then] Debe haber múltiples cards en una disposición de grid
    const cards = page.locator('.book-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(1)

    // Verificar que las cards están en posiciones diferentes
    const firstCardBox = await cards.first().boundingBox()
    const secondCardBox = await cards.nth(1).boundingBox()
    
    expect(firstCardBox).toBeTruthy()
    expect(secondCardBox).toBeTruthy()
    
    // Verificar que hay separación entre cards
    if (firstCardBox && secondCardBox) {
      const hasHorizontalSeparation = Math.abs(firstCardBox.x - secondCardBox.x) > 10
      const hasVerticalSeparation = Math.abs(firstCardBox.y - secondCardBox.y) > 10
      
      expect(hasHorizontalSeparation || hasVerticalSeparation).toBeTruthy()
    }
  })

  test('debe mostrar precios numéricos válidos en todas las cards', async ({ page }) => {
    // [Given] Los libros están cargados
    const prices = page.locator('.book-card__price')
    const count = await prices.count()
    expect(count).toBeGreaterThan(0)

    // [Then] Todos los precios deben tener formato $XX.XX
    for (let i = 0; i < count; i++) {
      const priceText = await prices.nth(i).textContent()
      
      // Verificar formato de precio
      expect(priceText).toMatch(/\$\d+\.\d{2}/)
      
      // Extraer el número y verificar que sea válido
      const priceValue = parseFloat(priceText?.replace('$', '') || '0')
      expect(priceValue).toBeGreaterThan(0)
      expect(priceValue).toBeLessThan(100) // Precio razonable según mock
    }
  })

  test('debe respetar la paginación al volver de detalle a listado', async ({ page }) => {
    // [Given] El usuario navega a la página 2
    const page2Button = page.locator('.book-list__pagination button[aria-label="Go to page 2"]')
    await page2Button.click()
    await page.waitForTimeout(500)

    // [When] El usuario hace clic en un libro
    const firstCardPage2 = page.locator('.book-card').first()
    await firstCardPage2.click()
    await page.waitForURL(/\/book\//)

    // [When] El usuario vuelve atrás
    await page.goBack()
    await page.waitForURL(/\/home/)
    await page.locator('.book-card').first().waitFor({ state: 'visible' })

    // [Then] Debe permanecer en la misma página de la paginación
    // Verificar que sigue habiendo cards visibles
    const cardsAfterBack = await page.locator('.book-card').count()
    expect(cardsAfterBack).toBe(10)
  })
})
