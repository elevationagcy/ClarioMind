import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Lesson } from '@/types'

// Fetch mindfulness tools (exercise category with meditation/mindfulness content)
export function useMindfulnessTools() {
  return useQuery({
    queryKey: ['tools', 'mindfulness'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('category', 'exercise')
        .or('title.ilike.%meditation%,title.ilike.%mindful%')
        .order('order')

      if (error) throw error
      return data as Lesson[]
    },
  })
}

// Fetch coping tools (exercise category excluding meditation, plus reflection tools)
export function useCopingTools() {
  return useQuery({
    queryKey: ['tools', 'coping'],
    queryFn: async () => {
      const supabase = createClient()
      
      // Get exercise tools that are coping skills (exclude meditation)
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('lessons')
        .select('*')
        .eq('category', 'exercise')
        .not('title', 'ilike', '%meditation%')
        .not('title', 'ilike', '%mindful%')
        .order('order')

      if (exerciseError) throw exerciseError

      // Get reflection tools
      const { data: reflectionData, error: reflectionError } = await supabase
        .from('lessons')
        .select('*')
        .eq('category', 'reflection')
        .order('order')

      if (reflectionError) throw reflectionError

      // Combine both
      return [...(exerciseData || []), ...(reflectionData || [])] as Lesson[]
    },
  })
}

