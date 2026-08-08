import { useCallback, useMemo, useState } from 'react'

import { useCreateDailyEntry } from '@/hooks/useDailyEntryQueries'
import {
  useCompletePerformancePreview,
  useCreatePerformancePreview,
  useGetPerformancePreviewStatus,
  useSavePerformance,
} from '@/hooks/usePerformanceQueries'
import {
  mapPerformancePreviewResult,
  mapSavePerformancePayload,
} from '@/utils/performance-preview/performancePreviewMapper'

import {
  clearPerformancePreviewSession,
  getPerformancePreviewSession,
  setPerformancePreviewSession,
} from '@/utils/performance-preview/performancePreviewSession'

import type { PerformanceQuestionContext } from '@/utils/performance-preview/performancePreviewSession'
import { clearPerformancePreviewDraft } from '@/utils/performance-preview/performancePreviewDraft'
import type { PerformancePreviewStatus } from '@/components/performance-preview/PerformancePreviewPanel'
import type {
  CreatePerformancePreviewPayload,
  PerformanceSupplementAnswer,
} from '@/types/performance'
import type { PerformancePreviewResultData } from '@/types/performancePreviewResult'
import type { Task } from '@/types/todo'
import type { ProfileGetResult } from '@/types/user'

interface StartPerformancePreviewParams {
  entryDate: string
  reflectionContent: string
  tasks: Task[]
  profile: ProfileGetResult
  performanceRequest: Omit<
    CreatePerformancePreviewPayload,
    'dailyEntryId' | 'reflectionContent' | 'userJob' | 'yearsOfService'
  >
}

