import { request } from '@/lib/httpClient'

import type {
  CompletePerformancePreviewPayload,
  CompletePerformancePreviewResponse,
  CreatePerformancePreviewPayload,
  CreatePerformancePreviewResponse,
  PerformanceDetailResponse,
  PerformanceListResponse,
  PerformancePreviewPollingResponse,
  SavePerformancePayload,
  SavePerformanceResponse,
  UpdatePerformancePayload,
  UpdatePerformanceResponse,
} from '@/types/performance'

const AI_REQUEST_TIMEOUT_MS = 120_000

const getPerformancesPath = (workspaceId: string) =>
  `/workspaces/${encodeURIComponent(workspaceId)}/performances`

const getPerformancePreviewPath = (workspaceId: string) =>
  `/ai/workspaces/${encodeURIComponent(workspaceId)}/performance-preview`

/* AI 성과 미리보기 생성 */
// POST /ai/workspaces/{workspaceId}/performance-preview

export const createPerformancePreview = async (
  workspaceId: string,
  payload: CreatePerformancePreviewPayload,
): Promise<CreatePerformancePreviewResponse> => {
  return request<CreatePerformancePreviewResponse>(getPerformancePreviewPath(workspaceId), {
    method: 'POST',
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
  })
}

/* 보충 질문 답변 후 성과 미리보기 생성 완료 */
// POST /ai/workspaces/{workspaceId}/performance-preview/complete

export const completePerformancePreview = async (
  workspaceId: string,
  payload: CompletePerformancePreviewPayload,
): Promise<CompletePerformancePreviewResponse> => {
  return request<CompletePerformancePreviewResponse>(
    `${getPerformancePreviewPath(workspaceId)}/complete`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
    },
  )
}

/* 업무 성과 저장 */
// POST /workspaces/{workspaceId}/performances

export const savePerformance = async (
  workspaceId: string,
  payload: SavePerformancePayload,
): Promise<SavePerformanceResponse> => {
  return request<SavePerformanceResponse>(getPerformancesPath(workspaceId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* 저장된 업무 성과 목록 조회 */
// GET /workspaces/{workspaceId}/performances?date=YYYY-MM-DD

export const getPerformances = async (
  workspaceId: string,
  date?: string,
): Promise<PerformanceListResponse> => {
  const searchParams = new URLSearchParams()

  if (date) {
    searchParams.set('date', date)
  }

  const queryString = searchParams.toString()

  const response = await request<PerformanceListResponse | null>(
    `${getPerformancesPath(workspaceId)}${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
    },
  )

  return (
    response ?? {
      exists: false,
      performance: null,
    }
  )
}

/* 저장된 업무 성과 상세 조회 */
// GET /workspaces/{workspaceId}/performances/{dailyPerformanceId}

export const getPerformanceDetail = async (
  workspaceId: string,
  dailyPerformanceId: string,
): Promise<PerformanceDetailResponse> => {
  const response = await request<PerformanceDetailResponse | null>(
    `${getPerformancesPath(workspaceId)}/${encodeURIComponent(dailyPerformanceId)}`,
    {
      method: 'GET',
    },
  )

  if (!response) {
    throw new Error('저장된 성과 상세 데이터가 없습니다.')
  }

  return response
}

/* 저장된 업무 성과 수정 */
// PATCH /workspaces/{workspaceId}/performances/{dailyPerformanceId}

export const updatePerformance = async (
  workspaceId: string,
  dailyPerformanceId: string,
  payload: UpdatePerformancePayload,
): Promise<UpdatePerformanceResponse> => {
  return request<UpdatePerformanceResponse>(
    `${getPerformancesPath(workspaceId)}/${encodeURIComponent(dailyPerformanceId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  )
}

/* 성과 미리보기 상태 조회 */
// GET /workspaces/{workspaceId}/performances/preview/{reflectionSnapshotId}

export const getPerformancePreviewStatus = async (
  workspaceId: string,
  reflectionSnapshotId: string,
): Promise<PerformancePreviewPollingResponse> => {
  return request<PerformancePreviewPollingResponse>(
    `${getPerformancesPath(workspaceId)}/preview/${encodeURIComponent(reflectionSnapshotId)}`,
    {
      method: 'GET',
    },
  )
}

export const performanceQueryKeys = {
  all: ['performances'] as const,

  workspace: (workspaceId: string) => [...performanceQueryKeys.all, workspaceId] as const,

  previews: (workspaceId: string) =>
    [...performanceQueryKeys.workspace(workspaceId), 'preview'] as const,

  preview: (workspaceId: string, reflectionSnapshotId: string) =>
    [...performanceQueryKeys.previews(workspaceId), reflectionSnapshotId] as const,

  lists: (workspaceId: string) => [...performanceQueryKeys.workspace(workspaceId), 'list'] as const,

  list: (workspaceId: string, date?: string) =>
    [...performanceQueryKeys.lists(workspaceId), { date: date ?? null }] as const,

  details: (workspaceId: string) =>
    [...performanceQueryKeys.workspace(workspaceId), 'detail'] as const,

  detail: (workspaceId: string, dailyPerformanceId: string) =>
    [...performanceQueryKeys.details(workspaceId), dailyPerformanceId] as const,
}
