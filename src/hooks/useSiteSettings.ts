import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface SiteSettings {
  id?: string
  site_name: string
  site_description: string
  contact_email: string
  contact_phone: string
  address: string
  city: string
  opening_hours: string
  website_url: string
  created_at?: string
  updated_at?: string
}

export function useSiteSettings(pollInterval = 30000) {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'Espace Paserni',
    site_description: 'Restaurant et galerie d\'art',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    opening_hours: 'Lun-Ven: 8h-18h, Sam: 9h-17h',
    website_url: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (fetchError) throw fetchError

      if (data && data.length > 0) {
        setSettings(data[0])
      }
    } catch (e: any) {
      setError(e?.message || 'Erreur lors du chargement des paramètres')
    } finally {
      setLoading(false)
    }
  }, [])

  const saveSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    try {
      const { data, error: saveError } = await supabase
        .from('site_settings')
        .upsert([{
          ...settings,
          ...newSettings,
          updated_at: new Date().toISOString()
        }])
        .select()

      if (saveError) throw saveError

      if (data && data.length > 0) {
        setSettings(data[0])
      }
      return true
    } catch (e: any) {
      setError(e?.message || 'Erreur lors de la sauvegarde')
      return false
    }
  }, [settings])

  useEffect(() => {
    loadSettings()
    const interval = setInterval(() => loadSettings(), pollInterval)
    return () => clearInterval(interval)
  }, [loadSettings, pollInterval])

  useEffect(() => {
    const channel = supabase
      .channel('site-settings')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'site_settings' 
      }, () => {
        loadSettings()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [loadSettings])

  return {
    settings,
    loading,
    error,
    saveSettings,
    reload: loadSettings
  }
}

