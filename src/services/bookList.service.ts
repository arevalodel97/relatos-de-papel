import type { Book } from '../types/book.types'
import { bookSearchService } from './bookSearch.service'

export const bookListService = {
  getBooks: (): Promise<Book[]> =>
    bookSearchService.searchBooks('', 1, 10).then((res) => res.books),

  getBooksPaginated: (
    page: number,
    pageSize: number,
  ): Promise<{ books: Book[]; total: number; totalPages: number }> =>
    bookSearchService.searchBooks('', page, pageSize),
}
