import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'

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

import type { UpdatePerformancePayload } from '@/types/performance'

interface UpdatePerformanceVariables {
  dailyPerformanceId: string
  payload: UpdatePerformancePayload
}

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
  return useMutation({
    mutationFn: ({ dailyPerformanceId, payload }: UpdatePerformanceVariables) =>
      updatePerformance(dailyPerformanceId, payload),
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
  return useQuery({
    queryKey: reflectionSnapshotId
      ? performanceQueryKeys.preview(reflectionSnapshotId)
      : [...performanceQueryKeys.previews(), 'empty'],
    queryFn: () => {
      if (!reflectionSnapshotId) {
        throw new Error('성과 미리보기 조회에 필요한 reflectionSnapshotId가 없습니다.')
      }

      return getPerformancePreviewStatus(reflectionSnapshotId)
    },
    enabled: Boolean(reflectionSnapshotId) && enabled,
    refetchInterval: (query) => {
      const data = query.state.data

      const shouldContinuePolling =
        !data || data.status === 'PROCESSING' || (data.status === 'TEMP' && !data.promptBResult)

      return shouldContinuePolling ? 1000 : false
    },
  })
}
