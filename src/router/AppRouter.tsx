import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingView from '../views/LandingView/LandingView'
import HomeView from '../views/HomeView/HomeView'
import BookDetailView from '../views/BookDetailView/BookDetailView'
import CartView from '../views/CartView/CartView'
import CheckoutView from '../views/CheckoutView/CheckoutView'

interface Props {
  search?: string
}

export const AppRouter: React.FC<Props> = ({ search }) => {
  return (
    <Routes>
      <Route path="/" element={<LandingView />} />
  <Route path="/home" element={<HomeView search={search} />} />
      <Route path="/book/:id" element={<BookDetailView />} />
      <Route path="/cart" element={<CartView />} />
      <Route path="/checkout" element={<CheckoutView />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default AppRouter
