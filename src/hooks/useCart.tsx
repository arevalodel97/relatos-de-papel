import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Book, CartItem } from '../types/book.types'

type CartContextValue = {
  items: CartItem[]
  addItem: (b: Book) => void
  addItemWithQuantity: (b: Book, qty: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clear: () => void
  total: number
}

const STORAGE_KEY = 'rp_cart_v1'

const CartContext = createContext<CartContextValue | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (book: Book) => setItems((prev) => {
    const existing = prev.find((it) => it.id === book.id)
    if (existing) {
      return prev.map((it) => (it.id === book.id ? { ...it, quantity: it.quantity + 1 } : it))
    }
    return [...prev, { ...book, quantity: 1 }]
  })

  const addItemWithQuantity = (book: Book, qty: number) => {
    const q = Math.max(1, Math.floor(qty))
    setItems((prev) => {
      const existing = prev.find((it) => it.id === book.id)
      if (existing) {
        return prev.map((it) => (it.id === book.id ? { ...it, quantity: q } : it))
      }
      return [...prev, { ...book, quantity: q }]
    })
  }

  const removeItem = (id: string) => setItems((p) => p.filter((b) => b.id !== id))

  const updateQuantity = (id: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((p) => p.id !== id)
      return prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    })
  }

  const clear = () => setItems([])

  const total = items.reduce((s, it) => s + it.price * it.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, addItemWithQuantity, removeItem, updateQuantity, clear, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
