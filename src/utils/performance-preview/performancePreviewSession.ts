import type { PerformancePreviewStatus } from '@/components/performance-preview/PerformancePreviewPanel'
import type {
  CreatePerformancePreviewPayload,
  PerformancePreviewQuestionRequiredResult,
} from '@/types/performance'
import type { Task } from '@/types/todo'

export interface PerformanceQuestionContext {
  reflectionSnapshotId: string
  originalRequest: CreatePerformancePreviewPayload
  questions: PerformancePreviewQuestionRequiredResult['supplementQuestions']
}

export interface PerformancePreviewSession {
  status: PerformancePreviewStatus
  reflectionSnapshotId: string
  questionContext: PerformanceQuestionContext | null
  sourceTasks: Task[]
}

const getPerformancePreviewSessionKey = (entryDate: string) =>
  `performance-preview-session:${entryDate}`

export const getPerformancePreviewSession = (
  entryDate: string,
): PerformancePreviewSession | null => {
  const key = getPerformancePreviewSessionKey(entryDate)

  try {
    const storedSession = sessionStorage.getItem(key)

    if (!storedSession) {
      return null
    }

    return JSON.parse(storedSession) as PerformancePreviewSession
  } catch {
    try {
      sessionStorage.removeItem(key)
    } catch {
      return null
    }

    return null
  }
}

export const setPerformancePreviewSession = (
  entryDate: string,
  session: PerformancePreviewSession,
) => {
  try {
    sessionStorage.setItem(getPerformancePreviewSessionKey(entryDate), JSON.stringify(session))
  } catch {
    return
  }
}

export const clearPerformancePreviewSession = (entryDate: string) => {
  try {
    sessionStorage.removeItem(getPerformancePreviewSessionKey(entryDate))
  } catch {
    return
  }
}
