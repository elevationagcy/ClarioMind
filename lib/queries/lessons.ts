import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Lesson, UserProgress } from '@/types'

// Query keys for cache management
export const lessonKeys = {
  all: ['lessons'] as const,
  list: () => [...lessonKeys.all, 'list'] as const,
  detail: (id: string) => [...lessonKeys.all, 'detail', id] as const,
  progress: (userId: string) => ['progress', userId] as const,
}

// Fetch all lessons
export function useLessons() {
  return useQuery({
    queryKey: lessonKeys.list(),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('order')

      if (error) throw error
      return data as Lesson[]
    },
  })
}

// Fetch single lesson
export function useLesson(id: string) {
  return useQuery({
    queryKey: lessonKeys.detail(id),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Lesson
    },
    enabled: !!id,
  })
}

// Fetch user progress (lesson-specific completions)
export function useUserProgress() {
  return useQuery({
    queryKey: ['user-progress'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .not('lesson_id', 'is', null) // Only get lesson-specific progress

      if (error) throw error
      return data as UserProgress[]
    },
  })
}

// Fetch global progress (streak and current day)
export function useGlobalProgress() {
  return useQuery({
    queryKey: ['global-progress'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .is('lesson_id', null) // Only get global progress row
        .single()

      if (error) throw error
      return data as UserProgress
    },
  })
}

// Prefetch lessons for better UX
export function usePrefetchLessons() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: lessonKeys.list(),
      queryFn: async () => {
        const supabase = createClient()
        const { data } = await supabase
          .from('lessons')
          .select('*')
          .order('order')
        return data
      },
    })
  }
}

