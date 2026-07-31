import { useCallback, useState } from 'react'

import { useCreateDailyEntry } from '@/hooks/useDailyEntryQueries'
import {
  useCompletePerformancePreview,
  useCreatePerformancePreview,
  useSavePerformance,
} from '@/hooks/usePerformanceQueries'
import {
  mapPerformancePreviewResult,
  mapSavePerformancePayload,
} from '@/utils/performance-preview/performancePreviewMapper'

import type { PerformancePreviewStatus } from '@/components/performance-preview/PerformancePreviewPanel'
import type {
  CreatePerformancePreviewPayload,
  PerformancePreviewQuestionRequiredResult,
  PerformanceSupplementAnswer,
} from '@/types/performance'
import type { PerformancePreviewResultData } from '@/types/performancePreviewResult'
import type { Task } from '@/types/todo'
import type { ProfileGetResult } from '@/types/user'

interface PerformanceQuestionContext {
  reflectionSnapshotId: string
  originalRequest: CreatePerformancePreviewPayload
  questions: PerformancePreviewQuestionRequiredResult['supplementQuestions']
}

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

export const usePerformancePreview = () => {
  const [status, setStatus] = useState<PerformancePreviewStatus>('empty')
  const [result, setResult] = useState<PerformancePreviewResultData | null>(null)
  const [reflectionSnapshotId, setReflectionSnapshotId] = useState<string | null>(null)
  const [questionContext, setQuestionContext] = useState<PerformanceQuestionContext | null>(null)
  const [sourceTasks, setSourceTasks] = useState<Task[]>([])

  const createDailyEntryMutation = useCreateDailyEntry()
  const createPerformancePreviewMutation = useCreatePerformancePreview()
  const completePerformancePreviewMutation = useCompletePerformancePreview()
  const savePerformanceMutation = useSavePerformance()

  const preparePreview = () => {
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
    setStatus('converting')
    setResult(null)
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
        setQuestionContext({
          reflectionSnapshotId: previewResponse.reflectionSnapshotId,
          originalRequest,
          questions: previewResponse.supplementQuestions,
        })

        setStatus('questioning')
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

      try {
        const completedResponse = await completePerformancePreviewMutation.mutateAsync({
          reflectionSnapshotId: questionContext.reflectionSnapshotId,
          originalRequest: questionContext.originalRequest,
          answers,
        })

        setReflectionSnapshotId(completedResponse.reflectionSnapshotId)
        setResult(mapPerformancePreviewResult(completedResponse, sourceTasks))
        setQuestionContext(null)
        setStatus('success')
      } catch (error) {
        setStatus('failed')
        throw error
      }
    },
    [completePerformancePreviewMutation, questionContext, sourceTasks],
  )

  const saveResult = async (values: { summary: string; insight: string }) => {
    if (!reflectionSnapshotId) {
      throw new Error('성과 저장에 필요한 reflectionSnapshotId가 없습니다.')
    }

    return savePerformanceMutation.mutateAsync(
      mapSavePerformancePayload({
        reflectionSnapshotId,
        summary: values.summary,
        insight: values.insight,
      }),
    )
  }

  const resetPreview = () => {
    setStatus('empty')
    setResult(null)
    setReflectionSnapshotId(null)
    setQuestionContext(null)
    setSourceTasks([])
  }

  return {
    status,
    result,
    reflectionSnapshotId,
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
  }
}
