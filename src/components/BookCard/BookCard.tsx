import React from 'react'
import './BookCard.css'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import type { Book } from '../../types/book.types'
import AddToCartModal from '../Cart/AddToCartModal'
import { useState } from 'react'

interface Props {
  book: Book
  onClick?: (id: string) => void
}

export const BookCard: React.FC<Props> = ({ book, onClick }) => {
  const [open, setOpen] = useState(false)
  return (
    <Card className="book-card" onClick={() => onClick && onClick(book.id)}>
      <CardMedia className="book-card__media" image={book.image} title={book.title} />
      <CardContent className="book-card__content">
        <Typography variant="h6" className="book-card__title">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="book-card__author">
          {book.author}
        </Typography>
        <div className="book-card__footer">
          <Typography variant="subtitle1" className="book-card__price">${book.price.toFixed(2)}</Typography>
          <>
            <Button
              variant="contained"
              size="small"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation()
                // open modal to choose quantity; if parent provided onAdd, still open modal
                setOpen(true)
              }}
            >
              Añadir
            </Button>
            <AddToCartModal open={open} book={book} onClose={() => setOpen(false)} />
          </>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookCard
