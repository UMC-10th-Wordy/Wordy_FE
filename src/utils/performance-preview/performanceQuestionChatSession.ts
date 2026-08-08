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

  try {
    const storedSession = sessionStorage.getItem(key)

    if (!storedSession) {
      return null
    }

    return JSON.parse(storedSession) as PerformanceQuestionChatSession
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
  entryDate: string,
  session: PerformanceQuestionChatSession,
) => {
  try {
    sessionStorage.setItem(getPerformanceQuestionChatSessionKey(entryDate), JSON.stringify(session))
  } catch {
    return
  }
}

export const clearPerformanceQuestionChatSession = (entryDate: string) => {
  try {
    sessionStorage.removeItem(getPerformanceQuestionChatSessionKey(entryDate))
  } catch {
    return
  }
}
