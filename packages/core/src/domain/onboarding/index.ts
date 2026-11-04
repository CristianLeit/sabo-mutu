import type {
  OnboardingAnswer,
  OnboardingAnswerValue,
  OnboardingFlow,
  OnboardingJsonValue,
  OnboardingSession,
  OnboardingStep,
  SessionStatus,
  UnknownAnswer,
} from '../../types/onboarding'

export interface CreateOnboardingSessionOptions {
  id: string
  flow: OnboardingFlow
  now?: string
}

const isUnknownAnswer = (value: unknown): value is UnknownAnswer =>
  typeof value === 'object' && value !== null && (value as { kind?: unknown }).kind === 'unknown'

const isJsonValue = (value: unknown): value is OnboardingJsonValue => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (Array.isArray(value)) return value.every(isJsonValue)
  if (typeof value !== 'object') return false
  return Object.values(value as Record<string, unknown>).every(isJsonValue)
}

const isAnswerValue = (value: unknown): value is OnboardingAnswerValue =>
  isUnknownAnswer(value) || isJsonValue(value)

const equalValues = (left: OnboardingAnswerValue, right: OnboardingAnswerValue): boolean =>
  JSON.stringify(left) === JSON.stringify(right)

function assertValidFlow(flow: OnboardingFlow): void {
  if (!flow || typeof flow.id !== 'string' || !['DIRECTED', 'EXPLORATORY'].includes(flow.type) || !Array.isArray(flow.steps)) {
    throw new TypeError('Invalid onboarding flow')
  }
  const stepIds = new Set<string>()
  const questionIds = new Set<string>()
  for (const step of flow.steps) {
    if (!step || typeof step.id !== 'string' || !step.id || stepIds.has(step.id) || !Array.isArray(step.questions)) {
      throw new TypeError(`Invalid or duplicate step: ${step?.id}`)
    }
    stepIds.add(step.id)
    for (const question of step.questions) {
      if (!question || typeof question.id !== 'string' || !question.id || questionIds.has(question.id)
        || typeof question.prompt !== 'string'
        || !['text', 'number', 'boolean', 'single_choice', 'multiple_choice', 'custom'].includes(question.answerType)
        || question.options?.some((option) => !isJsonValue(option))) {
        throw new TypeError(`Invalid or duplicate question: ${question?.id}`)
      }
      questionIds.add(question.id)
    }
  }
  if (!stepIds.has(flow.startStepId)) throw new TypeError('Flow start step does not exist')
  for (const step of flow.steps) {
    if (step.nextStepId && !stepIds.has(step.nextStepId)) throw new TypeError(`Unknown next step: ${step.nextStepId}`)
    for (const transition of step.transitions ?? []) {
      if (!stepIds.has(transition.targetStepId)) throw new TypeError(`Unknown transition target: ${transition.targetStepId}`)
      if (!questionIds.has(transition.questionId) || !isAnswerValue(transition.equals)) {
        throw new TypeError(`Invalid transition on step: ${step.id}`)
      }
    }
  }
}

const findStep = (flow: OnboardingFlow, stepId: string): OnboardingStep | undefined =>
  flow.steps.find((step) => step.id === stepId)

function nextStepId(session: OnboardingSession, step: OnboardingStep): string | null {
  for (const transition of step.transitions ?? []) {
    const answer = session.answers[transition.questionId]
    if (answer && equalValues(answer.value, transition.equals)) return transition.targetStepId
  }
  return step.nextStepId ?? null
}

