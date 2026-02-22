import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import type { Book, BookFilters, Facets } from '../../types/book.types'
import BookCard from '../BookCard/BookCard'
import FilterPanel from '../FilterPanel/FilterPanel'
import './BookList.css'
import { useNavigate } from 'react-router-dom'
import { bookSearchService } from '../../services/bookSearch.service'

const PAGE_SIZE = 10

export const BookList: React.FC<{ filter: string }> = ({ filter }) => {
  const [books, setBooks] = useState<Book[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [facets, setFacets] = useState<Facets | null>(null)
  const [filters, setFilters] = useState<BookFilters>({})
  const navigate = useNavigate()

  // Reset page and filters when search query changes
  useEffect(() => {
    setPage(1)
    setFilters({})
  }, [filter])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [filters])

  useEffect(() => {
    let mounted = true

    bookSearchService.searchBooks(filter, page, PAGE_SIZE, filters).then((res) => {
      if (!mounted) return
      setBooks(res.books)
      setTotal(res.total)
      setTotalPages(Math.max(1, res.totalPages))
      if (res.facets) setFacets(res.facets)
      if (page > res.totalPages) setPage(Math.max(1, res.totalPages))
    })

    return () => { mounted = false }
  }, [filter, page, filters])

  const handleFiltersChange = (newFilters: BookFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="book-list__wrap">
      <FilterPanel facets={facets} filters={filters} onChange={handleFiltersChange} />

      <Grid container spacing={2} className="book-list">
        {books.map((b) => (
          <Grid item key={b.id}>
            <BookCard book={b} onClick={(id) => navigate(`/book/${id}`)} />
          </Grid>
        ))}
      </Grid>

      {books.length === 0 && (
        <div className="book-list__empty">
          <Typography variant="body1" color="text.secondary">
            No se han encontrado libros{filter.trim() ? ` con el título "${filter}"` : ''}.
          </Typography>
        </div>
      )}

      {total > 0 && (
        <div className="book-list__pagination">
          <Typography variant="caption" color="text.secondary" className="book-list__count">
            {total} libro{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
          </Typography>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, p) => setPage(p)}
              color="primary"
            />
          )}
        </div>
      )}
    </div>
  )
}

export default BookList
