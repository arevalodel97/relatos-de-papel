import React from 'react'
import Cart from '../../components/Cart/Cart'
import './CartView.css'

export const CartView: React.FC = () => {
  return (
    <div className="cart-view view-full">
      <Cart />
    </div>
  )
}

export default CartView
