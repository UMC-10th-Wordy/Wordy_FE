import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import {
  completePerformancePreview,
  createPerformancePreview,
  getPerformanceDetail,
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

export const useGetPerformanceDetail = (dailyPerformanceId: string) => {
  return useSuspenseQuery({
    queryKey: performanceQueryKeys.detail(dailyPerformanceId),
    queryFn: () => getPerformanceDetail(dailyPerformanceId),
  })
}
