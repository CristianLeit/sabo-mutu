/** Values that can be safely persisted as JSON. */
export type OnboardingJsonValue =
  | string
  | number
  | boolean
  | null
  | OnboardingJsonValue[]
  | { [key: string]: OnboardingJsonValue }

export type FlowType = 'DIRECTED' | 'EXPLORATORY'
export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'

/** An explicit response for questions the user cannot or does not want to answer. */
export interface UnknownAnswer {
  kind: 'unknown'
}

export type OnboardingAnswerValue = OnboardingJsonValue | UnknownAnswer

export interface OnboardingAnswer {
  questionId: string
  value: OnboardingAnswerValue
}

export interface OnboardingQuestion {
  id: string
  prompt: string
  answerType: 'text' | 'number' | 'boolean' | 'single_choice' | 'multiple_choice' | 'custom'
  options?: OnboardingJsonValue[]
  required?: boolean
}

export interface OnboardingTransition {
  questionId: string
  /** Matches either a JSON answer value or the explicit unknown answer. */
  equals: OnboardingAnswerValue
  targetStepId: string
}

export interface OnboardingStep {
  id: string
  title?: string
  questions: OnboardingQuestion[]
  transitions?: OnboardingTransition[]
  /** Used when no conditional transition matches. */
  nextStepId?: string
}

export interface OnboardingFlow {
  id: string
  type: FlowType
  startStepId: string
  steps: OnboardingStep[]
}

export interface OnboardingSession {
  id: string
  flow: OnboardingFlow
  currentStepId: string | null
  completedStepIds: string[]
  answers: Record<string, OnboardingAnswer>
  status: SessionStatus
  createdAt: string
  updatedAt: string
}
