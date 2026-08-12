import type { KpiRecommendationPayload, KpiRecommendationResult } from '@/types/ai'
import { request } from '@/lib/httpClient'

export async function getKpiRecommendations(
  payload: KpiRecommendationPayload,
): Promise<KpiRecommendationResult> {
  return request<KpiRecommendationResult>('/ai/project-tags/kpi-recommendation', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
