// Netlify Function - Vérifier le statut d'un paiement FeeXPay
// Remplace le serveur Python Render (GET /payments/status/:transaction_id)

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // L'ID de transaction est passé en query param : ?transaction_id=xxx
  const transactionId = event.queryStringParameters?.transaction_id;

  if (!transactionId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'transaction_id est requis' }) };
  }

  const apiKey = process.env.VITE_FEEXPAY_API_KEY;

  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'FeexPay config missing' }) };
  }

  try {
    const response = await fetch(
      `https://api.feexpay.me/api/transactions/public/single/status/${transactionId}`,
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur FeeXPay status:', data);
      return { statusCode: 400, body: JSON.stringify({ error: data }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('Erreur réseau:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erreur réseau vers FeeXPay' }) };
  }
};
