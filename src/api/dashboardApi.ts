import {
  INITIAL_DASHBOARD_DETAIL_MOCK,
  INITIAL_DASHBOARD_LIST_MOCK,
  INITIAL_ELIGIBILITY_MOCK,
} from '@/mocks/dashboardApiMock'
import type {
  CreateDashboardPayload,
  CreateReflectionPayload,
  DashboardDetailDto,
  DashboardListItemDto,
  EligibilityDto,
  UpdateReflectionPayload,
  WeeklyReflectionDto,
} from '@/types/dashboardApi'

export interface WeeklyReflectionDto {
  reflectionId: string
  workSummary: string
  resourcesUsed: string
  learning: string
}

export interface UpdateReflectionPayload {
  workSummary?: string
  resourcesUsed?: string
  learning?: string
}

let dashboardListStore: DashboardListItemDto[] = [...INITIAL_DASHBOARD_LIST_MOCK]
let dashboardDetailStore: DashboardDetailDto = { ...INITIAL_DASHBOARD_DETAIL_MOCK }

/* GET /dashboards/eligibility — 주간 대시보드 생성 조건 조회 */
export async function getDashboardEligibility(baseDate?: string): Promise<EligibilityDto> {
  void baseDate // TODO: 실제 API 연동 시 query param으로 전달
  return INITIAL_ELIGIBILITY_MOCK
}

/* GET /dashboards — 주간 대시보드 목록 조회 */
export async function getDashboards(): Promise<DashboardListItemDto[]> {
  return dashboardListStore
}

/* GET /dashboards/{dashboardId} — 주간 대시보드 상세 조회 */
export async function getDashboardDetail(dashboardId: string): Promise<DashboardDetailDto | null> {
  return dashboardDetailStore.dashboardId === dashboardId ? dashboardDetailStore : null
}

/* POST /dashboards — 주간 대시보드 생성(AI) */
export async function createDashboard(payload: CreateDashboardPayload): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const created: DashboardListItemDto = {
    dashboardId: crypto.randomUUID(),
    startDate: payload.startDate,
    endDate: payload.endDate,
    summary: dashboardDetailStore.summary,
    createdAt: new Date().toISOString(),
  }
  dashboardListStore = [...dashboardListStore, created]
  dashboardDetailStore = { ...dashboardDetailStore, dashboardId: created.dashboardId }
  return created.dashboardId
}

/* POST /dashboards/{dashboardId}/reflection — 주간회고 작성 */
export async function createReflection(
  dashboardId: string,
  payload: CreateReflectionPayload,
): Promise<string> {
  void dashboardId
  const reflectionId = crypto.randomUUID()
  const reflection: WeeklyReflectionDto = { reflectionId, ...payload }
  dashboardDetailStore = {
    ...dashboardDetailStore,
    weeklyReflections: [...dashboardDetailStore.weeklyReflections, reflection],
  }
  return reflectionId
}

/* PATCH /dashboards/{dashboardId}/reflection/{reflectionId} — 주간회고 수정 */
export async function updateReflection(
  dashboardId: string,
  reflectionId: string,
  payload: UpdateReflectionPayload,
): Promise<string> {
  void dashboardId
  dashboardDetailStore = {
    ...dashboardDetailStore,
    weeklyReflections: dashboardDetailStore.weeklyReflections.map((r) =>
      r.reflectionId === reflectionId ? { ...r, ...payload } : r,
    ),
  }
  return reflectionId
}
