import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import './CheckoutSummary.css'
import { useCart } from '../../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import { submitPayment, type CustomerInfo } from '../../services/checkout.service'
import CheckoutModal from './CheckoutModal/CheckoutModal'

export const CheckoutSummary: React.FC = () => {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()

  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenModal = () => {
    setError(null)
    setModalOpen(true)
  }

  const handleConfirm = async (customer: CustomerInfo) => {
    setError(null)
    setLoading(true)
    try {
      const payload = {
        customer,
        items: items.map((it) => ({ bookId: Number(it.id), quantity: it.quantity })),
      }
      const res = await submitPayment(payload)
      setModalOpen(false)
      clear()
      alert(`Pedido realizado con éxito.${res?.data?.orderId ? `\nOrderId: ${res.data.orderId}` : ''}`)
      navigate('/home')
    } catch (err: any) {
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
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleOpenModal}>
              Pagar
            </Button>
          </div>
        </>
      )}

      <CheckoutModal
        open={modalOpen}
        loading={loading}
        error={error}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

export default CheckoutSummary
