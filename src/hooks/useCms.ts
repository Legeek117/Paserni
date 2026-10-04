import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

type NavItem = { id: string; path: string; label: string; order?: number }
type Department = { id: string; title: string; image?: string; description?: string; route?: string; order?: number }

export function useCms(pollInterval = 30000) {
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      // Utiliser department_images au lieu de departments
      const { data: deptData } = await supabase.from('department_images').select('*').order('created_at', { ascending: true })

      // Pour l'instant, pas de navigation dynamique - on peut l'ajouter plus tard
      setNavItems([])

      if (deptData) {
        // Grouper les départements par nom et prendre le premier de chaque groupe
        const uniqueDepartments = new Map()
        deptData.forEach((row) => {
          const departmentName = String(row.department ?? '')
          if (!uniqueDepartments.has(departmentName)) {
            uniqueDepartments.set(departmentName, {
              id: String(row.department ?? '').toLowerCase().replace(/\s+/g, '-'),
              title: String(row.title ?? row.department ?? ''),
              image: String(row.image_url ?? ''),
              description: String(row.description ?? ''),
              route: '',
              order: 0,
            })
          }
        })
        setDepartments(Array.from(uniqueDepartments.values()))
      }
    } catch (e) {
      } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(() => load(), pollInterval)
    return () => clearInterval(interval)
  }, [load, pollInterval])

  useEffect(() => {
    const deptChannel = supabase.channel('cms-departments').on('postgres_changes', { event: '*', schema: 'public', table: 'department_images' }, () => load()).subscribe()

    return () => {
      try {
        supabase.removeChannel(deptChannel)
      } catch (err) {
        }
    }
  }, [load])

  return { navItems, departments, loading, reload: load }
}

export type { NavItem, Department }
