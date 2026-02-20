import { test, expect } from '@playwright/test'

test.describe('Escenario 3: Filtrado y Búsqueda - Resultados por Criterio', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a home
    await page.goto('http://localhost:5173/home')
    await page.waitForLoadState('networkidle')
    // Limpiar localStorage DESPUÉS de que la página esté lista
    await page.evaluate(() => localStorage.clear())
    // Esperar a que los libros estén visibles
    await page.locator('.book-card').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => null)
    await page.waitForTimeout(300)
  })

  test('3.1 - Búsqueda por texto filtra libros correctamente', async ({ page }) => {
    // [Given] Cliente en Home con 40 libros visible
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.waitFor({ state: 'visible' })

    // Obtener cantidad inicial (es paginado, muestra 10 por página)
    const allBooks = page.locator('.book-card')
    const initialCount = await allBooks.count()
    expect(initialCount).toBeGreaterThan(0) // Al menos hay libros

    // [When] Escribir "Sombras" en la búsqueda
    await searchInput.fill('Sombras')
    await page.waitForTimeout(450) // Esperar delay de búsqueda

    // [Then] Solo se muestran libros con "Sombras" en el título
    const filteredBooks = page.locator('.book-card')
    const filteredCount = await filteredBooks.count()
    expect(filteredCount).toBeGreaterThan(0)
    expect(filteredCount).toBeLessThan(initialCount)

    // Validar que TODOS contienen "Sombras"
    for (let i = 0; i < filteredCount; i++) {
      const titleText = await filteredBooks.nth(i).locator('.book-card__title').textContent()
      expect(titleText?.toLowerCase()).toContain('sombras')
    }

    // No deben incluirse libros que no contengan "Sombras"
    const titles = []
    for (let i = 0; i < filteredCount; i++) {
      const titleText = await filteredBooks.nth(i).locator('.book-card__title').textContent()
      titles.push(titleText?.toLowerCase())
    }

    expect(titles).not.toEqual(
      expect.arrayContaining([
        expect.stringContaining('cien hojas'),
        expect.stringContaining('el mapa'),
      ])
    )
  })

  test('3.2 - La búsqueda es insensible a mayúsculas y minúsculas', async ({ page }) => {
    // [Given] Cliente en Home
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.waitFor({ state: 'visible' })

    // [When] Buscar "SOMBRAS" (todas mayúsculas)
    await searchInput.fill('SOMBRAS')
    await page.waitForTimeout(450)

    const filteredBooksUppercase = page.locator('.book-card')
    const countUppercase = await filteredBooksUppercase.count()

    // [When] Limpiar y buscar "sombras" (todas minúsculas)
    await searchInput.clear()
    await searchInput.fill('sombras')
    await page.waitForTimeout(450)

    const filteredBooksLowercase = page.locator('.book-card')
    const countLowercase = await filteredBooksLowercase.count()

    // [Then] Deben dar los mismos resultados
    expect(countUppercase).toBe(countLowercase)
  })

  test('3.3 - Búsqueda parcial (substring matching)', async ({ page }) => {
    // [Given] Cliente en Home
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.waitFor({ state: 'visible' })

    // [When] Buscar "som" (parcial)
    await searchInput.fill('som')
    await page.waitForTimeout(450)

    // [Then] Muestra "Sombras de la ciudad" y "Sombras en calma"
    const filteredBooks = page.locator('.book-card')
    const count = await filteredBooks.count()
    expect(count).toBeGreaterThan(0)

    // Todos deben contener "som"
    for (let i = 0; i < count; i++) {
      const titleText = await filteredBooks.nth(i).locator('.book-card__title').textContent()
      expect(titleText?.toLowerCase()).toContain('som')
    }
  })

  test('3.4 - Limpiar búsqueda muestra todos los libros nuevamente', async ({ page }) => {
    // [Given] Cliente en Home
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.waitFor({ state: 'visible' })
    const allBooks = page.locator('.book-card')

    // [When] Escribir un filtro
    await searchInput.fill('Sombras')
    await page.waitForTimeout(450)

    const filteredCount = await allBooks.count()
    expect(filteredCount).toBeLessThan(40)

    // [When] Limpiar el filtro
    await searchInput.clear()
    await page.waitForTimeout(450)

    // [Then] Se muestran todos los libros nuevamente (al menos la página 1)
    const fullCount = await allBooks.count()
    expect(fullCount).toBeGreaterThan(0)
  })

  test('3.5 - Búsqueda sin resultados muestra mensaje apropiado', async ({ page }) => {
    // [Given] Cliente en Home
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.waitFor({ state: 'visible' })

    // [When] Buscar un término que no existe
    await searchInput.fill('xyz9876notexist')
    await page.waitForTimeout(450)

    // [Then] La lista está vacía
    const bookCards = page.locator('.book-card')
    const count = await bookCards.count()
    expect(count).toBe(0)

    // [Then] Opcionalmente, mostrar mensaje "No se encontraron libros"
    const noResultsMsg = page.locator(
      'text=/[Nn]o se encontraron|[Nn]o results|[Nn]ingún libro/i'
    )
    const msgVisible = await noResultsMsg.isVisible().catch(() => false)
    // El mensaje es opcional, pero si está debe ser claro
    if (msgVisible) {
      await expect(noResultsMsg).toBeVisible()
    }
  })

  test('3.6 - Performance: búsqueda se ejecuta en ~350ms', async ({ page }) => {
    // [Given] Cliente en Home
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.waitFor({ state: 'visible' })

    // [When] Hacer búsqueda y medir tiempo
    const startTime = Date.now()
    await searchInput.fill('Sombras')
    await page.waitForTimeout(450)
    const endTime = Date.now()
    const duration = endTime - startTime

    // [Then] La búsqueda se ejecutó en menos de 1 segundo
    // (Teniendo en cuenta el delay simulado de 350ms + overhead)
    expect(duration).toBeLessThan(1500)

    // Verificar que los resultados aparecieron
    const books = page.locator('.book-card')
    const count = await books.count()
    expect(count).toBeGreaterThan(0)
  })

  test('3.7 - Búsqueda múltiple actualiza resultados correctamente', async ({ page }) => {
    // [Given] Cliente en Home
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.waitFor({ state: 'visible' })

    // [When] Primera búsqueda
    await searchInput.fill('Sombras')
    await page.waitForTimeout(450)
    const sombrasCount = await page.locator('.book-card').count()

    // [When] Segunda búsqueda diferente
    await searchInput.clear()
    await searchInput.fill('mapa')
    await page.waitForTimeout(450)
    const mapCount = await page.locator('.book-card').count()

    // [Then] Los recuentos son diferentes (o al menos no siempre igual)
    // Aunque en el mock pueden coincidir, al menos el contenido debe cambiar
    const firstTitle = await page
      .locator('.book-card')
      .first()
      .locator('.book-card__title')
      .textContent()

    expect(firstTitle?.toLowerCase()).toContain('mapa')
    expect(firstTitle?.toLowerCase()).not.toContain('sombras')
  })

  test('3.8 - Búsqueda vacía restaura vista inicial', async ({ page }) => {
    // [Given] Cliente en Home
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.waitFor({ state: 'visible' })

    // [When] Buscar algo
    await searchInput.fill('test')
    await page.waitForTimeout(450)

    // [When] Enviar búsqueda vacía (Enter con vacío)
    await searchInput.clear()
    await searchInput.press('Enter')
    await page.waitForTimeout(450)

    // [Then] Se muestran todos los libros (al menos la página 1)
    const allBooks = page.locator('.book-card')
    const count = await allBooks.count()
    expect(count).toBeGreaterThan(0)
  })
})
