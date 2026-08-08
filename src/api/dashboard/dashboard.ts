import { request } from '@/lib/httpClient'
import {
  INITIAL_ELIGIBILITY_MOCK,
  INITIAL_DASHBOARD_LIST_MOCK,
  INITIAL_DASHBOARD_DETAIL_MOCK,
  INITIAL_MONTHLY_DASHBOARD_DETAIL_MOCK,
  INITIAL_MONTHLY_DASHBOARD_LIST_MOCK,
  MONTHLY_ELIGIBILITY_MOCK,
} from '@/mocks/dashboard/dashboardApiMock'
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

// 백엔드 대시보드 API가 불안정한 데모 환경에서 목데이터로 대체 (VITE_USE_MOCK_DASHBOARD=true)
const USE_MOCK_DASHBOARD = import.meta.env.VITE_USE_MOCK_DASHBOARD === 'true'
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let weeklyDetailMock: DashboardDetailDto = structuredClone(INITIAL_DASHBOARD_DETAIL_MOCK)
let monthlyDetailMock: DashboardDetailDto = structuredClone(INITIAL_MONTHLY_DASHBOARD_DETAIL_MOCK)

/* GET /dashboards/eligibility — 주간 대시보드 생성 조건 조회 */
export async function getDashboardEligibility(baseDate?: string): Promise<EligibilityDto> {
  if (USE_MOCK_DASHBOARD) return INITIAL_ELIGIBILITY_MOCK
  const query = baseDate ? `?BaseDate=${baseDate}` : ''
  return request<EligibilityDto>(`/dashboards/eligibility${query}`)
}

/* GET /dashboards — 주간 대시보드 목록 조회 */
export async function getDashboards(): Promise<DashboardListItemDto[]> {
  if (USE_MOCK_DASHBOARD) return INITIAL_DASHBOARD_LIST_MOCK
  return request<DashboardListItemDto[]>('/dashboards')
}

/* GET /dashboards/{dashboardId} — 주간 대시보드 상세 조회 (미존재 시 ApiError throw) */
export async function getDashboardDetail(dashboardId: string): Promise<DashboardDetailDto> {
  if (USE_MOCK_DASHBOARD) return weeklyDetailMock
  return request<DashboardDetailDto>(`/dashboards/${dashboardId}`)
}

/* POST /dashboards/{dashboardId}/reflection — 주간회고 작성 */
export async function createReflection(
  dashboardId: string,
  payload: CreateReflectionPayload,
): Promise<string> {
  if (USE_MOCK_DASHBOARD) {
    const reflectionId = `mock-reflection-${Date.now()}`
    weeklyDetailMock = {
      ...weeklyDetailMock,
      weeklyReflections: [{ reflectionId, ...payload }],
    }
    return reflectionId
  }
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
  if (USE_MOCK_DASHBOARD) {
    weeklyDetailMock = {
      ...weeklyDetailMock,
      weeklyReflections: weeklyDetailMock.weeklyReflections.map((r) =>
        r.reflectionId === reflectionId ? { ...r, ...payload } : r,
      ),
    }
    return reflectionId
  }
  return request<string>(`/dashboards/${dashboardId}/reflection/${reflectionId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

/* GET /dashboards/monthly/eligibility — 월간 대시보드 생성 조건 조회 */
export async function getMonthlyEligibility(baseDate?: string): Promise<MonthlyEligibilityDto> {
  if (USE_MOCK_DASHBOARD) return MONTHLY_ELIGIBILITY_MOCK
  const query = baseDate ? `?BaseDate=${baseDate}` : ''
  return request<MonthlyEligibilityDto>(`/dashboards/monthly/eligibility${query}`)
}

/* GET /dashboards/monthly — 월간 대시보드 목록 조회 (경로 스웨거 표기 백엔드 확인 중) */
export async function getMonthlyDashboards(): Promise<DashboardListItemDto[]> {
  if (USE_MOCK_DASHBOARD) return INITIAL_MONTHLY_DASHBOARD_LIST_MOCK
  return request<DashboardListItemDto[]>('/dashboards/monthly')
}

/* GET /dashboards/monthly/{dashboardId} — 월간 대시보드 상세 조회 */
export async function getMonthlyDashboardDetail(dashboardId: string): Promise<DashboardDetailDto> {
  if (USE_MOCK_DASHBOARD) return monthlyDetailMock
  return request<DashboardDetailDto>(`/dashboards/monthly/${dashboardId}`)
}

/* POST /dashboards/monthly/{dashboardId}/reflection — 월간 회고 작성 (수정 API 명세 부재) */
export async function createMonthlyReflection(
  dashboardId: string,
  payload: CreateReflectionPayload,
): Promise<MonthlyReflectionResultDto> {
  if (USE_MOCK_DASHBOARD) {
    const weeklyReflectionId = `mock-reflection-${Date.now()}`
    const createdAt = new Date().toISOString()
    monthlyDetailMock = {
      ...monthlyDetailMock,
      weeklyReflections: [{ reflectionId: weeklyReflectionId, ...payload }],
    }
    return { weeklyReflectionId, ...payload, createdAt }
  }
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