export const usePerformancePreview = (entryDate: string) => {
  const [initialSession] = useState(() => getPerformancePreviewSession(entryDate))

  const [status, setStatus] = useState<PerformancePreviewStatus>(
    () => initialSession?.status ?? 'empty',
  )

  const [result, setResult] = useState<PerformancePreviewResultData | null>(null)

  const [reflectionSnapshotId, setReflectionSnapshotId] = useState<string | null>(
    () => initialSession?.reflectionSnapshotId ?? null,
  )

  const [questionContext, setQuestionContext] = useState<PerformanceQuestionContext | null>(
    () => initialSession?.questionContext ?? null,
  )

  const [sourceTasks, setSourceTasks] = useState<Task[]>(() => initialSession?.sourceTasks ?? [])

  const [isSaved, setIsSaved] = useState(false)

  const createDailyEntryMutation = useCreateDailyEntry()
  const createPerformancePreviewMutation = useCreatePerformancePreview()
  const completePerformancePreviewMutation = useCompletePerformancePreview()
  const savePerformanceMutation = useSavePerformance()

  const previewStatusQuery = useGetPerformancePreviewStatus(
    reflectionSnapshotId,
    status === 'converting',
  )

  const pollingResult = previewStatusQuery.data

  const pollingPreviewResult = useMemo(() => {
    if (pollingResult?.status !== 'TEMP' || !pollingResult.promptBResult) {
      return null
    }

    return mapPerformancePreviewResult(pollingResult.promptBResult, sourceTasks)
  }, [pollingResult, sourceTasks])

  const resolvedStatus: PerformancePreviewStatus =
    previewStatusQuery.isPollingTimedOut || pollingResult?.status === 'FAILED'
      ? 'failed'
      : pollingPreviewResult
        ? 'success'
        : status

  const resolvedResult = status === 'success' && result ? result : (pollingPreviewResult ?? result)

  const preparePreview = () => {
    if (reflectionSnapshotId) {
      clearPerformancePreviewDraft(reflectionSnapshotId)
    }

    setIsSaved(false)
    setStatus('converting')
    setResult(null)
    setReflectionSnapshotId(null)
    setQuestionContext(null)
    setSourceTasks([])
  }

  const failPreview = () => {
    setStatus('failed')
  }

  const startPreview = async ({
    entryDate,
    reflectionContent,
    tasks,
    profile,
    performanceRequest,
  }: StartPerformancePreviewParams) => {
    clearPerformancePreviewSession(entryDate)

    setIsSaved(false)
    setStatus('converting')
    setResult(null)
    setReflectionSnapshotId(null)
    setQuestionContext(null)
    setSourceTasks(tasks)

    try {
      const dailyEntry = await createDailyEntryMutation.mutateAsync({
        entryDate,
        reflectionContent: reflectionContent.trim(),
      })

      const originalRequest: CreatePerformancePreviewPayload = {
        ...performanceRequest,
        dailyEntryId: dailyEntry.dailyEntryId,
        reflectionContent: reflectionContent.trim(),
        userJob: profile.jobRole,
        yearsOfService: profile.yearsOfService,
      }

      const previewResponse = await createPerformancePreviewMutation.mutateAsync(originalRequest)

      setReflectionSnapshotId(previewResponse.reflectionSnapshotId)

      if (previewResponse.status === 'QUESTION_REQUIRED') {
        const nextQuestionContext: PerformanceQuestionContext = {
          reflectionSnapshotId: previewResponse.reflectionSnapshotId,
          originalRequest,
          questions: previewResponse.supplementQuestions,
        }

        setQuestionContext(nextQuestionContext)
        setStatus('questioning')

        setPerformancePreviewSession(entryDate, {
          status: 'questioning',
          reflectionSnapshotId: previewResponse.reflectionSnapshotId,
          questionContext: nextQuestionContext,
          sourceTasks: tasks,
        })

        return
      }

      if (previewResponse.status === 'PROCESSING') {
        setStatus('converting')

        setPerformancePreviewSession(entryDate, {
          status: 'converting',
          reflectionSnapshotId: previewResponse.reflectionSnapshotId,
          questionContext: null,
          sourceTasks: tasks,
        })

        return
      }

      setResult(mapPerformancePreviewResult(previewResponse, tasks))
      setStatus('success')
    } catch (error) {
      setStatus('failed')
      throw error
    }
  }

  const completeQuestioning = useCallback(
    async (answers: PerformanceSupplementAnswer[]) => {
      if (!questionContext) {
        return
      }

      setStatus('converting')

      setPerformancePreviewSession(entryDate, {
        status: 'converting',
        reflectionSnapshotId: questionContext.reflectionSnapshotId,
        questionContext: null,
        sourceTasks,
      })

      try {
        const completedResponse = await completePerformancePreviewMutation.mutateAsync({
          reflectionSnapshotId: questionContext.reflectionSnapshotId,
          originalRequest: questionContext.originalRequest,
          answers,
        })

        setReflectionSnapshotId(completedResponse.reflectionSnapshotId)
        setQuestionContext(null)

        if (completedResponse.status === 'PROCESSING') {
          setStatus('converting')

          setPerformancePreviewSession(entryDate, {
            status: 'converting',
            reflectionSnapshotId: completedResponse.reflectionSnapshotId,
            questionContext: null,
            sourceTasks,
          })

          return
        }

        setResult(mapPerformancePreviewResult(completedResponse, sourceTasks))
        setStatus('success')
      } catch (error) {
        setStatus('failed')
        throw error
      }
    },
    [completePerformancePreviewMutation, entryDate, questionContext, sourceTasks],
  )

  const saveResult = async (values: { summary: string; insight: string }) => {
    if (!reflectionSnapshotId) {
      throw new Error('성과 저장에 필요한 reflectionSnapshotId가 없습니다.')
    }

    const response = await savePerformanceMutation.mutateAsync(
      mapSavePerformancePayload({
        reflectionSnapshotId,
        summary: values.summary,
        insight: values.insight,
      }),
    )

    const currentResult = pollingPreviewResult ?? result

    if (currentResult) {
      setResult({
        ...currentResult,
        summary: values.summary,
        insight: values.insight,
      })
    }

    setIsSaved(true)
    setStatus('success')

    clearPerformancePreviewDraft(reflectionSnapshotId)
    clearPerformancePreviewSession(entryDate)

    return response
  }

  const resetPreview = () => {
    setIsSaved(false)
    setStatus('empty')
    setResult(null)
    setReflectionSnapshotId(null)
    setQuestionContext(null)
    setSourceTasks([])
    clearPerformancePreviewSession(entryDate)
  }

  const restorePreview = (nextEntryDate: string) => {
    const session = getPerformancePreviewSession(nextEntryDate)

    setIsSaved(false)
    setResult(null)

    if (!session) {
      setStatus('empty')
      setReflectionSnapshotId(null)
      setQuestionContext(null)
      setSourceTasks([])
      return
    }

    setStatus(session.status)
    setReflectionSnapshotId(session.reflectionSnapshotId)
    setQuestionContext(session.questionContext)
    setSourceTasks(session.sourceTasks)
  }

  return {
    status: resolvedStatus,
    result: resolvedResult,
    reflectionSnapshotId,
    isSaved,
    questions: questionContext?.questions ?? [],
    isStarting: createDailyEntryMutation.isPending || createPerformancePreviewMutation.isPending,
    isCompleting: completePerformancePreviewMutation.isPending,
    isSaving: savePerformanceMutation.isPending,
    startPreview,
    completeQuestioning,
    saveResult,
    preparePreview,
    failPreview,
    resetPreview,
    restorePreview,
  }
}
