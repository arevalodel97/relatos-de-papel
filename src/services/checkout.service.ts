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

export function submitOrder(payload: OrderPayload, simulateError = true, delay = 1200): Promise<ServiceResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        reject({ status: 500, message: 'Error simulado del servidor' })
        return
      }

      resolve({ status: 200, data: { orderId: `ORD-${Date.now()}`, received: payload } })
    }, delay)
  })
}

export type { OrderPayload }
