// Quiz questions and scoring logic for ClarioMind dependency assessment

export interface QuizQuestion {
  id: string
  question: string
  options: {
    text: string
    value: number
  }[]
  category: 'frequency' | 'impact' | 'control' | 'dependency'
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'gender',
    question: 'What is your gender?',
    options: [
      { text: 'Male', value: 0 },
      { text: 'Female', value: 0 },
      { text: 'Other', value: 0 },
      { text: 'Prefer not to say', value: 0 }
    ],
    category: 'frequency'
  },
  {
    id: 'age',
    question: 'What is your age range?',
    options: [
      { text: '18-24', value: 0 },
      { text: '25-34', value: 0 },
      { text: '35-44', value: 0 },
      { text: '45-54', value: 0 },
      { text: '55+', value: 0 }
    ],
    category: 'frequency'
  },
  {
    id: 'frequency',
    question: 'How often do you have a drink containing alcohol?',
    options: [
      { text: 'Never', value: 0 },
      { text: 'Monthly or less', value: 1 },
      { text: '2-4 times a month', value: 2 },
      { text: '2-3 times a week', value: 3 },
      { text: '4 or more times a week', value: 4 }
    ],
    category: 'frequency'
  },
  {
    id: 'quantity',
    question: 'How many drinks do you have on a typical day when you are drinking?',
    options: [
      { text: '1-2', value: 0 },
      { text: '3-4', value: 1 },
      { text: '5-6', value: 2 },
      { text: '7-9', value: 3 },
      { text: '10 or more', value: 4 }
    ],
    category: 'frequency'
  },
  {
    id: 'binge',
    question: 'How often do you have 6 or more drinks on one occasion?',
    options: [
      { text: 'Never', value: 0 },
      { text: 'Less than monthly', value: 1 },
      { text: 'Monthly', value: 2 },
      { text: 'Weekly', value: 3 },
      { text: 'Daily or almost daily', value: 4 }
    ],
    category: 'frequency'
  },
  {
    id: 'stop_difficulty',
    question: 'How often have you found it difficult to stop drinking once you started?',
    options: [
      { text: 'Never', value: 0 },
      { text: 'Less than monthly', value: 1 },
      { text: 'Monthly', value: 2 },
      { text: 'Weekly', value: 3 },
      { text: 'Daily or almost daily', value: 4 }
    ],
    category: 'control'
  },
  {
    id: 'failed_expectations',
    question: 'How often have you failed to do what was expected of you because of drinking?',
    options: [
      { text: 'Never', value: 0 },
      { text: 'Less than monthly', value: 1 },
      { text: 'Monthly', value: 2 },
      { text: 'Weekly', value: 3 },
      { text: 'Daily or almost daily', value: 4 }
    ],
    category: 'impact'
  },
  {
    id: 'morning_drink',
    question: 'How often have you needed a drink in the morning to get yourself going?',
    options: [
      { text: 'Never', value: 0 },
      { text: 'Less than monthly', value: 1 },
      { text: 'Monthly', value: 2 },
      { text: 'Weekly', value: 3 },
      { text: 'Daily or almost daily', value: 4 }
    ],
    category: 'dependency'
  },
  {
    id: 'guilt',
    question: 'How often have you felt guilt or remorse after drinking?',
    options: [
      { text: 'Never', value: 0 },
      { text: 'Less than monthly', value: 1 },
      { text: 'Monthly', value: 2 },
      { text: 'Weekly', value: 3 },
      { text: 'Daily or almost daily', value: 4 }
    ],
    category: 'impact'
  },
  {
    id: 'memory_loss',
    question: 'How often have you been unable to remember what happened the night before because of drinking?',
    options: [
      { text: 'Never', value: 0 },
      { text: 'Less than monthly', value: 1 },
      { text: 'Monthly', value: 2 },
      { text: 'Weekly', value: 3 },
      { text: 'Daily or almost daily', value: 4 }
    ],
    category: 'impact'
  },
  {
    id: 'stress_drinking',
    question: 'Do you drink to cope with stress, anxiety, or difficult emotions?',
    options: [
      { text: 'Never', value: 0 },
      { text: 'Rarely', value: 1 },
      { text: 'Sometimes', value: 2 },
      { text: 'Often', value: 3 },
      { text: 'Always', value: 4 }
    ],
    category: 'dependency'
  },
  {
    id: 'concern',
    question: 'Has a relative, friend, or doctor been concerned about your drinking or suggested you cut down?',
    options: [
      { text: 'No', value: 0 },
      { text: 'Yes, but not in the past year', value: 2 },
      { text: 'Yes, during the past year', value: 4 }
    ],
    category: 'impact'
  }
]

export interface QuizResult {
  totalScore: number
  maxScore: number
  percentage: number
  level: 'low' | 'moderate' | 'elevated' | 'high'
  title: string
  description: string
  recommendation: string
}

export function calculateQuizResult(answers: Record<string, number>): QuizResult {
  // Filter out demographic questions (gender, age) from scoring
  const scoringQuestions = quizQuestions.filter(q => !['gender', 'age'].includes(q.id))
  
  let totalScore = 0
  const maxScore = scoringQuestions.length * 4 // Max 4 points per question
  
  scoringQuestions.forEach(q => {
    if (answers[q.id] !== undefined) {
      totalScore += answers[q.id]
    }
  })
  
  const percentage = Math.round((totalScore / maxScore) * 100)
  
  let level: QuizResult['level']
  let title: string
  let description: string
  let recommendation: string
  
  if (percentage <= 20) {
    level = 'low'
    title = 'Low Risk'
    description = 'Your responses suggest a low level of alcohol-related concerns. However, if you\'re here, there may be patterns you want to explore or change.'
    recommendation = 'ClarioMind can help you maintain healthy habits and build awareness around your relationship with alcohol.'
  } else if (percentage <= 40) {
    level = 'moderate'
    title = 'Moderate Risk'
    description = 'Your responses indicate some patterns that could benefit from attention. You may be experiencing subtle signs of dependency that professionals often overlook.'
    recommendation = 'ClarioMind\'s neuroscience-based approach can help you understand and address these patterns before they escalate.'
  } else if (percentage <= 65) {
    level = 'elevated'
    title = 'Elevated Risk'
    description = 'Your responses suggest elevated alcohol-related concerns. You\'re likely experiencing patterns that affect your daily life and work, even if others don\'t notice.'
    recommendation = 'ClarioMind is specifically designed for high-functioning individuals like you. Our program can help you regain control.'
  } else {
    level = 'high'
    title = 'High Risk'
    description = 'Your responses indicate significant alcohol-related patterns that deserve attention. Many successful professionals experience similar challenges.'
    recommendation = 'ClarioMind offers the discreet, science-backed support you need. Consider also speaking with a healthcare professional.'
  }
  
  return {
    totalScore,
    maxScore,
    percentage,
    level,
    title,
    description,
    recommendation
  }
}









