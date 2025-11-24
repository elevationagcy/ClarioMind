import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Challenge, Tip } from '@/types'

// Query keys
export const discoverKeys = {
  challenges: ['challenges'] as const,
  tips: ['tips'] as const,
}

// Fetch challenges
export function useChallenges() {
  return useQuery({
    queryKey: discoverKeys.challenges,
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('participants_count', { ascending: false })

      if (error) throw error
      return data as Challenge[]
    },
  })
}

// Fetch tips
export function useTips(limit?: number) {
  return useQuery({
    queryKey: [...discoverKeys.tips, limit],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase.from('tips').select('*')
      
      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Tip[]
    },
  })
}

// Fetch single challenge
export function useChallenge(id: string) {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Challenge
    },
    enabled: !!id,
  })
}

// Fetch single tip
export function useTip(id: string) {
  return useQuery({
    queryKey: ['tip', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Tip
    },
    enabled: !!id,
  })
}

