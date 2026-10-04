-- Script SQL pour mettre à jour la table orders avec les colonnes manquantes pour FeexPay

-- Ajouter les colonnes manquantes à la table orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';

-- Créer un index sur payment_reference pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id);

-- Mettre à jour les commandes existantes avec des valeurs par défaut
UPDATE orders 
SET payment_provider = 'feexpay', 
    payment_status = 'pending' 
WHERE payment_provider IS NULL;

-- Ajouter des commentaires pour la documentation
COMMENT ON COLUMN orders.payment_provider IS 'Fournisseur de paiement utilisé (feexpay, stripe, etc.)';
COMMENT ON COLUMN orders.transaction_id IS 'ID de transaction du fournisseur de paiement';
COMMENT ON COLUMN orders.payment_reference IS 'Référence de paiement unique';
COMMENT ON COLUMN orders.payment_status IS 'Statut du paiement (pending, completed, failed, cancelled)';

-- Vérifier la structure de la table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
