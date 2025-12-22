import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { bookDetailService } from '../../services/bookDetail.service'
import BookDetail from '../../components/BookDetail/BookDetail'
import type { Book } from '../../types/book.types'
import './BookDetailView.css'

export const BookDetailView: React.FC = () => {
  const { id } = useParams()
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    bookDetailService.getBookById(id).then((b) => {
      if (mounted) setBook(b ?? null)
    })
    return () => {
      mounted = false
    }
  }, [id])

  return (
    <div className="book-detail-view view-full">
      <BookDetail book={book} />
    </div>
  )
}

export default BookDetailView
