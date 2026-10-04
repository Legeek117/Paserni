// Netlify Function - Créer un paiement FeeXPay
// Remplace le serveur Python Render (POST /payments/create)

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const apiKey = process.env.VITE_FEEXPAY_API_KEY;
  const merchantId = process.env.VITE_FEEXPAY_MERCHANT_ID;

  if (!apiKey || !merchantId) {
    return { statusCode: 500, body: JSON.stringify({ error: 'FeexPay config missing' }) };
  }

  const {
    amount,
    currency = 'XOF',
    order_number,
    customer_name,
    customer_phone,
    customer_email,
    return_url,
    callback_url,
  } = body;

  if (!amount || !order_number) {
    return { statusCode: 400, body: JSON.stringify({ error: 'amount et order_number sont requis' }) };
  }

  const payload = {
    merchant_id: merchantId,
    amount,
    currency,
    reference: order_number,
    customer: {
      name: customer_name || '',
      email: customer_email || '',
      phone: customer_phone || '',
    },
    return_url: return_url || 'https://www.espacepaserni.org/paiement/retour',
    callback_url: callback_url || 'https://www.espacepaserni.org/.netlify/functions/feexpay-webhook',
  };

  try {
    const response = await fetch('https://api.feexpay.me/api/transactions/public/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur FeeXPay:', data);
      return { statusCode: 400, body: JSON.stringify({ error: data }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transaction_id: data.transaction_id,
        payment_url: data.payment_url,
      }),
    };
  } catch (err) {
    console.error('Erreur réseau:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erreur réseau vers FeeXPay' }) };
  }
};
