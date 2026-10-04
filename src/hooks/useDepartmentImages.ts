import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface DepartmentImage {
  id: string
  department: string
  country: string
  image_url: string
  whatsapp_link?: string
  title?: string
  description?: string
  created_at: string
  updated_at: string
}

export function useDepartmentImages(pollInterval = 30000) {
  const [departments, setDepartments] = useState<DepartmentImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDepartments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Essayer d'abord department_images
      let { data, error: fetchError } = await supabase
        .from('department_images')
        .select('*')
        .order('created_at', { ascending: true })

      // Si department_images n'existe pas ou est vide, essayer departments
      if (fetchError || !data || data.length === 0) {
        const { data: deptData, error: deptError } = await supabase
          .from('departments')
          .select('*')
          .eq('is_active', true)
          .order('"order"', { ascending: true })

        if (deptError) {
          setDepartments([])
          return
        }

        // Convertir les données de departments vers le format department_images
        data = deptData?.map(dept => ({
          id: dept.id,
          department: dept.slug,
          country: dept.country,
          image_url: dept.image_url || '',
          whatsapp_link: dept.whatsapp_link || '',
          title: dept.name,
          description: dept.description || '',
          created_at: dept.created_at,
          updated_at: dept.updated_at
        })) || []
      }

      setDepartments(data || [])
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du chargement des départements')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDepartments()
    const interval = setInterval(() => loadDepartments(), pollInterval)
    return () => clearInterval(interval)
  }, [loadDepartments, pollInterval])

  useEffect(() => {
    const channel = supabase
      .channel('department-images')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'department_images' 
      }, () => {
        loadDepartments()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [loadDepartments])

  // Fonction pour filtrer les images par département et pays
  const getImagesByDepartmentAndCountry = (department: string, country: string) => {
    return departments.filter(dept => 
      dept.department.toLowerCase() === department.toLowerCase() &&
      dept.country.toLowerCase() === country.toLowerCase()
    )
  }

  return {
    departments,
    loading,
    error,
    reload: loadDepartments,
    getImagesByDepartmentAndCountry
  }
}