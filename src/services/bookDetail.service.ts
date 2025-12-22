import { BOOKS_MOCK } from '../mocks/books.mock'
import type { Book } from '../types/book.types'

export const bookDetailService = {
  getBookById: (id: string): Promise<Book | undefined> =>
    new Promise((resolve) => {
      setTimeout(() => resolve(BOOKS_MOCK.find((b) => b.id === id)), 350)
    }),
}
