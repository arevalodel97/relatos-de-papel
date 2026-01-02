import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import type { Book } from '../../types/book.types'
import BookCard from '../BookCard/BookCard'
import './BookList.css'
import { useNavigate } from 'react-router-dom'
import { bookSearchService } from '../../services/bookSearch.service'

const PAGE_SIZE = 10

export const BookList: React.FC<{ filter: string }> = ({ filter }) => {
  const [books, setBooks] = useState<Book[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    
    bookSearchService.searchBooks(filter, page, PAGE_SIZE).then((res) => {
      if (!mounted) return
      setBooks(res.books)
      setTotal(res.total)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tp = res.totalPages
      
      
      if (page > tp) setPage(tp)
    })

    return () => {
      mounted = false
    }
  }, [filter, page])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="book-list__wrap">
      <Grid container spacing={2} className="book-list">
        {books.map((b) => (
          <Grid item key={b.id}>
            <BookCard book={b} onClick={(id) => navigate(`/book/${id}`)} />
          </Grid>
        ))}
      </Grid>

      {books.length === 0 && filter.trim() !== '' && (
        <div className="book-list__empty">
          <Typography variant="body1" color="text.secondary">
            No se han encontrado libros con el título "{filter}".
          </Typography>
        </div>
      )}

      {totalPages > 1 && (
        <div className="book-list__pagination">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
          />
        </div>
      )}
    </div>
  )
}

export default BookList
