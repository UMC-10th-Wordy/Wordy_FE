import type { ApiEnvelope } from '@/types/api'
import type { JobRole } from '@/types/user'

export interface KpiRecommendationPayload {
  tagName: string
  projectName: string
  goal: string
  expectedOutcome: string
  period: string
  userJob: JobRole
}

export interface KpiRecommendationResult {
  kpiRecommendations: string[]
}

export type KpiRecommendationResponse = ApiEnvelope<KpiRecommendationResult>
