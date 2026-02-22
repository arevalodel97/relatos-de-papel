const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL as string

export interface CustomerInfo {
  name: string
  email: string
  address: string
}

export interface PaymentItem {
  bookId: number
  quantity: number
}

export interface PaymentPayload {
  customer: CustomerInfo
  items: PaymentItem[]
}

export interface PaymentResponse {
  data?: any
  message?: string
}

export async function submitPayment(payload: PaymentPayload): Promise<PaymentResponse> {
  const body = {
    method: 'POST',
    queryParams: {
      path: '/payments/purchases',
    },
    body: payload,
  }

  const response = await fetch(`${GATEWAY_URL}/api/gateway`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.message || `Error ${response.status} al procesar el pago`)
  }

  return response.json()
}
