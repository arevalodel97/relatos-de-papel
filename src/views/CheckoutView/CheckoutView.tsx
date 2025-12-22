import React from 'react'
import Paper from '@mui/material/Paper'
import CheckoutSummary from '../../components/Checkout/CheckoutSummary'
import './CheckoutView.css'

export const CheckoutView: React.FC = () => {
  return (
    <div className="checkout-view view-full">
      <Paper className="cart" elevation={2}>
        <CheckoutSummary />
      </Paper>
    </div>
  )
}

export default CheckoutView
