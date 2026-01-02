import React from 'react'
import './BookDetail.css'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Paper from '@mui/material/Paper'
import type { Book } from '../../types/book.types'
import { useCart } from '../../hooks/useCart'
import { useState } from 'react'
import AddToCartModal from '../Cart/AddToCartModal/AddToCartModal'

export const BookDetail: React.FC<{ book: Book | null }> = ({ book }) => {
  useCart()
  const [open, setOpen] = useState(false)

  if (!book) return <div className="book-detail">Libro no encontrado</div>

  return (
    <Paper className="cart book-detail" elevation={2}>
      <CardMedia className="book-detail__media" image={book.image} title={book.title} />
      <div className="book-detail__info">
        <Typography variant="h4" className="book-detail__title">{book.title}</Typography>
        <Typography variant="subtitle1" className="book-detail__author">{book.author}</Typography>
        <Typography variant="body1" className="book-detail__desc">{book.description}</Typography>
        <div className="book-detail__buy">
          <Typography variant="h6" className="book-detail__price">${book.price.toFixed(2)}</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>Añadir al carrito</Button>
          <AddToCartModal open={open} book={book} onClose={() => setOpen(false)} />
        </div>
      </div>
    </Paper>
  )
}

export default BookDetail
