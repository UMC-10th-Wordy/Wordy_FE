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
  DraftDto,
} from '@/types/dashboard'

const USE_MOCK_DASHBOARD = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DASHBOARD === 'true'

let weeklyDetailMock: DashboardDetailDto = structuredClone(INITIAL_DASHBOARD_DETAIL_MOCK)
let monthlyDetailMock: DashboardDetailDto = structuredClone(INITIAL_MONTHLY_DASHBOARD_DETAIL_MOCK)

/* GET /workspaces/{workspaceId}/dashboards/eligibility — 주간 대시보드 생성 조건 조회 */
export async function getDashboardEligibility(
  workspaceId: string,
  baseDate?: string,
): Promise<EligibilityDto> {
  if (USE_MOCK_DASHBOARD) return INITIAL_ELIGIBILITY_MOCK
  const query = baseDate ? `?baseDate=${baseDate}` : ''
  return request<EligibilityDto>(`/workspaces/${workspaceId}/dashboards/eligibility${query}`)
}

/* GET /workspaces/{workspaceId}/dashboards — 주간 대시보드 목록 조회 */
export async function getDashboards(workspaceId: string): Promise<DashboardListItemDto[]> {
  if (USE_MOCK_DASHBOARD) return INITIAL_DASHBOARD_LIST_MOCK
  return request<DashboardListItemDto[]>(`/workspaces/${workspaceId}/dashboards`)
}

/* GET /workspaces/{workspaceId}/dashboards/{dashboardId} — 주간 대시보드 상세 조회 */
export async function getDashboardDetail(
  workspaceId: string,
  dashboardId: string,
): Promise<DashboardDetailDto> {
  if (USE_MOCK_DASHBOARD) return weeklyDetailMock
  return request<DashboardDetailDto>(`/workspaces/${workspaceId}/dashboards/${dashboardId}`)
}

