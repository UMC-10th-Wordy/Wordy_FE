import { MonthlyStatusCard } from './MonthlyStatusCard'
import { MonthlyWeekListPanel } from './MonthlyWeekListPanel'
import { WeeklySummaryInsight } from './WeeklySummaryInsight'
import { TagWorkflowSection } from './TagWorkflowSection'
import { WeeklyHighlights } from './WeeklyHighlights'
import { WeeklyRetrospective } from './WeeklyRetrospective'
import type { WeeklyBoardStatus } from './MonthlyWeekListPanel'
import type { TagWorkflow } from './TagWorkflowSection'

// TODO(#66): API 연동 시 실제 주간 대시보드 현황으로 교체
export const DUMMY_WEEKS: WeeklyBoardStatus[] = [
  { id: 'w1', weekLabel: '6월 1주차', rangeLabel: '6월 1일 - 6월 6일', generated: true },
  { id: 'w2', weekLabel: '6월 2주차', rangeLabel: '6월 7일 - 6월 13일', generated: true },
  { id: 'w3', weekLabel: '6월 3주차', rangeLabel: '6월 14일 - 6월 20일', generated: true },
  { id: 'w4', weekLabel: '6월 4주차', rangeLabel: '6월 21일 - 6월 27일', generated: true },
  { id: 'w5', weekLabel: '6월 5주차', rangeLabel: '6월 28일 - 6월 30일', generated: true },
]

// TODO(#66): API 연동 시 월간 생성 결과로 교체
const DUMMY_MONTHLY_STATS = [
  { label: '일지 기록', value: '26', unit: '일' },
  { label: '업무 완료율', value: '85', unit: '%' },
  { label: '사용된 프로젝트 태그', value: '16', unit: '개' },
]

const DUMMY_MONTHLY_AI_SUMMARY =
  '이번 달은 제품 전략 정렬과 디자인 시스템 V2를 중심으로 움직였어요. 회의 준비와 회고 작성의 밀도가 높았고, 특히 월 중반 이후 의사결정 속도가 빨라졌어요. 반면 리서치 영역은 일정상 후순위로 밀려 다음 달 우선 보완이 필요해 보이네요.'

const DUMMY_MONTHLY_HIGHLIGHT = 'OKR 회고 정리 · DS V2 70% 진척'

const DUMMY_FOCUS_AREAS = [
  { label: '제품 기획', color: 'green' as const },
  { label: '디자인 시스템', color: 'pink' as const },
]

// TODO(#66): 주간과 동일 더미 재사용. API 연동 시 월간 집계로 교체
const DUMMY_MONTHLY_TAGS: TagWorkflow[] = [
  {
    id: 'onboarding',
    name: '온보딩 리뉴얼',
    color: 'green',
    count: 9,
    purpose: '신규 사용자가 첫 주 안에 핵심 가치를 경험하도록 온보딩 흐름을 단순화해요.',
    expectedResult: '이탈 구간 3곳을 제거하고, 1주차 핵심 액션 도달률을 끌어올려요.',
    taskCount: '9건',
    period: '26.06.02 - 26.06.27',
    achievement: '이탈 구간 3곳 중 2곳에서 80% 개선을 완료했어요.',
    kpis: [
      {
        title: '1주차 핵심 액션 도달률',
        description: '온보딩 진입 동선을 2단계 단축해 핵심 액션 도달까지의 마찰을 줄이는 중이에요',
        highlights: [
          '온보딩 와이어프레임 12종 정리, PM·디자이너 합의안 도출 완료',
          'Phase 1 프로토타입 70% 진척, 7월 사용자 테스트 일정 확정',
        ],
        files: ['onboarding-Lo-fiwireframes-v1.fig', 'Q2 인터뷰 정리.md', 'okr-recap.pdf'],
      },
      {
        title: '이탈 지점 개선',
        description:
          '이탈 구간 3곳을 인터뷰·로그 데이터로 교차 검증하고 개선안을 반영하는 단계예요',
        highlights: ['기존 온보딩 이탈 지점 3가지를 인터뷰·로그 데이터로 교차 검증 완료'],
        files: [],
      },
    ],
  },
  {
    id: 'design-system',
    name: '디자인 시스템 V2',
    color: 'pink',
    count: 8,
    purpose: '컴포넌트 일관성을 확보해 개발·디자인 협업 비용을 줄여요.',
    expectedResult: '공용 컴포넌트 커버리지를 80% 이상으로 올려요.',
    taskCount: '8건',
    period: '26.06.02 - 26.06.27',
    achievement: '핵심 컴포넌트 정비를 70% 완료했어요.',
    kpis: [
      {
        title: '공용 컴포넌트 커버리지',
        description: '페이지 전반의 컴포넌트 일관성을 확보하는 단계예요',
        highlights: ['핵심 컴포넌트 12종 중 8종 정비 완료, 나머지 4종 이번 주 착수'],
        files: ['design-system-v2-audit.md'],
      },
    ],
  },
]

const DUMMY_MONTHLY_HIGHLIGHTS = [
  {
    text: '온보딩 와이어프레임 12종을 정리하고 PM·디자이너 합의안을 도출했어요',
    source: '2026년 6월 11일 업무 일지',
  },
  {
    text: '기존 온보딩 이탈 지점 3가지를 인터뷰·로그 데이터로 교차 검증했어요',
    source: '2026년 6월 13일 업무 일지',
  },
  {
    text: 'Phase 1 프로토타입을 70% 진척시켰고 7월 사용자 테스트 일정을 확정했어요',
    source: '2026년 6월 12일 업무 일지',
  },
]

const REQUIRED_WEEKLY_COUNT = 3

export type MonthlyGeneration = 'idle' | 'generating' | 'complete'

interface MonthlyDashboardProps {
  generation: MonthlyGeneration
  onGenerate: () => void
  onGoWeekly: (weekId: string) => void
}

export const MonthlyDashboard = ({ generation, onGenerate, onGoWeekly }: MonthlyDashboardProps) => {
  const generatedCount = DUMMY_WEEKS.filter((w) => w.generated).length

  const status =
    generation !== 'idle'
      ? generation
      : generatedCount >= REQUIRED_WEEKLY_COUNT
        ? 'ready'
        : 'insufficient'

  if (status === 'complete') {
    return (
      <div className="flex flex-1 flex-col gap-7">
        <WeeklySummaryInsight
          title="월간 요약 인사이트"
          stats={DUMMY_MONTHLY_STATS}
          aiSummary={DUMMY_MONTHLY_AI_SUMMARY}
          monthlyHighlight={DUMMY_MONTHLY_HIGHLIGHT}
          focusAreas={DUMMY_FOCUS_AREAS}
        />
        <TagWorkflowSection tags={DUMMY_MONTHLY_TAGS} period="monthly" />
        <WeeklyHighlights
          items={DUMMY_MONTHLY_HIGHLIGHTS}
          title="이번 달 성과 요약"
          description="프로젝트 태그가 없는 업무의 성과를 요약했어요"
        />
        <WeeklyRetrospective period="monthly" />
      </div>
    )
  }

  return (
    <>
      <MonthlyStatusCard
        status={status === 'generating' ? 'generating' : status}
        generatedCount={generatedCount}
        onGenerate={onGenerate}
      />
      <MonthlyWeekListPanel
        weeks={DUMMY_WEEKS}
        totalWeeks={DUMMY_WEEKS.length}
        onGoWeekly={onGoWeekly}
      />
    </>
  )
}
