// Minimal FeexPay client (adjust endpoints/fields per official docs if needed)

const API_BASE = 'https://api.feexpay.me/api'

// Configuration FeeXPay depuis les variables d'environnement avec fallback
const FEEXPAY_API_KEY = (import.meta as any).env?.VITE_FEEXPAY_API_KEY || 'fp_Mzpfp9SkSsuxi5bLkenKykkVrQNpsGxYmim3yc51nDE3VIgHoEAIDoEtrX3r5FYa'
const FEEXPAY_MERCHANT_ID = (import.meta as any).env?.VITE_FEEXPAY_MERCHANT_ID || '681535f823d328ae65ff37d4'
const FEEXPAY_CALLBACK_URL = (import.meta as any).env?.VITE_FEEXPAY_CALLBACK_URL || 'https://weebhookpaserni.onrender.com'

// Configuration FeeXPay avec fallbacks

export interface FeexCustomer {
  name?: string
  email?: string
  phone?: string
}

export interface FeexCreateResponse {
  transaction_id: string
  payment_url: string
}

export async function createTransaction(params: {
  amount: number
  currency: string
  orderNumber: string
  customer: FeexCustomer
  returnUrl: string
  callbackUrl?: string
}): Promise<FeexCreateResponse> {
  const body = {
    merchant_id: FEEXPAY_MERCHANT_ID,
    amount: params.amount,
    currency: params.currency,
    reference: params.orderNumber,
    customer: {
      name: params.customer.name,
      email: params.customer.email,
      phone: params.customer.phone,
    },
    return_url: params.returnUrl,
    callback_url: params.callbackUrl || FEEXPAY_CALLBACK_URL,
  }

  const res = await fetch(`${API_BASE}/transactions/public/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FEEXPAY_API_KEY}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`FeexPay create failed: ${text}`)
  }
  const data = await res.json()
  // Expecting { transaction_id, payment_url }
  return { transaction_id: data.transaction_id, payment_url: data.payment_url }
}

export async function getTransactionStatus(transactionId: string): Promise<'PENDING'|'SUCCESSFUL'|'FAILED'|string> {
  const res = await fetch(`${API_BASE}/transactions/public/single/status/${transactionId}`, {
    headers: { 'Authorization': `Bearer ${FEEXPAY_API_KEY}` }
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`FeexPay status failed: ${text}`)
  }
  const data = await res.json()
  // Expecting { status: 'PENDING'|'SUCCESSFUL'|'FAILED', ... }
  return data.status
}