import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface Department {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  country: string
  whatsapp_link: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export const useDepartments = (country?: string) => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mapSelectedCountryToCode = (c: string) => (c === 'benin' ? 'BJ' : c === 'cote-ivoire' ? 'CI' : '')

  const loadDepartments = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('departments')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true })

      if (country) {
        query = query.eq('country', mapSelectedCountryToCode(country))
      }

      const { data, error } = await query

      if (error) {
        // Si la table n'existe pas encore, retourner un tableau vide
        if (error.code === 'PGRST116' || error.message.includes('relation "departments" does not exist')) {
          setDepartments([])
          return
        }
        throw error
      }

      setDepartments(data || [])
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du chargement des départements')
    } finally {
      setLoading(false)
    }
  }, [country])

  useEffect(() => {
    loadDepartments()
  }, [loadDepartments])

  // Écouter les changements en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('departments-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'departments' 
        }, 
        () => {
          loadDepartments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadDepartments])

  const getDepartmentBySlug = useCallback((slug: string) => {
    return departments.find(dept => dept.slug === slug)
  }, [departments])

  const getDepartmentsByCountry = useCallback((countryCode: string) => {
    return departments.filter(dept => dept.country === countryCode)
  }, [departments])

  return {
    departments,
    loading,
    error,
    loadDepartments,
    getDepartmentBySlug,
    getDepartmentsByCountry
  }
}
