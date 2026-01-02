import React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../../hooks/searchContext'
import './Cart.css'
import '../Checkout/CheckoutSummary.css'
import { useCart } from '../../hooks/useCart'
import CartItem from './CartItem/CartItem'

export const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clear, total } = useCart()
  const navigate = useNavigate()
  const { setSearch } = useSearch()

  if (items.length === 0) {
    return (
      <Paper className="cart" elevation={2}>
        <div className="cart__header">
          <Typography variant="h6">Tu carrito</Typography>
        </div>
        <div className="cart__list">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', padding: 24 }}>
            <Typography variant="body1">Tu carrito está vacío — encuentra tu próxima lectura.</Typography>
          </div>
        </div>
        <div className="cart__footer cart__footer--center">
          <div>
            <Button variant="contained" color="primary" onClick={() => navigate('/home')}>Explorar libros</Button>
          </div>
        </div>
      </Paper>
    )
  }

  return (
    <Paper className="cart" elevation={2}>
      <div className="cart__header">
        <Typography variant="h6">Tu carrito</Typography>
      </div>
      <div className="cart__list">
        {items.map((b) => (
          <CartItem key={b.id} book={b} onRemove={removeItem} onChangeQty={updateQuantity} />
        ))}
      </div>
      {items.length > 0 && (
        <div className="cart__footer">
          <Typography variant="subtitle1">Total: ${total.toFixed(2)}</Typography>
          <div>
            <Button size="small" onClick={() => clear()}>Vaciar</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSearch('')
                  navigate('/checkout')
                }}
              >
                Ir a pagar
              </Button>
          </div>
        </div>
      )}
    </Paper>
  )
}

export default Cart
