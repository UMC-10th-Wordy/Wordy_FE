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

const getPerformancePreviewSessionKey = (workspaceId: string, entryDate: string) =>
  `performance-preview-session:${workspaceId}:${entryDate}`

export const getPerformancePreviewSession = (
  workspaceId: string,
  entryDate: string,
): PerformancePreviewSession | null => {
  if (!workspaceId) {
    return null
  }

  const key = getPerformancePreviewSessionKey(workspaceId, entryDate)

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
  workspaceId: string,
  entryDate: string,
  session: PerformancePreviewSession,
) => {
  if (!workspaceId) {
    return
  }

  try {
    sessionStorage.setItem(
      getPerformancePreviewSessionKey(workspaceId, entryDate),
      JSON.stringify(session),
    )
  } catch {
    return
  }
}

export const clearPerformancePreviewSession = (workspaceId: string, entryDate: string) => {
  if (!workspaceId) {
    return
  }

  try {
    sessionStorage.removeItem(getPerformancePreviewSessionKey(workspaceId, entryDate))
  } catch {
    return
  }
}
