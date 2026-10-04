export const debugRestaurantEnabled = (): boolean => {
  try {
    if ((import.meta as any)?.env?.VITE_DEBUG_RESTAURANT === '1') return true
  } catch {}
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem('DEBUG_RESTAURANT') === '1'
  } catch {
    return false
  }
}

export const rlog = (...args: any[]) => {
  if (debugRestaurantEnabled()) {
    // eslint-disable-next-line no-console
    }
}

