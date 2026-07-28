import type { DashboardDetailDto, DashboardListItemDto, EligibilityDto } from '@/types/dashboard'

export const INITIAL_ELIGIBILITY_MOCK: EligibilityDto = {
  eligible: true,
  journalDays: 5,
  requiredDays: 3,
  weekStart: '2026-06-15',
  weekEnd: '2026-06-21',
  entries: [
    { dailyEntryId: 'mock-entry-1', entryDate: '2026-06-15' },
    { dailyEntryId: 'mock-entry-2', entryDate: '2026-06-16' },
    { dailyEntryId: 'mock-entry-3', entryDate: '2026-06-17' },
    { dailyEntryId: 'mock-entry-4', entryDate: '2026-06-19' },
    { dailyEntryId: 'mock-entry-5', entryDate: '2026-06-20' },
  ],
}

export const INITIAL_DASHBOARD_LIST_MOCK: DashboardListItemDto[] = [
  {
    dashboardId: 'mock-dashboard-1',
    startDate: '2026-06-15',
    endDate: '2026-06-21',
    summary: '이번 주는 온보딩 리뉴얼에 집중했습니다.',
    createdAt: '2026-06-21T10:00:00.000Z',
  },
]

export const INITIAL_DASHBOARD_DETAIL_MOCK: DashboardDetailDto = {
  dashboardId: 'mock-dashboard-1',
  startDate: '2026-06-15',
  endDate: '2026-06-21',
  summary:
    '이번 주에는 온보딩 리뉴얼과 디자인 시스템 정비를 중심으로 구조 정리와 개선 기준을 수립했어요.',
  journalDays: 4,
  performanceCount: 65,
  tagCount: 9,
  insights: [{ journalDays: 4, performanceCount: 65, tagCount: 9 }],
  kpis: [{ kpiName: '1주차 핵심 액션 도달률', progress: '이탈 구간 3곳 중 2곳에서 80% 개선 완료' }],
  tagAnalyses: [
    {
      goal: '신규 사용자가 첫 주 안에 핵심 가치를 경험하도록 온보딩 흐름을 단순화해요.',
      expectedOutcome: '이탈 구간 3곳을 제거하고, 1주차 핵심 액션 도달률을 끌어올려요.',
      taskCount: 9,
      periodStart: '2026-06-02',
      periodEnd: '2026-06-27',
      achievementStatus: '이탈 구간 3곳 중 2곳에서 80% 개선을 완료했어요.',
    },
  ],
  weeklyReflections: [],
  performances: [
    {
      achievementRate: 65,
      summary: '온보딩 와이어프레임 12종을 정리하고 PM·디자이너 합의안을 도출했어요',
      growthInsight: '사용자 관점 검증의 중요성을 확인했어요',
      nextAction: 'Phase 1 프로토타입 사용자 테스트 진행',
      items: [{ output: 'onboarding-wireframes-v1.fig', impact: '합의안 도출 완료' }],
    },
  ],
}
