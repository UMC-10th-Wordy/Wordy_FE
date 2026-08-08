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
  const storedSession = sessionStorage.getItem(key)

  if (!storedSession) {
    return null
  }

  try {
    return JSON.parse(storedSession) as PerformancePreviewSession
  } catch {
    sessionStorage.removeItem(key)
    return null
  }
}

export const setPerformancePreviewSession = (
  entryDate: string,
  session: PerformancePreviewSession,
) => {
  sessionStorage.setItem(getPerformancePreviewSessionKey(entryDate), JSON.stringify(session))
}

export const clearPerformancePreviewSession = (entryDate: string) => {
  sessionStorage.removeItem(getPerformancePreviewSessionKey(entryDate))
}
