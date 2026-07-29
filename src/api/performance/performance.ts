import { request } from '@/lib/httpClient'

import type {
  CompletePerformancePreviewPayload,
  CompletePerformancePreviewResponse,
  CreatePerformancePreviewPayload,
  CreatePerformancePreviewResponse,
  PerformanceDetailResponse,
  SavePerformancePayload,
  SavePerformanceResponse,
} from '@/types/performance'

/* AI 성과 미리보기 생성 */
// POST /ai/performance-preview

export const createPerformancePreview = async (
  payload: CreatePerformancePreviewPayload,
): Promise<CreatePerformancePreviewResponse> => {
  return request<CreatePerformancePreviewResponse>('/ai/performance-preview', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* 보충 질문 답변 후 성과 미리보기 생성 완료 */
// POST /ai/performance-preview/complete

export const completePerformancePreview = async (
  payload: CompletePerformancePreviewPayload,
): Promise<CompletePerformancePreviewResponse> => {
  return request<CompletePerformancePreviewResponse>('/ai/performance-preview/complete', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* 업무 성과 저장 */
// POST /performances

export const savePerformance = async (
  payload: SavePerformancePayload,
): Promise<SavePerformanceResponse> => {
  return request<SavePerformanceResponse>('/performances', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* 저장된 업무 성과 상세 조회 */
// GET /performances/{dailyPerformanceId}

export const getPerformanceDetail = async (
  dailyPerformanceId: string,
): Promise<PerformanceDetailResponse> => {
  return request<PerformanceDetailResponse>(
    `/performances/${encodeURIComponent(dailyPerformanceId)}`,
    {
      method: 'GET',
    },
  )
}

export const performanceQueryKeys = {
  all: ['performances'] as const,

  details: () => [...performanceQueryKeys.all, 'detail'] as const,

  detail: (dailyPerformanceId: string) =>
    [...performanceQueryKeys.details(), dailyPerformanceId] as const,
}
