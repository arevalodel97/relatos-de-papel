import React from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import './CartItem.css'
import type { CartItem as CI } from '../../../types/book.types'

interface Props {
  book: CI
  onRemove: (id: string) => void
  onChangeQty: (id: string, qty: number) => void
}

export const CartItem: React.FC<Props> = ({ book, onRemove, onChangeQty }) => {
  return (
    <div className="cart-item">
      <div className="cart-item__meta">
        <Typography variant="subtitle1" className="cart-item__title">{book.title}</Typography>
        <Typography variant="body2" className="cart-item__author">{book.author}</Typography>
      </div>
      <div className="cart-item__controls">
        <div className="cart-item__qty">
          <Button size="small" onClick={() => onChangeQty(book.id, book.quantity - 1)}>-</Button>
          <span className="cart-item__qty-value">{book.quantity}</span>
          <Button size="small" onClick={() => onChangeQty(book.id, book.quantity + 1)}>+</Button>
        </div>
        <Typography variant="subtitle2" className="cart-item__price">${(book.price * book.quantity).toFixed(2)}</Typography>
        <Button size="small" color="secondary" onClick={() => onRemove(book.id)}>Eliminar</Button>
      </div>
    </div>
  )
}

export default CartItem
