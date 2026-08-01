import type {
  DashboardDetailDto,
  DashboardListItemDto,
  EligibilityDto,
  MonthlyEligibilityDto,
} from '@/types/dashboard'

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

export const MONTHLY_ELIGIBILITY_MOCK: MonthlyEligibilityDto = {
  eligible: true,
  weeklyDashboardCount: 3,
  requiredCount: 3,
  monthStart: '2026-06-01',
  monthEnd: '2026-06-30',
  weeklyDashboards: [
    {
      dashboardId: 'mock-dashboard-w1',
      startDate: '2026-06-01',
      endDate: '2026-06-07',
      summary: '온보딩 리뉴얼 킥오프와 디자인 시스템 정비 범위를 정리했습니다.',
    },
    {
      dashboardId: 'mock-dashboard-w2',
      startDate: '2026-06-08',
      endDate: '2026-06-14',
      summary: '기존 온보딩 이탈 지점을 인터뷰·로그 데이터로 교차 검증했습니다.',
    },
    {
      dashboardId: 'mock-dashboard-1',
      startDate: '2026-06-15',
      endDate: '2026-06-21',
      summary: '이번 주는 온보딩 리뉴얼에 집중했습니다.',
    },
  ],
}

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
  kpis: [
    {
      kpiName: '1주차 핵심 액션 도달률',
      progress: '온보딩 진입 동선을 2단계 단축해 핵심 액션 도달까지의 마찰을 줄이는 중이에요',
    },
    {
      kpiName: '이탈 지점 개선',
      progress: '이탈 구간 3곳을 인터뷰·로그 데이터로 교차 검증하고 개선안을 반영하는 단계예요',
    },
    {
      kpiName: '사용자 테스트 준비 상태',
      progress: '테스트 시나리오 5종의 초안을 작성하고, 모집 기준과 측정 항목을 정의하는 단계예요',
    },
  ],
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
      items: [{ output: '2026년 6월 11일 업무 일지', impact: '합의안 도출 완료' }],
    },
    {
      achievementRate: 65,
      summary: '기존 온보딩 이탈 지점 3가지를 인터뷰·로그 데이터로 교차 검증했어요',
      growthInsight: '사용자 관점 검증의 중요성을 확인했어요',
      nextAction: '이탈 구간 개선안 반영',
      items: [{ output: '2026년 6월 13일 업무 일지', impact: '이탈 지점 교차 검증 완료' }],
    },
    {
      achievementRate: 65,
      summary: 'Phase 1 프로토타입을 70% 진척시켰고 7월 사용자 테스트 일정을 확정했어요',
      growthInsight: '사용자 관점 검증의 중요성을 확인했어요',
      nextAction: '7월 사용자 테스트 진행',
      items: [{ output: '2026년 6월 12일 업무 일지', impact: '사용자 테스트 일정 확정' }],
    },
  ],
}

export const INITIAL_MONTHLY_DASHBOARD_DETAIL_MOCK: DashboardDetailDto = {
  dashboardId: 'mock-monthly-dashboard-1',
  startDate: '2026-06-01',
  endDate: '2026-06-30',
  summary:
    '이번 달은 제품 전략 정렬과 디자인 시스템 V2를 중심으로 움직였어요. 회의 준비와 회고 작성의 밀도가 높았고, 특히 월 중반 이후 의사결정 속도가 빨라졌어요. 반면 리서치 영역은 일정상 후순위로 밀려 다음 달 우선 보완이 필요해 보이네요.',
  journalDays: 26,
  performanceCount: 85,
  tagCount: 16,
  insights: [{ journalDays: 26, performanceCount: 85, tagCount: 16 }],
  kpis: [
    {
      kpiName: '1주차 핵심 액션 도달률',
      progress: '온보딩 진입 동선을 2단계 단축해 핵심 액션 도달까지의 마찰을 줄이는 중이에요',
    },
    {
      kpiName: '이탈 지점 개선',
      progress: '이탈 구간 3곳을 인터뷰·로그 데이터로 교차 검증하고 개선안을 반영하는 단계예요',
    },
    {
      kpiName: '사용자 테스트 준비 상태',
      progress: '테스트 시나리오 5종의 초안을 작성하고, 모집 기준과 측정 항목을 정의하는 단계예요',
    },
  ],
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
      achievementRate: 85,
      summary: '온보딩 와이어프레임 12종을 정리하고 PM·디자이너 합의안을 도출했어요',
      growthInsight: '사용자 관점 검증의 중요성을 확인했어요',
      nextAction: 'Phase 1 프로토타입 사용자 테스트 진행',
      items: [{ output: '2026년 6월 11일 업무 일지', impact: '합의안 도출 완료' }],
    },
    {
      achievementRate: 85,
      summary: '기존 온보딩 이탈 지점 3가지를 인터뷰·로그 데이터로 교차 검증했어요',
      growthInsight: '사용자 관점 검증의 중요성을 확인했어요',
      nextAction: '이탈 구간 개선안 반영',
      items: [{ output: '2026년 6월 13일 업무 일지', impact: '이탈 지점 교차 검증 완료' }],
    },
    {
      achievementRate: 85,
      summary: 'Phase 1 프로토타입을 70% 진척시켰고 7월 사용자 테스트 일정을 확정했어요',
      growthInsight: '사용자 관점 검증의 중요성을 확인했어요',
      nextAction: '7월 사용자 테스트 진행',
      items: [{ output: '2026년 6월 12일 업무 일지', impact: '사용자 테스트 일정 확정' }],
    },
  ],
}
