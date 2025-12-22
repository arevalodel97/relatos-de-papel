// Note: we reference CartItem shape in payload; not importing to avoid unused symbol lint.

type OrderPayload = {
  items: Array<{
    id: string
    title: string
    price: number
    quantity: number
  }>
  total: number
  currency: string
  createdAt: string
  customer?: { id?: string | null; name?: string | null }
}

type ServiceResponse = {
  status: number
  data?: any
  message?: string
}

// Simulate a checkout API. If simulateError is true it rejects with a 500 after delay.
export function submitOrder(payload: OrderPayload, simulateError = true, delay = 1200): Promise<ServiceResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        reject({ status: 500, message: 'Error simulado del servidor' })
        return
      }

      // Simulate a successful response with an order id
      resolve({ status: 200, data: { orderId: `ORD-${Date.now()}`, received: payload } })
    }, delay)
  })
}

export type { OrderPayload }
