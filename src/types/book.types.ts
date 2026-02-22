export interface Book {
  id: string
  title: string
  author: string
  price: number
  description: string
  photo: string
  isbn?: string
  pages?: number
  category?: string
  stock?: number
  rating?: number
  visible?: boolean
  publication_date?: string
}

export interface CartItem extends Book {
  quantity: number
}

export interface FacetEntry {
  key: string
  count: number
}

export interface Facets {
  categories: FacetEntry[]
  ratings: FacetEntry[]
  priceRange: { min: number; max: number }
  booksWithStock: number
}

export interface BookFilters {
  category?: string
  rating?: string
  minPrice?: string
  maxPrice?: string
  inStock?: string
}
