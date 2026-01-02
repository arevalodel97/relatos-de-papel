import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import './AddToCartModal.css'
import type { Book } from '../../../types/book.types'
import { useCart } from '../../../hooks/useCart'

interface Props {
  open: boolean
  book: Book | null
  onClose: () => void
}

export const AddToCartModal: React.FC<Props> = ({ open, book, onClose }) => {
  const { items, addItemWithQuantity } = useCart()
  const [qty, setQty] = useState<number>(1)

  useEffect(() => {
    if (!book) return
    const existing = items.find((it) => it.id === book.id)
    setQty(existing ? existing.quantity : 1)
  }, [book, items])

  const handleAdd = () => {
    if (!book) return
    const q = Math.max(1, Math.floor(qty))
    addItemWithQuantity(book, q)
    onClose()
  }

  const handleDialogClose = (event?: {}) => {
    if (event && typeof (event as React.SyntheticEvent).stopPropagation === 'function') {
      ;(event as React.SyntheticEvent).stopPropagation()
    }
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      aria-label="Añadir al carrito"
      PaperProps={{
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
      }}
      BackdropProps={{
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
      }}
    >
      <DialogTitle>Añadir al carrito</DialogTitle>
      <DialogContent>
        {book && (
          <div className="add-modal__body">
            <img src={book.image} alt={book.title} className="add-modal__img" />
            <div className="add-modal__info">
              <Typography variant="h6">{book.title}</Typography>
              <Typography variant="body2" color="text.secondary">{book.author}</Typography>
              <Typography variant="body1" className="add-modal__price">${book.price.toFixed(2)}</Typography>
              <TextField
                label="Cantidad"
                type="number"
                inputProps={{ min: 1 }}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => handleDialogClose(e as unknown as {})}>Cancelar</Button>
        <Button variant="contained" onClick={handleAdd}>Añadir</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddToCartModal
