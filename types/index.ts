// User Profile Types
export type SexType = 'female' | 'male' | 'prefer_not_to_say'
export type EnvironmentType = 'country' | 'suburbs' | 'major_city'

export interface UserProfile {
  id: string
  user_id: string
  sex: SexType | null
  age: number | null
  relationship_status: string | null
  environment: EnvironmentType | null
  referral_source: string | null
  completed_onboarding: boolean
  created_at: string
  updated_at: string
}

// User Goals Types
export type AlcoholGoalType = 'quit' | 'cut_back' | 'stay_sober' | 'not_sure'
export type RegretFrequencyType = 'always' | 'often' | 'somewhat_often' | 'never'

export interface UserGoals {
  id: string
  user_id: string
  tried_quit_before: boolean | null
  reasons: string[] | null
  alcohol_relationship_goal: AlcoholGoalType | null
  regret_frequency: RegretFrequencyType | null
  created_at: string
}

// Drinking Patterns Types
export type InterferenceFrequencyType = 'always' | 'often' | 'sometimes'
export type DrinkIntentionFrequencyType = 'often' | 'sometimes' | 'never'

export interface DrinkingPatterns {
  id: string
  user_id: string
  drinks_per_week: number | null
  spend_per_week: number | null
  alcohol_types: string[] | null
  drinking_times: string[] | null
  drinking_reasons: string[] | null
  interference_frequency: InterferenceFrequencyType | null
  drink_more_than_intended: DrinkIntentionFrequencyType | null
  created_at: string
}

// Lesson Types
export interface Lesson {
  id: string
  title: string
  description: string | null
  content: string | null
  duration_minutes: number | null
  icon: string | null
  order: number
  category: string | null
  created_at: string
  meditation_audio_url?: string | null
  is_meditation?: boolean
}

// User Progress Types
export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string | null
  completed: boolean
  completed_at: string | null
  current_day: number
  current_streak: number
  longest_streak: number
}

// Quiz Types
export interface Quiz {
  id: string
  lesson_id: string
  question: string
  options: string[]
  correct_answer: number
  order: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  content: string
  icon: string | null
  duration_days: number
  participants_count: number
  category: string
  created_at: string
}

export interface Tip {
  id: string
  title: string
  content: string
  coach_name: string
  icon: string | null
  category: string
  duration_minutes: number
  created_at: string
}

// Onboarding Form Data Types
export interface OnboardingDemographics {
  sex: SexType
  age: number
  relationship_status: string
  environment: EnvironmentType
  referral_source: string
}

export interface OnboardingGoals {
  tried_quit_before: boolean
  reasons: string[]
  alcohol_relationship_goal: AlcoholGoalType
  regret_frequency: RegretFrequencyType
}

export interface OnboardingPatterns {
  drinks_per_week: number
  spend_per_week: number
  alcohol_types: string[]
  drinking_times: string[]
  drinking_reasons: string[]
  interference_frequency: InterferenceFrequencyType
  drink_more_than_intended: DrinkIntentionFrequencyType
}

