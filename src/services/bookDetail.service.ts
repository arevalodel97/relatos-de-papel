import type { Book } from '../types/book.types'

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL as string

export const bookDetailService = {
  getBookById: async (id: string): Promise<Book | undefined> => {
    const body = {
      method: 'GET',
      queryParams: {
        path: `/books/${id}`,
      },
    }

    const response = await fetch(`${GATEWAY_URL}/api/gateway`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (response.status === 404) return undefined
    if (!response.ok) throw new Error(`Gateway error: ${response.status}`)

    const b = await response.json()
    return {
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
    }
  },
}
