/**
 * Normalisation des identifiants de pays.
 *
 * La colonne `country` n'est pas homogène entre les projets Supabase :
 * certains enregistrements stockent des codes ISO ('BJ', 'CI'), d'autres des
 * libellés ('benin', 'cote-ivoire'). Les deux formats coexistent aussi au
 * sein d'un même projet (table orders). On normalise donc des deux côtés afin
 * que les filtres fonctionnent quel que soit le format stocké.
 */

export type CountryId = 'benin' | 'cote-ivoire'

/**
 * Valeurs telles qu'elles peuvent être stockées en base. Sert à construire le
 * filtre PostgREST : les valeurs doivent correspondre à l'écriture réelle,
 * donc on garde la forme d'origine (avec tirets si besoin).
 */
const DB_VALUES: Record<CountryId, string[]> = {
  benin: ['benin', 'BJ'],
  'cote-ivoire': ['cote-ivoire', 'CI'],
}

/**
 * Alias normalisés (minuscules, sans séparateur, sans accent) pour comparer
 * une valeur lue de la base à un identifiant de pays.
 */
const NORMALIZED_ALIASES: Record<CountryId, string[]> = {
  benin: ['benin', 'bj', 'bjbenin'],
  'cote-ivoire': ['cotedivoire', 'coteivoire', 'ci', 'civ', 'ciciv'],
}

/** Minuscules, sans accents ni séparateurs. */
const canonicalize = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '')

/**
 * Traduit une valeur `country` brute vers un identifiant canonique.
 * Renvoie null pour une valeur vide ou inconnue (produit universel).
 */
export const normalizeCountry = (value: unknown): CountryId | null => {
  if (value === null || value === undefined) return null

  const cleaned = canonicalize(String(value))
  if (cleaned === '') return null

  for (const [id, aliases] of Object.entries(NORMALIZED_ALIASES) as [
    CountryId,
    string[]
  ][]) {
    if (aliases.includes(cleaned)) return id
  }

  return null
}

/**
 * Construit le filtre `.or()` d'une requête PostgREST, tolérant aux deux
 * formats de la colonne country.
 *
 * `country.in.(...)` couvre les deux écritures, `country.is.null` et
 * `country.eq.` couvrent les produits universels (pays vide ou NULL).
 */
export const buildCountryOrFilter = (countryId: string): string => {
  const normalized = normalizeCountry(countryId)

  if (!normalized) {
    // Pays inconnu : ne montrer que les universels plutôt que tout afficher.
    return 'country.is.null,country.eq.'
  }

  const values = DB_VALUES[normalized]
  return `country.in.(${values.join(',')}),country.is.null,country.eq.`
}

/**
 * Filtre côté client, pour des résultats déjà récupérés.
 * Un produit sans pays est visible pour tous.
 */
export const matchesCountry = (
  itemCountry: unknown,
  currentCountryId: string
): boolean => {
  const item = normalizeCountry(itemCountry)
  if (item === null) return true // universel
  return item === normalizeCountry(currentCountryId)
}