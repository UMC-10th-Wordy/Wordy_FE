import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import {
  completePerformancePreview,
  createPerformancePreview,
  getPerformanceDetail,
  getPerformancePreviewStatus,
  getPerformances,
  performanceQueryKeys,
  savePerformance,
  updatePerformance,
} from '@/api/performance/performance'

import type { PerformanceDetailResponse, UpdatePerformancePayload } from '@/types/performance'

interface UpdatePerformanceVariables {
  dailyPerformanceId: string
  payload: UpdatePerformancePayload
}

const PERFORMANCE_PREVIEW_POLLING_INTERVAL_MS = 1_000
const PERFORMANCE_PREVIEW_POLLING_TIMEOUT_MS = 120_000

export const useCreatePerformancePreview = () => {
  return useMutation({
    mutationFn: createPerformancePreview,
  })
}

export const useCompletePerformancePreview = () => {
  return useMutation({
    mutationFn: completePerformancePreview,
  })
}

export const useSavePerformance = () => {
  return useMutation({
    mutationFn: savePerformance,
  })
}

export const useUpdatePerformance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dailyPerformanceId, payload }: UpdatePerformanceVariables) =>
      updatePerformance(dailyPerformanceId, payload),

    onSuccess: (_, { dailyPerformanceId, payload }) => {
      queryClient.setQueryData<PerformanceDetailResponse>(
        performanceQueryKeys.detail(dailyPerformanceId),
        (prev) => {
          if (!prev) {
            return prev
          }

          return {
            ...prev,
            summary: payload.summary,
            growthInsights: payload.growthInsights,
          }
        },
      )

      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: performanceQueryKeys.detail(dailyPerformanceId),
        }),
        queryClient.invalidateQueries({
          queryKey: performanceQueryKeys.lists(),
        }),
      ])
    },
  })
}

export const useGetPerformancesByDate = (date: string) => {
  return useQuery({
    queryKey: performanceQueryKeys.list(date),
    queryFn: () => getPerformances(date),
  })
}

export const useGetPerformanceDetail = (dailyPerformanceId: string) => {
  return useSuspenseQuery({
    queryKey: performanceQueryKeys.detail(dailyPerformanceId),
    queryFn: () => getPerformanceDetail(dailyPerformanceId),
    refetchOnMount: 'always',
  })
}

export const useGetPerformanceDetailQuery = (dailyPerformanceId: string | null) => {
  return useQuery({
    queryKey: dailyPerformanceId
      ? performanceQueryKeys.detail(dailyPerformanceId)
      : [...performanceQueryKeys.details(), 'empty'],
    queryFn: () => {
      if (!dailyPerformanceId) {
        throw new Error('성과 상세 조회에 필요한 dailyPerformanceId가 없습니다.')
      }

      return getPerformanceDetail(dailyPerformanceId)
    },
    enabled: Boolean(dailyPerformanceId),
  })
}

export const useGetPerformancePreviewStatus = (
  reflectionSnapshotId: string | null,
  enabled: boolean,
) => {
  const [timedOutSnapshotId, setTimedOutSnapshotId] = useState<string | null>(null)

  const isPollingTimedOut =
    reflectionSnapshotId !== null && timedOutSnapshotId === reflectionSnapshotId

  const query = useQuery({
    queryKey: reflectionSnapshotId
      ? performanceQueryKeys.preview(reflectionSnapshotId)
      : [...performanceQueryKeys.previews(), 'empty'],
    queryFn: () => {
      if (!reflectionSnapshotId) {
        throw new Error('성과 미리보기 조회에 필요한 reflectionSnapshotId가 없습니다.')
      }

      return getPerformancePreviewStatus(reflectionSnapshotId)
    },
    enabled: Boolean(reflectionSnapshotId) && enabled && !isPollingTimedOut,
    refetchInterval: (query) => {
      const data = query.state.data

      const shouldContinuePolling =
        !data || data.status === 'PROCESSING' || (data.status === 'TEMP' && !data.promptBResult)

      return shouldContinuePolling ? PERFORMANCE_PREVIEW_POLLING_INTERVAL_MS : false
    },
  })

  const isPollingCompleted =
    query.data?.status === 'FAILED' ||
    (query.data?.status === 'TEMP' && Boolean(query.data.promptBResult))

  useEffect(() => {
    if (!reflectionSnapshotId || !enabled || isPollingTimedOut || isPollingCompleted) {
      return
    }

    const timer = setTimeout(() => {
      setTimedOutSnapshotId(reflectionSnapshotId)
    }, PERFORMANCE_PREVIEW_POLLING_TIMEOUT_MS)

    return () => {
      clearTimeout(timer)
    }
  }, [enabled, isPollingCompleted, isPollingTimedOut, reflectionSnapshotId])

  return {
    ...query,
    isPollingTimedOut,
  }
}
