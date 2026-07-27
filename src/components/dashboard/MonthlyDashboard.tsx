import { MonthlyStatusCard } from './MonthlyStatusCard'
import { MonthlyWeekListPanel } from './MonthlyWeekListPanel'
import { WeeklySummaryInsight } from './WeeklySummaryInsight'
import { TagWorkflowSection } from './TagWorkflowSection'
import { WeeklyHighlights } from './WeeklyHighlights'
import { WeeklyRetrospective } from './WeeklyRetrospective'
import {
  DUMMY_WEEKS,
  DUMMY_MONTHLY_STATS,
  DUMMY_MONTHLY_AI_SUMMARY,
  DUMMY_MONTHLY_HIGHLIGHT,
  DUMMY_FOCUS_AREAS,
  DUMMY_MONTHLY_TAGS,
  DUMMY_MONTHLY_HIGHLIGHTS,
} from '@/mocks/monthlyDashboardMock'

// TODO(#66): API 연동 시 실제 주간 대시보드 현황으로 교체
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
