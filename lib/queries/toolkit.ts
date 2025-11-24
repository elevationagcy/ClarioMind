import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Lesson } from '@/types'

// Fetch mindfulness tools
export function useMindfulnessTools() {
  return useQuery({
    queryKey: ['tools', 'mindfulness'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .or('category.eq.Mindfulness,category.eq.Mental Health')
        .order('order')

      if (error) throw error
      return data as Lesson[]
    },
  })
}

// Fetch coping tools
export function useCopingTools() {
  return useQuery({
    queryKey: ['tools', 'coping'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('category', 'Coping Skills')
        .order('order')

      if (error) throw error
      return data as Lesson[]
    },
  })
}

