import { request } from '@/lib/httpClient'
import type {
  AiDashboardResultDto,
  CreateDashboardPayload,
  CreateReflectionPayload,
  DashboardDetailDto,
  DashboardListItemDto,
  EligibilityDto,
  UpdateReflectionPayload,
  MonthlyEligibilityDto,
  MonthlyReflectionResultDto,
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

/* GET /dashboards/monthly/eligibility — 월간 대시보드 생성 조건 조회 */
export async function getMonthlyEligibility(baseDate?: string): Promise<MonthlyEligibilityDto> {
  const query = baseDate ? `?BaseDate=${baseDate}` : ''
  return request<MonthlyEligibilityDto>(`/dashboards/monthly/eligibility${query}`)
}

/* GET /dashboards/monthly — 월간 대시보드 목록 조회 (경로 스웨거 표기 백엔드 확인 중) */
export async function getMonthlyDashboards(): Promise<DashboardListItemDto[]> {
  return request<DashboardListItemDto[]>('/dashboards/monthly')
}

/* GET /dashboards/monthly/{dashboardId} — 월간 대시보드 상세 조회 */
export async function getMonthlyDashboardDetail(dashboardId: string): Promise<DashboardDetailDto> {
  return request<DashboardDetailDto>(`/dashboards/monthly/${dashboardId}`)
}

/* POST /dashboards/monthly/{dashboardId}/reflection — 월간 회고 작성 (수정 API 명세 부재) */
export async function createMonthlyReflection(
  dashboardId: string,
  payload: CreateReflectionPayload,
): Promise<MonthlyReflectionResultDto> {
  return request<MonthlyReflectionResultDto>(`/dashboards/monthly/${dashboardId}/reflection`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* POST /ai/dashboard/weekly — 주간 대시보드 AI 생성. LLM 호출로 처리 시간이 길어 타임아웃 연장 */
export async function createDashboard(
  payload: CreateDashboardPayload,
): Promise<AiDashboardResultDto> {
  return request<AiDashboardResultDto>('/ai/dashboard/weekly', {
    method: 'POST',
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(120_000),
  })
}

/* POST /ai/dashboard/monthly — 월간 대시보드 AI 생성 */
export async function createMonthlyDashboard(
  payload: CreateDashboardPayload,
): Promise<AiDashboardResultDto> {
  return request<AiDashboardResultDto>('/ai/dashboard/monthly', {
    method: 'POST',
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(120_000),
  })
}
