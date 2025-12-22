import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import './CheckoutSummary.css'
import { useCart } from '../../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import { submitOrder, type OrderPayload } from '../../services/checkout.service'

export const CheckoutSummary: React.FC = () => {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makePayload = (): OrderPayload => ({
    items: items.map((it) => ({ id: it.id, title: it.title, price: it.price, quantity: it.quantity })),
    total,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    customer: { id: null, name: null },
  })

  const handlePay = async () => {
    setError(null)
    setLoading(true)
    const payload = makePayload()
    try {
      // Call the mock service and expect a successful 200 response for this flow
      console.log('Payload a enviar al backend:', payload)
      const res = await submitOrder(payload, false)
      console.log('Order response:', res)
      // On success show alert with order id and the ids being paid
      alert(`Pedido realizado con éxito. OrderId: ${res.data.orderId}\nIDs pagados: ${payload.items.map(i => i.id).join(', ')}`)
      clear()
      navigate('/home')
    } catch (err: any) {
      console.error('Order failed', err)
      setError(err?.message || 'Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout">
      <Typography variant="h5">Resumen de la compra</Typography>
      {items.length === 0 ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', padding: 24 }}>
            <Typography variant="body1">No hay artículos para pagar — tu carrito está vacío. ¡Añade algún libro y vuelve cuando quieras!</Typography>
          </div>
          <div className="cart__footer cart__footer--center">
            <div>
              <Button variant="contained" color="primary" onClick={() => navigate('/home')}>Explorar libros</Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="checkout__list">
            {items.map((i) => (
              <div className="checkout__item" key={i.id}>
                <span>{i.title} x {i.quantity}</span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="checkout__total">Total: ${total.toFixed(2)}</div>
          {error && <Alert severity="error">{error} — podés reintentar.</Alert>}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button variant="contained" color="primary" onClick={handlePay} disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Pagar'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default CheckoutSummary
