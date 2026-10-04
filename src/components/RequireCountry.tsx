import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useCountry } from '../contexts/CountryContext'

const RequireCountry: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedCountry, isLoading } = useCountry()
  const location = useLocation()

  if (isLoading) return null

  if (!selectedCountry) {
    const redirectTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/?redirectTo=${redirectTo}`} replace />
  }

  return <>{children}</>
}

export default RequireCountry

