import { describe, expect, it } from 'vitest'
import {
  advanceOnboardingSession,
  createOnboardingSession,
  navigateOnboardingSession,
  registerOnboardingAnswer,
  restoreOnboardingSession,
  serializeOnboardingSession,
} from './index'
import type { OnboardingFlow } from '../../types/onboarding'

const directedFlow: OnboardingFlow = {
  id: 'directed-v1',
  type: 'DIRECTED',
  startStepId: 'intro',
  steps: [
    { id: 'intro', questions: [{ id: 'goal', prompt: 'What is your goal?', answerType: 'text' }], nextStepId: 'profile' },
    {
      id: 'profile',
      questions: [{ id: 'role', prompt: 'What is your role?', answerType: 'single_choice', options: ['professional', 'company'] }],
      transitions: [
        { questionId: 'role', equals: 'company', targetStepId: 'company-details' },
        { questionId: 'role', equals: { kind: 'unknown' }, targetStepId: 'explore' },
      ],
      nextStepId: 'explore',
    },
    { id: 'company-details', questions: [{ id: 'team', prompt: 'Team size?', answerType: 'number' }] },
    { id: 'explore', questions: [{ id: 'skills', prompt: 'Skills?', answerType: 'multiple_choice' }] },
  ],
}

const exploratoryFlow: OnboardingFlow = {
  id: 'exploratory-v1',
  type: 'EXPLORATORY',
  startStepId: 'welcome',
  steps: [
    { id: 'welcome', questions: [{ id: 'name', prompt: 'Name?', answerType: 'text' }] },
    { id: 'interests', questions: [{ id: 'interest', prompt: 'Interest?', answerType: 'text' }] },
    { id: 'skills', questions: [{ id: 'known-skills', prompt: 'Skills?', answerType: 'multiple_choice' }] },
  ],
}

const create = (flow = directedFlow) => createOnboardingSession({
  id: 'session-1',
  flow: JSON.parse(JSON.stringify(flow)) as OnboardingFlow,
  now: '2026-01-01T00:00:00.000Z',
})

describe('onboarding domain', () => {
  it('completes a directed onboarding path', () => {
    let session = create()
    session = registerOnboardingAnswer(session, { questionId: 'goal', value: 'career change' })
    session = advanceOnboardingSession(session)
    session = registerOnboardingAnswer(session, { questionId: 'role', value: 'company' })
    session = advanceOnboardingSession(session)
    expect(session.currentStepId).toBe('company-details')
    session = registerOnboardingAnswer(session, { questionId: 'team', value: 12 })
    session = advanceOnboardingSession(session)
    expect(session.status).toBe('COMPLETED')
    expect(session.completedStepIds).toEqual(['intro', 'profile', 'company-details'])
  })

  it('supports free navigation through an exploratory flow', () => {
    let session = create(exploratoryFlow)
    session = navigateOnboardingSession(session, 'skills')
    expect(session.currentStepId).toBe('skills')
    expect(session.completedStepIds).toEqual(['welcome'])
    session = registerOnboardingAnswer(session, { questionId: 'known-skills', value: ['TypeScript'] })
    expect(session.answers['known-skills'].value).toEqual(['TypeScript'])
  })

  it('selects conditional transitions using registered answers', () => {
    let session = advanceOnboardingSession(create())
    session = registerOnboardingAnswer(session, { questionId: 'role', value: 'company' })
    expect(advanceOnboardingSession(session).currentStepId).toBe('company-details')
  })

  it('keeps missing answers distinct from an explicitly unknown response', () => {
    let session = advanceOnboardingSession(create())
    expect(session.answers.role).toBeUndefined()
    expect(advanceOnboardingSession(session).currentStepId).toBe('explore')

    session = registerOnboardingAnswer(session, { questionId: 'role', value: { kind: 'unknown' } })
    expect(session.answers.role.value).toEqual({ kind: 'unknown' })
    expect(advanceOnboardingSession(session).currentStepId).toBe('explore')
  })

  it('updates an earlier answer and recalculates the path', () => {
    let session = advanceOnboardingSession(create())
    session = registerOnboardingAnswer(session, { questionId: 'role', value: 'company' })
    session = advanceOnboardingSession(session)
    session = registerOnboardingAnswer(session, { questionId: 'team', value: 12 })
    session = registerOnboardingAnswer(session, { questionId: 'role', value: 'professional' })
    expect(session.currentStepId).toBe('explore')
    expect(session.answers.team).toBeUndefined()
  })

  it('rejects answers for questions outside the current step and undeclared directed transitions', () => {
    expect(() => registerOnboardingAnswer(create(), { questionId: 'role', value: 'company' })).toThrow(/not available/)
    expect(() => navigateOnboardingSession(create(), 'company-details')).toThrow(/Invalid transition/)
  })

  it('rejects transitions to an unknown target even if the flow is mutated after session creation', () => {
    const session = create()
    session.flow.steps[0].nextStepId = 'missing-step'
    expect(() => advanceOnboardingSession(session)).toThrow(/Invalid transition/)
  })

  it('serializes and restores session data', () => {
    let session = advanceOnboardingSession(create())
    session = registerOnboardingAnswer(session, { questionId: 'role', value: { kind: 'unknown' } })
    const restored = restoreOnboardingSession(serializeOnboardingSession(session))
    expect(restored).toEqual(session)
  })

  it('rejects a restored session whose current step conflicts with its answers', () => {
    const session = advanceOnboardingSession(create())
    const inconsistent = { ...session, currentStepId: 'company-details' }
    expect(() => restoreOnboardingSession(JSON.stringify(inconsistent))).toThrow(/inconsistent/)
  })
})
