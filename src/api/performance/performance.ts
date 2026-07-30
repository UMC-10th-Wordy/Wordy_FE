import { request } from '@/lib/httpClient'

import type {
  CompletePerformancePreviewPayload,
  CompletePerformancePreviewResponse,
  CreatePerformancePreviewPayload,
  CreatePerformancePreviewResponse,
  PerformanceDetailResponse,
  PerformanceListResponse,
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

/* 저장된 업무 성과 목록 조회 */
// GET /performances?date=YYYY-MM-DD

export const getPerformances = async (date?: string): Promise<PerformanceListResponse> => {
  const searchParams = new URLSearchParams()

  if (date) {
    searchParams.set('date', date)
  }

  const queryString = searchParams.toString()

  const response = await request<PerformanceListResponse | null>(
    `/performances${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
    },
  )

  return response ?? { performances: [] }
}

/* 저장된 업무 성과 상세 조회 */
// GET /performances/{dailyPerformanceId}

export const getPerformanceDetail = async (
  dailyPerformanceId: string,
): Promise<PerformanceDetailResponse> => {
  const response = await request<PerformanceDetailResponse | null>(
    `/performances/${encodeURIComponent(dailyPerformanceId)}`,
    {
      method: 'GET',
    },
  )

  if (!response) {
    throw new Error('저장된 성과 상세 데이터가 없습니다.')
  }

  return response
}

export const performanceQueryKeys = {
  all: ['performances'] as const,

  lists: () => [...performanceQueryKeys.all, 'list'] as const,

  list: (date?: string) => [...performanceQueryKeys.lists(), { date: date ?? null }] as const,

  details: () => [...performanceQueryKeys.all, 'detail'] as const,

  detail: (dailyPerformanceId: string) =>
    [...performanceQueryKeys.details(), dailyPerformanceId] as const,
}
