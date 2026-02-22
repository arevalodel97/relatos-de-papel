import type { Book, BookFilters, Facets } from '../types/book.types'

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL as string

export interface SearchResult {
  books: Book[]
  total: number
  totalPages: number
  currentPage: number
  facets: Facets | null
}

export const bookSearchService = {
  /**
   * Search books via API Gateway with optional filters.
   * @param query   search query string (title)
   * @param page    1-based page number
   * @param pageSize items per page
   * @param filters optional active filters
   */
  searchBooks: async (
    query: string,
    page: number,
    pageSize: number,
    filters: BookFilters = {},
  ): Promise<SearchResult> => {
    const queryParams: Record<string, string> = {
      path: '/books',
      page: String(Math.max(0, page - 1)),
      size: String(pageSize),
    }

    if (query) queryParams.title = query
    if (filters.category) queryParams.category = filters.category
    if (filters.rating) queryParams.rating = filters.rating
    if (filters.minPrice) queryParams.minPrice = filters.minPrice
    if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice
    if (filters.inStock) queryParams.inStock = filters.inStock

    const body = { method: 'GET', queryParams }

    const response = await fetch(`${GATEWAY_URL}/api/gateway`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Gateway error: ${response.status}`)
    }

    const data = await response.json()

    const books: Book[] = (data.books ?? []).map((b: any): Book => ({
      id: String(b.id),
      title: b.title,
      author: b.author,
      price: b.price,
      description: b.description,
      photo: b.photo,
      isbn: b.isbn,
      pages: b.pages,
      category: b.category,
      stock: b.stock,
      rating: b.rating,
      visible: b.visible,
      publication_date: b.publication_date,
    }))

    return {
      books,
      total: data.totalElements ?? 0,
      totalPages: data.totalPages ?? 1,
      currentPage: data.currentPage ?? 0,
      facets: data.facets ?? null,
    }
  },
}