/** Rebuilds the reachable path after answer edits, dropping stale downstream data. */
function reconcilePath(session: OnboardingSession): OnboardingSession {
  if (session.flow.type === 'EXPLORATORY') {
    if (session.currentStepId !== null && !findStep(session.flow, session.currentStepId)) {
      throw new Error(`Unknown current step: ${session.currentStepId}`)
    }
    const validCompletedIds = session.completedStepIds.filter((id, index, ids) =>
      findStep(session.flow, id) !== undefined && id !== session.currentStepId && ids.indexOf(id) === index,
    )
    const status: SessionStatus = session.currentStepId === null
      ? (session.status === 'ABANDONED' ? 'ABANDONED' : 'COMPLETED')
      : (session.status === 'ABANDONED' ? 'ABANDONED' : 'IN_PROGRESS')
    return { ...session, completedStepIds: validCompletedIds, status }
  }

  const reachable: string[] = []
  const seen = new Set<string>()
  let stepId: string | null = session.flow.startStepId
  while (stepId && !seen.has(stepId)) {
    const step = findStep(session.flow, stepId)
    if (!step) break
    seen.add(stepId)
    reachable.push(stepId)
    stepId = nextStepId(session, step)
  }

  const visited = new Set([...session.completedStepIds, session.currentStepId].filter((id): id is string => id !== null))
  const completedStepIds = reachable.filter((id) => visited.has(id) && id !== session.currentStepId)
  const currentStepId = reachable.find((id) => !completedStepIds.includes(id)) ?? null
  const reachableQuestionIds = new Set(
    reachable.filter((id) => completedStepIds.includes(id) || id === currentStepId)
      .flatMap((id) => findStep(session.flow, id)?.questions.map((question) => question.id) ?? []),
  )
  const answers = Object.fromEntries(Object.entries(session.answers).filter(([id]) => reachableQuestionIds.has(id)))
  const status: SessionStatus = currentStepId === null
    ? (session.status === 'ABANDONED' ? 'ABANDONED' : 'COMPLETED')
    : (session.status === 'ABANDONED' ? 'ABANDONED' : 'IN_PROGRESS')

  return { ...session, currentStepId, completedStepIds, answers, status }
}

export function createOnboardingSession({ id, flow, now = new Date().toISOString() }: CreateOnboardingSessionOptions): OnboardingSession {
  assertValidFlow(flow)
  return {
    id,
    flow,
    currentStepId: flow.startStepId,
    completedStepIds: [],
    answers: {},
    status: 'IN_PROGRESS',
    createdAt: now,
    updatedAt: now,
  }
}

export function registerOnboardingAnswer(
  session: OnboardingSession,
  answer: OnboardingAnswer,
  now = new Date().toISOString(),
): OnboardingSession {
  if (session.status !== 'IN_PROGRESS' || !session.currentStepId) throw new Error('Session is not accepting answers')
  if (!isAnswerValue(answer.value)) throw new TypeError('Answer must be JSON serializable or explicitly unknown')
  const currentStep = findStep(session.flow, session.currentStepId)!
  const currentQuestionIds = new Set(currentStep.questions.map((question) => question.id))
  const knownQuestionIds = new Set(session.flow.steps.flatMap((step) => step.questions.map((question) => question.id)))
  const isUpdate = Object.hasOwn(session.answers, answer.questionId)
  if (!knownQuestionIds.has(answer.questionId) || (!currentQuestionIds.has(answer.questionId) && !isUpdate)) {
    throw new Error(`Question ${answer.questionId} is not available in this session`)
  }
  const updated = { ...session, answers: { ...session.answers, [answer.questionId]: answer }, updatedAt: now }
  return reconcilePath(updated)
}

