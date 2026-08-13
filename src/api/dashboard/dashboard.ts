import { ApiError, request } from '@/lib/httpClient'
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

/* GET /workspaces/{workspaceId}/dashboards/eligibility — 주간 대시보드 생성 조건 조회 */
export async function getDashboardEligibility(
  workspaceId: string,
  baseDate?: string,
): Promise<EligibilityDto> {
  const query = baseDate ? `?baseDate=${baseDate}` : ''
  return request<EligibilityDto>(`/workspaces/${workspaceId}/dashboards/eligibility${query}`)
}

/* GET /workspaces/{workspaceId}/dashboards — 주간 대시보드 목록 조회 */
export async function getDashboards(workspaceId: string): Promise<DashboardListItemDto[]> {
  return request<DashboardListItemDto[]>(`/workspaces/${workspaceId}/dashboards`)
}

/* GET /workspaces/{workspaceId}/dashboards/{dashboardId} — 주간 대시보드 상세 조회 */
export async function getDashboardDetail(
  workspaceId: string,
  dashboardId: string,
): Promise<DashboardDetailDto> {
  return request<DashboardDetailDto>(`/workspaces/${workspaceId}/dashboards/${dashboardId}`)
}

/* POST /workspaces/{workspaceId}/dashboards/{dashboardId}/reflection — 주간회고 작성 */
export async function createReflection(
  workspaceId: string,
  dashboardId: string,
  payload: CreateReflectionPayload,
): Promise<string> {
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
  const query = baseDate ? `?baseDate=${baseDate}` : ''
  return request<MonthlyEligibilityDto>(
    `/workspaces/${workspaceId}/dashboards/monthly/eligibility${query}`,
  )
}

/* GET /workspaces/{workspaceId}/dashboards/monthly/list — 월간 대시보드 목록 조회 */
export async function getMonthlyDashboards(workspaceId: string): Promise<DashboardListItemDto[]> {
  return request<DashboardListItemDto[]>(`/workspaces/${workspaceId}/dashboards/monthly/list`)
}

/* GET /workspaces/{workspaceId}/dashboards/monthly/{dashboardId} — 월간 대시보드 상세 조회 */
export async function getMonthlyDashboardDetail(
  workspaceId: string,
  dashboardId: string,
): Promise<DashboardDetailDto> {
  return request<DashboardDetailDto>(`/workspaces/${workspaceId}/dashboards/monthly/${dashboardId}`)
}

/* POST /workspaces/{workspaceId}/dashboards/monthly/{dashboardId}/reflection — 월간 회고 작성 */
export async function createMonthlyReflection(
  workspaceId: string,
  dashboardId: string,
  payload: CreateReflectionPayload,
): Promise<MonthlyReflectionResultDto> {
  return request<MonthlyReflectionResultDto>(
    `/workspaces/${workspaceId}/dashboards/monthly/${dashboardId}/reflection`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}

/* PATCH /workspaces/{workspaceId}/dashboards/monthly/{dashboardId}/reflection/{reflectionId} — 월간 회고 수정 */
export async function updateMonthlyReflection(
  workspaceId: string,
  dashboardId: string,
  reflectionId: string,
  payload: UpdateReflectionPayload,
): Promise<void> {
  await request<void>(
    `/workspaces/${workspaceId}/dashboards/monthly/${dashboardId}/reflection/${reflectionId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  )
}

/* POST /workspaces/{workspaceId}/dashboards/drafts — 회고 draft 임시저장 */
export async function saveDraft(
  workspaceId: string,
  type: 'WEEKLY' | 'MONTHLY',
  periodStart: string,
  dashboardId: string | undefined,
  payload: {
    workSummary: string
    resourcesUsed: string
    learning: string
    taskPlans: { content: string; expectedTime: string }[]
  },
): Promise<DraftDto> {
  const query = dashboardId
    ? `?type=${type}&periodStart=${periodStart}&dashboardId=${dashboardId}`
    : `?type=${type}&periodStart=${periodStart}`
  return request<DraftDto>(`/workspaces/${workspaceId}/dashboards/drafts${query}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/* GET /workspaces/{workspaceId}/dashboards/drafts — 회고 draft 조회(복원) */
export async function getDraft(
  workspaceId: string,
  type: 'WEEKLY' | 'MONTHLY',
  periodStart: string,
  dashboardId: string | undefined,
): Promise<DraftDto | null> {
  try {
    const query = dashboardId
      ? `?type=${type}&periodStart=${periodStart}&dashboardId=${dashboardId}`
      : `?type=${type}&periodStart=${periodStart}`
    return await request<DraftDto>(`/workspaces/${workspaceId}/dashboards/drafts${query}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
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

export const dashboardQueryKeys = {
  all: ['dashboards'] as const,

  workspace: (workspaceId: string) => [...dashboardQueryKeys.all, workspaceId] as const,

  weeklyEligibility: (workspaceId: string, baseDate: string) =>
    [...dashboardQueryKeys.workspace(workspaceId), 'weekly-eligibility', baseDate] as const,

  weeklyList: (workspaceId: string) =>
    [...dashboardQueryKeys.workspace(workspaceId), 'weekly-list'] as const,

  weeklyDetail: (workspaceId: string, dashboardId: string) =>
    [...dashboardQueryKeys.workspace(workspaceId), 'weekly-detail', dashboardId] as const,

  monthlyEligibility: (workspaceId: string, baseDate: string) =>
    [...dashboardQueryKeys.workspace(workspaceId), 'monthly-eligibility', baseDate] as const,

  monthlyList: (workspaceId: string) =>
    [...dashboardQueryKeys.workspace(workspaceId), 'monthly-list'] as const,

  monthlyDetail: (workspaceId: string, dashboardId: string) =>
    [...dashboardQueryKeys.workspace(workspaceId), 'monthly-detail', dashboardId] as const,
}
