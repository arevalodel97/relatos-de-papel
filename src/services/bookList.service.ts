import { BOOKS_MOCK } from '../mocks/books.mock'
import type { Book } from '../types/book.types'

export const bookListService = {
  getBooks: (): Promise<Book[]> =>
    new Promise((resolve) => {
      setTimeout(() => resolve(BOOKS_MOCK.slice()), 450)
    }),

  getBooksPaginated: (
    page: number,
    pageSize: number,
  ): Promise<{ books: Book[]; total: number; totalPages: number }> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const total = BOOKS_MOCK.length
        const totalPages = Math.max(1, Math.ceil(total / pageSize))
        const start = (Math.max(1, page) - 1) * pageSize
        const books = BOOKS_MOCK.slice(start, start + pageSize)
        resolve({ books, total, totalPages })
      }, 400)
    }),
}
