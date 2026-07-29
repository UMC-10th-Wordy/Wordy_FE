import type {
  CompletePerformancePreviewPayload,
  CompletePerformancePreviewResponse,
  CreatePerformancePreviewPayload,
  CreatePerformancePreviewResponse,
  PerformanceDetailResponse,
  SavePerformancePayload,
  SavePerformanceResponse,
} from '@/types/performance'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const TEMP_ACCESS_TOKEN = import.meta.env.DEV ? import.meta.env.VITE_TEMP_ACCESS_TOKEN : undefined

interface ErrorResponse {
  message?: string
}

const isErrorResponse = (value: unknown): value is ErrorResponse => {
  return typeof value === 'object' && value !== null && 'message' in value
}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(TEMP_ACCESS_TOKEN
        ? {
            Authorization: `Bearer ${TEMP_ACCESS_TOKEN}`,
          }
        : {}),
      ...options?.headers,
    },
  })

  const data: unknown = await response.json()

  if (!response.ok) {
    const message =
      isErrorResponse(data) && typeof data.message === 'string'
        ? data.message
        : `요청에 실패했습니다. (${response.status})`

    throw new Error(message)
  }

  return data as T
}

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
  )
}

export const performanceQueryKeys = {
  all: ['performances'] as const,

  details: () => [...performanceQueryKeys.all, 'detail'] as const,

  detail: (dailyPerformanceId: string) =>
    [...performanceQueryKeys.details(), dailyPerformanceId] as const,
}
