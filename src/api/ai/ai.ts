import type { KpiRecommendationPayload, KpiRecommendationResult } from '@/types/ai'
import { ApiError } from '@/api/tag/tag'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const TEMP_ACCESS_TOKEN = import.meta.env.DEV ? import.meta.env.VITE_TEMP_ACCESS_TOKEN : undefined

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const accessToken = localStorage.getItem('accessToken') ?? TEMP_ACCESS_TOKEN
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options?.headers,
    },
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : { success: response.ok, result: null }

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || `요청에 실패했습니다. (${response.status})`, response.status)
  }

  return data.result as T
}

export async function getKpiRecommendations(
  payload: KpiRecommendationPayload,
): Promise<KpiRecommendationResult> {
  return request<KpiRecommendationResult>('/ai/project-tags/kpi-recommendation', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
