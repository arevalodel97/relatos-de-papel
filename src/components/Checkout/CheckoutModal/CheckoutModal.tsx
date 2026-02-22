import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import './CheckoutModal.css'
import type { CustomerInfo } from '../../../services/checkout.service'

interface Props {
  open: boolean
  loading: boolean
  error: string | null
  onClose: () => void
  onConfirm: (customer: CustomerInfo) => void
}

interface FormErrors {
  name?: string
  email?: string
  address?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const CheckoutModal: React.FC<Props> = ({ open, loading, error, onClose, onConfirm }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!name.trim()) e.name = 'El nombre es obligatorio'
    else if (name.trim().length < 3) e.name = 'El nombre debe tener al menos 3 caracteres'

    if (!email.trim()) e.email = 'El email es obligatorio'
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Ingresa un email válido'

    if (!address.trim()) e.address = 'La dirección es obligatoria'
    else if (address.trim().length < 5) e.address = 'La dirección debe tener al menos 5 caracteres'

    return e
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validate())
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'name') setName(value)
    if (field === 'email') setEmail(value)
    if (field === 'address') setAddress(value)
    if (touched[field]) setErrors(validate())
  }

  const handleSubmit = () => {
    setTouched({ name: true, email: true, address: true })
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    onConfirm({
      name: name.trim(),
      email: email.trim(),
      address: address.trim(),
    })
  }

  const handleClose = () => {
    if (loading) return
    setName('')
    setEmail('')
    setAddress('')
    setErrors({})
    setTouched({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Datos de envío</DialogTitle>
      <DialogContent className="checkout-modal__content">
        {error && (
          <Alert severity="error" className="checkout-modal__error">
            {error}
          </Alert>
        )}
        <TextField
          label="Nombre completo"
          fullWidth
          size="small"
          value={name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={!!errors.name}
          helperText={errors.name}
          disabled={loading}
          autoFocus
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          size="small"
          value={email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={!!errors.email}
          helperText={errors.email}
          disabled={loading}
        />
        <TextField
          label="Dirección de envío"
          fullWidth
          size="small"
          value={address}
          onChange={(e) => handleChange('address', e.target.value)}
          onBlur={() => handleBlur('address')}
          error={!!errors.address}
          helperText={errors.address}
          disabled={loading}
          placeholder="Ej: Calle Mayor 1, Madrid"
        />
      </DialogContent>
      <DialogActions className="checkout-modal__actions">
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar pago'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CheckoutModal
