import { BOOKS_MOCK } from '../mocks/books.mock'
import type { Book } from '../types/book.types'

export const bookSearchService = {
  /**
   * Search books by title (case-insensitive) and return paginated results.
   * @param query search query string
   * @param page 1-based page number
   * @param pageSize items per page
   */
  searchBooks: (
    query: string,
    page: number,
    pageSize: number,
  ): Promise<{ books: Book[]; total: number; totalPages: number }> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const q = (query || '').trim().toLowerCase()
        const filtered = q
          ? BOOKS_MOCK.filter((b) => b.title.toLowerCase().includes(q))
          : BOOKS_MOCK.slice()

        const total = filtered.length
        const totalPages = Math.max(1, Math.ceil(total / pageSize))
        const start = (Math.max(1, page) - 1) * pageSize
        const books = filtered.slice(start, start + pageSize)

        resolve({ books, total, totalPages })
      }, 350)
    }),
}