/** Advances from the current step, following the first matching conditional transition. */
export function advanceOnboardingSession(session: OnboardingSession, now = new Date().toISOString()): OnboardingSession {
  if (session.status !== 'IN_PROGRESS' || !session.currentStepId) throw new Error('Session cannot be advanced')
  const currentStep = findStep(session.flow, session.currentStepId)
  if (!currentStep) throw new Error('Current step does not exist')
  const unansweredRequired = currentStep.questions.find((question) => question.required && !session.answers[question.id])
  if (unansweredRequired) throw new Error(`Required question ${unansweredRequired.id} has no answer`)
  const targetStepId = nextStepId(session, currentStep)
  if (!targetStepId) {
    return { ...session, currentStepId: null, completedStepIds: [...session.completedStepIds, currentStep.id], status: 'COMPLETED', updatedAt: now }
  }
  if (!findStep(session.flow, targetStepId) || targetStepId === currentStep.id || session.completedStepIds.includes(targetStepId)) {
    throw new Error(`Invalid transition from ${currentStep.id} to ${targetStepId}`)
  }
  const moved = {
    ...session,
    currentStepId: targetStepId,
    completedStepIds: [...session.completedStepIds, currentStep.id],
    updatedAt: now,
  }
  return reconcilePath(moved)
}

/** Exploratory sessions may jump to any defined step; directed sessions follow declared edges only. */
export function navigateOnboardingSession(session: OnboardingSession, targetStepId: string, now = new Date().toISOString()): OnboardingSession {
  if (session.status !== 'IN_PROGRESS' || !session.currentStepId) throw new Error('Session cannot be navigated')
  const current = findStep(session.flow, session.currentStepId)!
  const allowed = session.flow.type === 'EXPLORATORY'
    ? Boolean(findStep(session.flow, targetStepId))
    : nextStepId(session, current) === targetStepId
  if (!allowed || targetStepId === current.id) throw new Error(`Invalid transition from ${current.id} to ${targetStepId}`)
  return reconcilePath({
    ...session,
    currentStepId: targetStepId,
    completedStepIds: [...session.completedStepIds, current.id],
    updatedAt: now,
  })
}

export function setOnboardingSessionStatus(
  session: OnboardingSession,
  status: 'ABANDONED' | 'IN_PROGRESS',
  now = new Date().toISOString(),
): OnboardingSession {
  if (session.status === 'COMPLETED') throw new Error('Completed sessions cannot change status')
  if (status === 'IN_PROGRESS' && session.currentStepId === null) throw new Error('Completed session cannot be resumed')
  return { ...session, status, updatedAt: now }
}

export function serializeOnboardingSession(session: OnboardingSession): string {
  return JSON.stringify(session)
}

export function restoreOnboardingSession(serialized: string): OnboardingSession {
  let data: unknown
  try {
    data = JSON.parse(serialized)
  } catch {
    throw new TypeError('Serialized onboarding session is not valid JSON')
  }
  if (typeof data !== 'object' || data === null) throw new TypeError('Invalid onboarding session')
  const session = data as Partial<OnboardingSession>
  if (typeof session.id !== 'string' || !session.flow || typeof session.currentStepId !== 'string' && session.currentStepId !== null
    || !Array.isArray(session.completedStepIds) || typeof session.answers !== 'object' || session.answers === null
    || !['IN_PROGRESS', 'COMPLETED', 'ABANDONED'].includes(session.status ?? '')
    || typeof session.createdAt !== 'string' || typeof session.updatedAt !== 'string') {
    throw new TypeError('Invalid onboarding session')
  }
  assertValidFlow(session.flow)
  const restored = session as OnboardingSession
  if (!restored.completedStepIds.every((id) => typeof id === 'string')) throw new TypeError('Invalid completed step list')
  for (const [questionId, answer] of Object.entries(restored.answers)) {
    if (!answer || typeof answer !== 'object' || answer.questionId !== questionId || !isAnswerValue(answer.value)) {
      throw new TypeError(`Invalid answer for question ${questionId}`)
    }
  }
  const normalized = reconcilePath(restored)
  if (normalized.currentStepId !== restored.currentStepId || normalized.status !== restored.status
    || JSON.stringify(normalized.completedStepIds) !== JSON.stringify(restored.completedStepIds)
    || JSON.stringify(normalized.answers) !== JSON.stringify(restored.answers)) {
    throw new TypeError('Session state is inconsistent with its answers and flow')
  }
  return normalized
}

