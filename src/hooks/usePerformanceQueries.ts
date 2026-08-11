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
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'

import type {
  CompletePerformancePreviewPayload,
  CreatePerformancePreviewPayload,
  PerformanceDetailResponse,
  SavePerformancePayload,
  UpdatePerformancePayload,
} from '@/types/performance'

interface UpdatePerformanceVariables {
  dailyPerformanceId: string
  payload: UpdatePerformancePayload
}

const PERFORMANCE_PREVIEW_POLLING_INTERVAL_MS = 1_000
const PERFORMANCE_PREVIEW_POLLING_TIMEOUT_MS = 120_000

export const useCreatePerformancePreview = () => {
  const activeWorkspaceId = useActiveWorkspaceId()

  return useMutation({
    mutationFn: (payload: CreatePerformancePreviewPayload) => {
      if (!activeWorkspaceId) {
        throw new Error('워크스페이스 ID가 없습니다.')
      }

      return createPerformancePreview(activeWorkspaceId, payload)
    },
  })
}

export const useCompletePerformancePreview = () => {
  const activeWorkspaceId = useActiveWorkspaceId()

  return useMutation({
    mutationFn: (payload: CompletePerformancePreviewPayload) => {
      if (!activeWorkspaceId) {
        throw new Error('워크스페이스 ID가 없습니다.')
      }

      return completePerformancePreview(activeWorkspaceId, payload)
    },
  })
}

export const useSavePerformance = () => {
  const activeWorkspaceId = useActiveWorkspaceId()

  return useMutation({
    mutationFn: (payload: SavePerformancePayload) => {
      if (!activeWorkspaceId) {
        throw new Error('워크스페이스 ID가 없습니다.')
      }

      return savePerformance(activeWorkspaceId, payload)
    },
  })
}

export const useUpdatePerformance = () => {
  const queryClient = useQueryClient()
  const activeWorkspaceId = useActiveWorkspaceId()

  return useMutation({
    mutationFn: ({ dailyPerformanceId, payload }: UpdatePerformanceVariables) => {
      if (!activeWorkspaceId) {
        throw new Error('워크스페이스 ID가 없습니다.')
      }

      return updatePerformance(activeWorkspaceId, dailyPerformanceId, payload)
    },

    onSuccess: (_, { dailyPerformanceId, payload }) => {
      queryClient.setQueryData<PerformanceDetailResponse>(
        performanceQueryKeys.detail(activeWorkspaceId, dailyPerformanceId),
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
          queryKey: performanceQueryKeys.detail(activeWorkspaceId, dailyPerformanceId),
        }),
        queryClient.invalidateQueries({
          queryKey: performanceQueryKeys.lists(activeWorkspaceId),
        }),
      ])
    },
  })
}

export const useGetPerformancesByDate = (date: string) => {
  const activeWorkspaceId = useActiveWorkspaceId()

  return useQuery({
    queryKey: performanceQueryKeys.list(activeWorkspaceId, date),
    queryFn: () => getPerformances(activeWorkspaceId, date),
    enabled: !!activeWorkspaceId,
  })
}

export const useGetPerformanceDetail = (dailyPerformanceId: string) => {
  const activeWorkspaceId = useActiveWorkspaceId()

  return useSuspenseQuery({
    queryKey: performanceQueryKeys.detail(activeWorkspaceId, dailyPerformanceId),
    queryFn: () => getPerformanceDetail(activeWorkspaceId, dailyPerformanceId),
    refetchOnMount: 'always',
  })
}

export const useGetPerformanceDetailQuery = (dailyPerformanceId: string | null) => {
  const activeWorkspaceId = useActiveWorkspaceId()

  return useQuery({
    queryKey: dailyPerformanceId
      ? performanceQueryKeys.detail(activeWorkspaceId, dailyPerformanceId)
      : [...performanceQueryKeys.details(activeWorkspaceId), 'empty'],

    queryFn: () => {
      if (!dailyPerformanceId) {
        throw new Error('성과 상세 조회에 필요한 dailyPerformanceId가 없습니다.')
      }

      return getPerformanceDetail(activeWorkspaceId, dailyPerformanceId)
    },

    enabled: !!activeWorkspaceId && Boolean(dailyPerformanceId),
  })
}

export const useGetPerformancePreviewStatus = (
  reflectionSnapshotId: string | null,
  enabled: boolean,
) => {
  const activeWorkspaceId = useActiveWorkspaceId()
  const [timedOutSnapshotId, setTimedOutSnapshotId] = useState<string | null>(null)

  const isPollingTimedOut =
    reflectionSnapshotId !== null && timedOutSnapshotId === reflectionSnapshotId

  const query = useQuery({
    queryKey: reflectionSnapshotId
      ? performanceQueryKeys.preview(activeWorkspaceId, reflectionSnapshotId)
      : [...performanceQueryKeys.previews(activeWorkspaceId), 'empty'],

    queryFn: () => {
      if (!reflectionSnapshotId) {
        throw new Error('성과 미리보기 조회에 필요한 reflectionSnapshotId가 없습니다.')
      }

      return getPerformancePreviewStatus(activeWorkspaceId, reflectionSnapshotId)
    },

    enabled: !!activeWorkspaceId && Boolean(reflectionSnapshotId) && enabled && !isPollingTimedOut,

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