/* POST /workspaces/{workspaceId}/dashboards/{dashboardId}/reflection — 주간회고 작성 */
export async function createReflection(
  workspaceId: string,
  dashboardId: string,
  payload: CreateReflectionPayload,
): Promise<string> {
  if (USE_MOCK_DASHBOARD) {
    const weeklyReflectionId = `mock-reflection-${Date.now()}`
    weeklyDetailMock = {
      ...weeklyDetailMock,
      weeklyReflections: [
        { weeklyReflectionId, dashboardId, createdAt: new Date().toISOString(), ...payload },
      ],
    }
    return weeklyReflectionId
  }
  return request<string>(`/workspaces/${workspaceId}/dashboards/${dashboardId}/reflection`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* PATCH /workspaces/{workspaceId}/dashboards/{dashboardId}/reflection/{reflectionId} — 주간회고 수정 */
export async function updateReflection(
  workspaceId: string,
  dashboardId: string,
  reflectionId: string,
  payload: UpdateReflectionPayload,
): Promise<string> {
  if (USE_MOCK_DASHBOARD) {
    weeklyDetailMock = {
      ...weeklyDetailMock,
      weeklyReflections: weeklyDetailMock.weeklyReflections.map((r) =>
        r.weeklyReflectionId === reflectionId ? { ...r, ...payload } : r,
      ),
    }
    return reflectionId
  }
  return request<string>(
    `/workspaces/${workspaceId}/dashboards/${dashboardId}/reflection/${reflectionId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  )
}

/* GET /workspaces/{workspaceId}/dashboards/monthly/eligibility — 월간 대시보드 생성 조건 조회 */
export async function getMonthlyEligibility(
  workspaceId: string,
  baseDate?: string,
): Promise<MonthlyEligibilityDto> {
  if (USE_MOCK_DASHBOARD) return MONTHLY_ELIGIBILITY_MOCK
  const query = baseDate ? `?baseDate=${baseDate}` : ''
  return request<MonthlyEligibilityDto>(
    `/workspaces/${workspaceId}/dashboards/monthly/eligibility${query}`,
  )
}

/* GET /workspaces/{workspaceId}/dashboards/monthly — 월간 대시보드 목록 조회 */
export async function getMonthlyDashboards(workspaceId: string): Promise<DashboardListItemDto[]> {
  if (USE_MOCK_DASHBOARD) return INITIAL_MONTHLY_DASHBOARD_LIST_MOCK
  return request<DashboardListItemDto[]>(`/workspaces/${workspaceId}/dashboards/monthly`)
}

/* GET /workspaces/{workspaceId}/dashboards/monthly/{dashboardId} — 월간 대시보드 상세 조회 */
export async function getMonthlyDashboardDetail(
  workspaceId: string,
  dashboardId: string,
): Promise<DashboardDetailDto> {
  if (USE_MOCK_DASHBOARD) return monthlyDetailMock
  return request<DashboardDetailDto>(`/workspaces/${workspaceId}/dashboards/monthly/${dashboardId}`)
}

/* POST /workspaces/{workspaceId}/dashboards/monthly/{dashboardId}/reflection — 월간 회고 작성 */
export async function createMonthlyReflection(
  workspaceId: string,
  dashboardId: string,
  payload: CreateReflectionPayload,
): Promise<MonthlyReflectionResultDto> {
  if (USE_MOCK_DASHBOARD) {
    const weeklyReflectionId = `mock-reflection-${Date.now()}`
    const createdAt = new Date().toISOString()
    monthlyDetailMock = {
      ...monthlyDetailMock,
      weeklyReflections: [{ weeklyReflectionId, dashboardId, createdAt, ...payload }],
    }
    return { weeklyReflectionId, ...payload, createdAt }
  }
  return request<MonthlyReflectionResultDto>(
    `/workspaces/${workspaceId}/dashboards/monthly/${dashboardId}/reflection`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}

/* POST /workspaces/{workspaceId}/dashboards/drafts — 회고 draft 임시저장 */
export async function saveDraft(
  workspaceId: string,
  type: 'WEEKLY' | 'MONTHLY',
  dashboardId: string | undefined,
  payload: {
    workSummary: string
    resourcesUsed: string
    learning: string
    taskPlans: { content: string; expectedTime: string }[]
  },
): Promise<DraftDto> {
  const query = dashboardId ? `?type=${type}&dashboardId=${dashboardId}` : `?type=${type}`
  return request<DraftDto>(`/workspaces/${workspaceId}/dashboards/drafts${query}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* GET /workspaces/{workspaceId}/dashboards/drafts — 회고 draft 조회(복원) */
export async function getDraft(
  workspaceId: string,
  type: 'WEEKLY' | 'MONTHLY',
  dashboardId: string | undefined,
): Promise<DraftDto | null> {
  try {
    const query = dashboardId ? `?type=${type}&dashboardId=${dashboardId}` : `?type=${type}`
    return await request<DraftDto>(`/workspaces/${workspaceId}/dashboards/drafts${query}`)
  } catch {
    return null
  }
}

/* POST /ai/workspaces/{workspaceId}/dashboard/weekly — 주간 대시보드 AI 생성 */
export async function createDashboard(
  workspaceId: string,
  payload: CreateDashboardPayload,
): Promise<AiDashboardResultDto> {
  return request<AiDashboardResultDto>(`/ai/workspaces/${workspaceId}/dashboard/weekly`, {
    method: 'POST',
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(120_000),
  })
}

/* POST /ai/workspaces/{workspaceId}/dashboard/monthly — 월간 대시보드 AI 생성 */
export async function createMonthlyDashboard(
  workspaceId: string,
  payload: CreateDashboardPayload,
): Promise<AiDashboardResultDto> {
  return request<AiDashboardResultDto>(`/ai/workspaces/${workspaceId}/dashboard/monthly`, {
    method: 'POST',
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(120_000),
  })
}
