import { test, expect } from '@playwright/test'

/**
 * Pruebas funcionales de UI – Criterio 2 Actividad 3
 * Componente: SearchBar
 * Objetivo: Validar el comportamiento funcional de la barra de búsqueda
 */
test.describe('Pruebas funcionales de UI – Criterio 2 Actividad 3: SearchBar', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('http://localhost:5173/home')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Esperar a que carguen los libros
    await page.locator('.book-card').first().waitFor({ state: 'visible', timeout: 5000 })
  })

  test('debe mostrar el label correcto "Buscar por título"', async ({ page }) => {
    // [Given] El usuario está en la página de inicio
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.waitFor({ state: 'visible' })

    // [Then] El label debe ser "Buscar por título" (Material UI usa label flotante)
    const label = page.locator('.search-bar__input label')
    await expect(label).toBeVisible()
    await expect(label).toHaveText('Buscar por título')
    
    // [Then] El input debe estar visible y habilitado
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toBeEnabled()
  })

  test('debe filtrar la lista al escribir texto en el buscador', async ({ page }) => {
    // [Given] La página muestra libros inicialmente
    const initialCards = await page.locator('.book-card').count()
    expect(initialCards).toBeGreaterThan(0)

    // [When] El usuario escribe "Sombras" en el buscador
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.fill('Sombras')
    await page.waitForTimeout(500) // Esperar el filtrado

    // [Then] La lista se filtra mostrando solo libros que contienen "Sombras"
    const filteredCards = page.locator('.book-card')
    const filteredCount = await filteredCards.count()
    
    expect(filteredCount).toBeGreaterThan(0)
    expect(filteredCount).toBeLessThanOrEqual(initialCards)

    // [Then] Todos los títulos mostrados contienen "Sombras"
    for (let i = 0; i < filteredCount; i++) {
      const title = await filteredCards.nth(i).locator('.book-card__title').textContent()
      expect(title?.toLowerCase()).toContain('sombras')
    }
  })

  test('debe restaurar todos los libros al borrar el texto de búsqueda', async ({ page }) => {
    // [Given] Se obtiene el número inicial de libros
    const initialCards = await page.locator('.book-card').count()
    expect(initialCards).toBeGreaterThan(0)

    const searchInput = page.locator('.search-bar__input input')

    // [When] El usuario escribe texto en el buscador
    await searchInput.fill('Tiempo')
    await page.waitForTimeout(500)

    // [Then] La lista se filtra
    const filteredCount = await page.locator('.book-card').count()
    expect(filteredCount).toBeLessThanOrEqual(initialCards)

    // [When] El usuario borra el texto de búsqueda
    await searchInput.clear()
    await page.waitForTimeout(500)

    // [Then] La lista debe restaurarse mostrando los libros iniciales
    const restoredCount = await page.locator('.book-card').count()
    expect(restoredCount).toBe(initialCards)
  })

  test('debe mostrar mensaje cuando no hay resultados', async ({ page }) => {
    // [Given] El usuario está en la página de inicio
    const searchInput = page.locator('.search-bar__input input')

    // [When] El usuario busca un término que no existe
    await searchInput.fill('LibroQueNoExisteXYZ123')
    await page.waitForTimeout(500)

    // [Then] No debe haber libros mostrados
    const bookCards = await page.locator('.book-card').count()
    expect(bookCards).toBe(0)

    // [Then] Debe mostrarse el mensaje de "no encontrado"
    const emptyMessage = page.locator('.book-list__empty')
    await expect(emptyMessage).toBeVisible()
    await expect(emptyMessage).toContainText('No se han encontrado libros')
    await expect(emptyMessage).toContainText('LibroQueNoExisteXYZ123')
  })

  test('debe actualizar el valor del input en tiempo real', async ({ page }) => {
    // [Given] El input está vacío inicialmente
    const searchInput = page.locator('.search-bar__input input')
    const initialValue = await searchInput.inputValue()
    expect(initialValue).toBe('')

    // [When] El usuario escribe carácter por carácter
    await searchInput.type('Viento', { delay: 100 })

    // [Then] El valor del input debe reflejar el texto escrito
    const currentValue = await searchInput.inputValue()
    expect(currentValue).toBe('Viento')

    // [Then] La lista debe estar filtrada
    const cards = await page.locator('.book-card').count()
    expect(cards).toBeGreaterThan(0)
  })

  test('debe mantener el foco en el input durante la escritura', async ({ page }) => {
    // [Given] El usuario hace clic en el input
    const searchInput = page.locator('.search-bar__input input')
    await searchInput.click()

    // [Then] El input debe estar enfocado
    await expect(searchInput).toBeFocused()

    // [When] El usuario escribe texto
    await searchInput.type('Jardín')

    // [Then] El input debe mantener el foco
    await expect(searchInput).toBeFocused()
    
    // [Then] El valor escrito debe ser correcto
    const value = await searchInput.inputValue()
    expect(value).toBe('Jardín')
  })
})
