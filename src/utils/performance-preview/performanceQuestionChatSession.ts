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

const getPerformanceQuestionChatSessionKey = (entryDate: string) =>
  `performance-question-chat-session:${entryDate}`

export const getPerformanceQuestionChatSession = (
  entryDate: string,
): PerformanceQuestionChatSession | null => {
  const key = getPerformanceQuestionChatSessionKey(entryDate)
  const storedSession = sessionStorage.getItem(key)

  if (!storedSession) {
    return null
  }

  try {
    return JSON.parse(storedSession) as PerformanceQuestionChatSession
  } catch {
    sessionStorage.removeItem(key)
    return null
  }
}

export const setPerformanceQuestionChatSession = (
  entryDate: string,
  session: PerformanceQuestionChatSession,
) => {
  sessionStorage.setItem(getPerformanceQuestionChatSessionKey(entryDate), JSON.stringify(session))
}

export const clearPerformanceQuestionChatSession = (entryDate: string) => {
  sessionStorage.removeItem(getPerformanceQuestionChatSessionKey(entryDate))
}
