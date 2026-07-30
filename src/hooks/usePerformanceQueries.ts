import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'

import {
  completePerformancePreview,
  createPerformancePreview,
  getPerformanceDetail,
  getPerformances,
  performanceQueryKeys,
  savePerformance,
} from '@/api/performance/performance'

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
