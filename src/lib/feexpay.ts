// Client FeeXPay minimal.
//
// L'API de production est en v2 (api-v2.feexpay.me). L'ancienne URL
// (api.feexpay.me) est hors service et renvoie 502 sur toutes les routes.
// La constante est centralisée dans vite.config.ts (FEEXPAY_API_BASE) et
// injectée via define, pour rester alignée avec le SDK React qui code
// son URL en dur dans le bundle.

const API_BASE = __FEEXPAY_API_BASE__

// Configuration FeeXPay depuis les variables d'environnement.
// Aucun fallback en dur : ces valeurs sont exposées côté navigateur.
const env = import.meta.env ?? {}

const FEEXPAY_API_KEY = env.VITE_FEEXPAY_API_KEY ?? ''
const FEEXPAY_MERCHANT_ID = env.VITE_FEEXPAY_MERCHANT_ID ?? ''
const FEEXPAY_CALLBACK_URL = env.VITE_FEEXPAY_CALLBACK_URL ?? ''

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
  if (!FEEXPAY_API_KEY || !FEEXPAY_MERCHANT_ID) {
    throw new Error(
      'FeexPay config missing: VITE_FEEXPAY_API_KEY / VITE_FEEXPAY_MERCHANT_ID'
    )
  }

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
  return { transaction_id: data.transaction_id, payment_url: data.payment_url }
}

export async function getTransactionStatus(transactionId: string): Promise<string> {
  if (!FEEXPAY_API_KEY) {
    throw new Error('FeexPay config missing: VITE_FEEXPAY_API_KEY')
  }

  const res = await fetch(`${API_BASE}/transactions/public/single/status/${transactionId}`, {
    headers: { 'Authorization': `Bearer ${FEEXPAY_API_KEY}` },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`FeexPay status failed: ${text}`)
  }
  const data = await res.json()
  return data.status
}