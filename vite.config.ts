import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * URL de base de l'API FeeXPay.
 *
 * L'API v1 (api.feexpay.me) renvoie 502 sur toutes les routes et n'est plus
 * maintenue. L'API de production est en v2. Le SDK React (@feexpay/react-sdk)
 * code son URL en dur dans le bundle, sans possibilité de la configurer :
 * on la réécrit donc au build, ci-dessous.
 */
const FEEXPAY_API_BASE = 'https://api-v2.feexpay.me/api'

/**
 * Réécrit les appels de l'API FeeXPay dans le bundle du SDK.
 *
 * Le SDK est compilé et minifié ; ses URLs sont des chaînes littérales qu'on
 * ne peut pas configurer. On agit donc sur le code généré, avant minification,
 * en interceptant le module ES du SDK. C'est réversible (la liste ci-dessous)
 * et évite de patcher node_modules.
 *
 * Deux corrections, testées contre l'API v2 :
 *
 * 1. L'hôte. L'API v1 (api.feexpay.me) est hors service : elle renvoie 502
 *    sans header CORS, ce que le navigateur rapporte comme une erreur CORS.
 *
 * 2. Le chemin de suivi de transaction. Le SDK interroge
 *    /transactions/getrequesttopay/integration/{ref}, route qui n'existe pas
 *    en v2 (404). Le SDK boucle sur ce 404 jusqu'au timeout, puis affiche
 *    « la vérification du paiement a échoué » — y compris pour un paiement
 *    qui a, lui, bien abouti. On pointe vers /transactions/public/single/
 *    status/{ref}, qui existe et renvoie les mêmes champs (status, reason).
 *
 * Le filtre porte sur `@feexpay` et non sur `@feexpay/react-sdk` : en dev,
 * Vite pré-compile la dépendance dans node_modules/.vite/deps/ sous le nom
 * `@feexpay_react-sdk.js` (tiret bas au lieu du slash), que le filtre exact
 * ne catchait pas. D'où l'erreur CORS persistante en développement.
 */
function feexpayApiHostRewrite() {
  const REPLACEMENTS: [string, string][] = [
    ['https://api.feexpay.me/api/transactions/getrequesttopay/integration/', 'https://api-v2.feexpay.me/api/transactions/public/single/status/'],
    ['https://api.feexpay.me', 'https://api-v2.feexpay.me'],
  ]

  /**
   * Le SDK n'envoie pas sur cet appel (il fait `fetch(url)` tout sec). On
   * fait donc deux substitutions dans le SDK :
   *
   *   1. la signature de la fonction de polling gagne un paramètre `token` ;
   *   2. son `fetch` porte le header Bearer, et l'appel lui passe le token
   *      du contexte FeeXPay (disponible dans la portée, sous `f`).
   *
   * Sans cela, chaque polling renvoie 401, le SDK réessaie 12 fois, puis
   * affiche « la vérification du paiement a échoué » — y compris pour un
   * paiement qui a bien abouti.
   *
   * Ces motifs visent le chemin d'origine, avant la réécriture d'hôte : leur
   * application ne dépend donc pas de l'ordre des remplacements.
   */
  const POLL_FETCH_OLD = 'const e = await fetch(l);\n    if (!e.ok)\n      throw new Error("Status check failed");'
  const POLL_FETCH_NEW =
    'const e = await fetch(l, { headers: { Authorization: `Bearer ${token}` } });\n    if (!e.ok)\n      throw new Error("Status check failed");'

  const POLL_ARGS_OLD = 'Ge = async (r) => {'
  const POLL_ARGS_NEW = 'Ge = async (r, token) => {'

  const POLL_CALL_OLD = 'const m = await Ge(r);'
  const POLL_CALL_NEW = 'const m = await Ge(r, f.token);'

  return {
    name: 'feexpay-api-host-rewrite',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      // Ne cible que le SDK (node_modules), jamais les sources du projet :
      // '@feexpay' suffit à faire la différence.
      if (!id.includes('@feexpay')) return null

      let out = code

      // Suivi de transaction : chemin + authentification.
      out = out.split(POLL_ARGS_OLD).join(POLL_ARGS_NEW)
      out = out.split(POLL_FETCH_OLD).join(POLL_FETCH_NEW)
      out = out.split(POLL_CALL_OLD).join(POLL_CALL_NEW)

      // Hôte et chemin de l'API, une fois le polling déjà réécrit.
      for (const [from, to] of REPLACEMENTS) {
        out = out.split(from).join(to)
      }

      return out === code ? null : { code: out, map: null }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react(), feexpayApiHostRewrite()],
  define: {
    __FEEXPAY_API_BASE__: JSON.stringify(FEEXPAY_API_BASE),
  },
  base: '/', // Use absolute paths for all modes
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Optimize for shared hosting
    rollupOptions: {
      output: {
        // Ensure consistent file names
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
    host: 'localhost'
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
    // Le SDK FeeXPay est volontairement exclu du pré-bundling : on veut que le
    // plugin de réécriture s'applique au fichier ES d'origine
    // (node_modules/@feexpay/react-sdk/dist/index.es.js). Pré-compilé, il
    // deviendrait @feexpay_react-sdk.js et la réécriture dépendrait du cache
    // d'optimisation, plus fragile à invalidater.
    exclude: ['@feexpay/react-sdk'],
  }
}))