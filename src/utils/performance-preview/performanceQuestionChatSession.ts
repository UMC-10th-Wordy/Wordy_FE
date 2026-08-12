import type { PerformanceSupplementAnswer } from '@/types/performance'

export type PerformanceQuestionMessageRole = 'wordy' | 'user'

export interface PerformanceQuestionChatMessage {
  id: number
  role: PerformanceQuestionMessageRole
  content: string
  isQuestion?: boolean
}

export interface PerformanceQuestionChatSession {
  messages: PerformanceQuestionChatMessage[]
  answer: string
  submittedAnswers: PerformanceSupplementAnswer[]
  currentQuestionIndex: number
  latestQuestionMessageId: number | null
  isFinished: boolean
}

const isPerformanceQuestionChatSession = (
  value: unknown,
): value is PerformanceQuestionChatSession => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const session = value as Record<string, unknown>

  return (
    Array.isArray(session.messages) &&
    typeof session.answer === 'string' &&
    Array.isArray(session.submittedAnswers) &&
    typeof session.currentQuestionIndex === 'number' &&
    (typeof session.latestQuestionMessageId === 'number' ||
      session.latestQuestionMessageId === null) &&
    typeof session.isFinished === 'boolean'
  )
}

const getPerformanceQuestionChatSessionKey = (workspaceId: string, entryDate: string) =>
  `performance-question-chat-session:${workspaceId}:${entryDate}`

export const getPerformanceQuestionChatSession = (
  workspaceId: string,
  entryDate: string,
): PerformanceQuestionChatSession | null => {
  if (!workspaceId) {
    return null
  }

  const key = getPerformanceQuestionChatSessionKey(workspaceId, entryDate)

  try {
    const storedSession = sessionStorage.getItem(key)

    if (!storedSession) {
      return null
    }

    const parsedSession: unknown = JSON.parse(storedSession)

    if (!isPerformanceQuestionChatSession(parsedSession)) {
      sessionStorage.removeItem(key)
      return null
    }

    return parsedSession
  } catch {
    try {
      sessionStorage.removeItem(key)
    } catch {
      return null
    }

    return null
  }
}

export const setPerformanceQuestionChatSession = (
  workspaceId: string,
  entryDate: string,
  session: PerformanceQuestionChatSession,
) => {
  if (!workspaceId) {
    return
  }

  try {
    sessionStorage.setItem(
      getPerformanceQuestionChatSessionKey(workspaceId, entryDate),
      JSON.stringify(session),
    )
  } catch {
    return
  }
}

export const clearPerformanceQuestionChatSession = (workspaceId: string, entryDate: string) => {
  if (!workspaceId) {
    return
  }

  try {
    sessionStorage.removeItem(getPerformanceQuestionChatSessionKey(workspaceId, entryDate))
  } catch {
    return
  }
}
