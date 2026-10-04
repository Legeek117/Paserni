import React from 'react'
import { XCircle, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const PaymentCancelled: React.FC = () => {
  const [orderNumber, setOrderNumber] = React.useState<string>('')
  const [transactionId, setTransactionId] = React.useState<string>('')
  
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const order = params.get('order') || params.get('reference') || ''
    const tx = params.get('transaction_id') || ''
    
    setOrderNumber(order)
    setTransactionId(tx)
  }, [])

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white border rounded-xl shadow-sm p-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <XCircle className="w-16 h-16 text-orange-600" />
          </div>
          
          <h1 className="text-2xl font-semibold mb-4 text-orange-600">Paiement annulé</h1>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <p className="text-orange-800 font-medium">Transaction annulée</p>
            </div>
            <p className="text-orange-700 text-sm">
              Vous avez annulé le paiement. Aucun montant n'a été débité de votre compte.
            </p>
          </div>
          
          {orderNumber && (
            <div className="bg-gray-50 border rounded-lg p-3 text-left mb-6">
              <div className="text-xs text-gray-500">Identifiant de commande</div>
              <div className="font-mono text-sm">{orderNumber}</div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-4">
              <p>Vous pouvez réessayer le paiement ou modifier votre commande.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/mes-commandes" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Mes commandes
              </Link>
              
              <button 
                onClick={() => window.history.back()} 
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Besoin d'aide ? Contactez-nous : 
              <a href="mailto:amiragounloye@gmail.com" className="text-orange-600 hover:underline ml-1">
                amiragounloye@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancelled
