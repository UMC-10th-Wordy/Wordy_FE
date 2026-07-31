import { MonthlyStatusCard } from './MonthlyStatusCard'
import { MonthlyWeekListPanel } from './MonthlyWeekListPanel'
import { WeeklySummaryInsight } from './WeeklySummaryInsight'
import { TagWorkflowSection } from './TagWorkflowSection'
import { WeeklyHighlights } from './WeeklyHighlights'
import { WeeklyRetrospective } from './WeeklyRetrospective'
import type { DashboardDetailDto, MonthlyEligibilityDto } from '@/types/dashboard'
import type { WeeklyBoardStatus } from './MonthlyWeekListPanel'
import type { TagWorkflow } from './TagWorkflowSection'
import type { ProjectTagColor } from '@/components/todo/ProjectTag'

export type MonthlyGeneration = 'idle' | 'generating' | 'complete'

interface MonthlyDashboardProps {
  generation: MonthlyGeneration
  onGenerate: () => void
  onGoWeekly: (weekId: string) => void
  eligibility: MonthlyEligibilityDto | null
  detail: DashboardDetailDto | null
  onReflectionSaved: () => void
  requiredCount: number
}

const TAG_FALLBACK_COLORS: ProjectTagColor[] = ['green', 'pink', 'blue', 'orange']

const toDateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const toRangeLabel = (start: Date, end: Date) =>
  `${start.getMonth() + 1}월 ${start.getDate()}일 - ${end.getMonth() + 1}월 ${end.getDate()}일`

// monthStart~monthEnd 전체를 7일 단위 주차로 나누고, 생성된 대시보드가 있는 주차만 generated 표시
const buildWeeks = (eligibility: MonthlyEligibilityDto): WeeklyBoardStatus[] => {
  const weeks: WeeklyBoardStatus[] = []
  const monthEnd = new Date(`${eligibility.monthEnd}T00:00:00`)
  const cursor = new Date(`${eligibility.monthStart}T00:00:00`)
  let index = 0
  while (cursor <= monthEnd) {
    const weekStart = new Date(cursor)
    const weekEnd = new Date(cursor)
    weekEnd.setDate(weekEnd.getDate() + 6)
    if (weekEnd > monthEnd) weekEnd.setTime(monthEnd.getTime())
    const startStr = toDateString(weekStart)
    const endStr = toDateString(weekEnd)
    const matched = eligibility.weeklyDashboards.find(
      (w) => w.startDate >= startStr && w.startDate <= endStr,
    )
    weeks.push({
      id: matched?.dashboardId ?? `pending-${startStr}`,
      weekLabel: `${weekStart.getMonth() + 1}월 ${index + 1}주차`,
      rangeLabel: toRangeLabel(weekStart, weekEnd),
      generated: Boolean(matched),
    })
    cursor.setDate(cursor.getDate() + 7)
    index += 1
  }
  return weeks
}

export const MonthlyDashboard = ({
  generation,
  onGenerate,
  onGoWeekly,
  eligibility,
  detail,
  onReflectionSaved,
  requiredCount,
}: MonthlyDashboardProps) => {
  const weeks = eligibility ? buildWeeks(eligibility) : []
  const generatedCount = eligibility?.weeklyDashboardCount ?? 0

  // 서버의 eligible 판정을 생성 조건으로 사용 (리뷰 반영)
  const status =
    generation !== 'idle' ? generation : eligibility?.eligible ? 'ready' : 'insufficient'

  if (status === 'complete') {
    if (!detail) return null // 생성 완료 직후 상세 수신 전 과도기 — 렌더 없음

    const stats = [
      { label: '일지 기록', value: String(detail.journalDays), unit: '일' },
      { label: '성과 업무', value: String(detail.performanceCount), unit: '개' },
      { label: '사용된 프로젝트 태그', value: String(detail.tagCount), unit: '개' },
    ]
    // TODO: 스키마에 태그 식별자가 없어 전체 KPI를 태그마다 표시 중 — 태그별 KPI 매핑은 백엔드 스키마 확장 후 반영
    const tags: TagWorkflow[] = detail.tagAnalyses.map((t, i) => ({
      id: `monthly-tag-${i}`,
      name: `프로젝트 태그 ${i + 1}`, // TODO: 스키마에 태그명 없음 — 백엔드 확인 중
      color: TAG_FALLBACK_COLORS[i % TAG_FALLBACK_COLORS.length],
      count: t.taskCount,
      purpose: t.goal,
      expectedResult: t.expectedOutcome,
      taskCount: `${t.taskCount}건`,
      period: `${t.periodStart} - ${t.periodEnd}`,
      achievement: t.achievementStatus,
      kpis: detail.kpis.map((k) => ({
        title: k.kpiName,
        description: k.progress,
        highlights: [],
        files: [],
      })),
    }))
    const highlights = detail.performances.map((p) => ({
      text: p.summary,
      source: p.items[0]?.output ?? '업무 일지',
    }))

    return (
      <div className="flex flex-1 flex-col gap-7">
        <WeeklySummaryInsight title="월간 요약 인사이트" stats={stats} aiSummary={detail.summary} />
        <TagWorkflowSection tags={tags} period="monthly" />
        <WeeklyHighlights
          items={highlights}
          title="이번 달 성과 요약"
          description="프로젝트 태그가 없는 업무의 성과를 요약했어요"
        />
        {/* 월간 회고는 별도 API — 주간 회고(weeklyReflections)로 초기값을 채우지 않음 (리뷰 반영) */}
        <WeeklyRetrospective
          period="monthly"
          dashboardId={detail.dashboardId}
          onSaved={onReflectionSaved}
        />
      </div>
    )
  }

  return (
    <>
      <MonthlyStatusCard
        status={status === 'generating' ? 'generating' : status}
        generatedCount={generatedCount}
        onGenerate={onGenerate}
        requiredCount={requiredCount}
      />
      <MonthlyWeekListPanel weeks={weeks} totalWeeks={weeks.length} onGoWeekly={onGoWeekly} />
    </>
  )
}
