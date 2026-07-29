import { request } from '@/lib/httpClient'
import type {
  CreateDashboardPayload,
  CreateReflectionPayload,
  DashboardDetailDto,
  DashboardListItemDto,
  EligibilityDto,
  UpdateReflectionPayload,
} from '@/types/dashboard'

/* GET /dashboards/eligibility — 주간 대시보드 생성 조건 조회 */
export async function getDashboardEligibility(baseDate?: string): Promise<EligibilityDto> {
  const query = baseDate ? `?BaseDate=${baseDate}` : ''
  return request<EligibilityDto>(`/dashboards/eligibility${query}`)
}

/* GET /dashboards — 주간 대시보드 목록 조회 */
export async function getDashboards(): Promise<DashboardListItemDto[]> {
  return request<DashboardListItemDto[]>('/dashboards')
}

/* GET /dashboards/{dashboardId} — 주간 대시보드 상세 조회 (미존재 시 ApiError throw) */
export async function getDashboardDetail(dashboardId: string): Promise<DashboardDetailDto> {
  return request<DashboardDetailDto>(`/dashboards/${dashboardId}`)
}
/* POST /dashboards — 주간 대시보드 생성(AI) */
export async function createDashboard(payload: CreateDashboardPayload): Promise<string> {
  return request<string>('/dashboards', { method: 'POST', body: JSON.stringify(payload) })
}

/* POST /dashboards/{dashboardId}/reflection — 주간회고 작성 */
export async function createReflection(
  dashboardId: string,
  payload: CreateReflectionPayload,
): Promise<string> {
  return request<string>(`/dashboards/${dashboardId}/reflection`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* PATCH /dashboards/{dashboardId}/reflection/{reflectionId} — 주간회고 수정 */
export async function updateReflection(
  dashboardId: string,
  reflectionId: string,
  payload: UpdateReflectionPayload,
): Promise<string> {
  return request<string>(`/dashboards/${dashboardId}/reflection/${reflectionId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
