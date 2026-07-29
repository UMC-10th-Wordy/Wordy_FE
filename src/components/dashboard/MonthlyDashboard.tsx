import { MonthlyStatusCard } from './MonthlyStatusCard'
import { MonthlyWeekListPanel } from './MonthlyWeekListPanel'
import { WeeklySummaryInsight } from './WeeklySummaryInsight'
import { TagWorkflowSection } from './TagWorkflowSection'
import { WeeklyHighlights } from './WeeklyHighlights'
import { WeeklyRetrospective } from './WeeklyRetrospective'
import type { DashboardDetailDto, MonthlyEligibilityDto } from '@/types/dashboard'
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
}

const TAG_FALLBACK_COLORS: ProjectTagColor[] = ['green', 'pink', 'blue', 'orange']

// startDate(YYYY-MM-DD) → "M월 N주차" / "M월 D일 - M월 D일" 라벨
const toWeekLabel = (startDate: string, index: number) => {
  const month = Number(startDate.split('-')[1])
  return `${month}월 ${index + 1}주차`
}
const toRangeLabel = (startDate: string, endDate: string) => {
  const [, sm, sd] = startDate.split('-').map(Number)
  const [, em, ed] = endDate.split('-').map(Number)
  return `${sm}월 ${sd}일 - ${em}월 ${ed}일`
}

export const MonthlyDashboard = ({
  generation,
  onGenerate,
  onGoWeekly,
  eligibility,
  detail,
  onReflectionSaved,
}: MonthlyDashboardProps) => {
  const weeks = (eligibility?.weeklyDashboards ?? []).map((w, i) => ({
    id: w.dashboardId,
    weekLabel: toWeekLabel(w.startDate, i),
    rangeLabel: toRangeLabel(w.startDate, w.endDate),
    generated: true,
  }))
  const generatedCount = eligibility?.weeklyDashboardCount ?? 0
  const requiredCount = eligibility?.requiredCount ?? 3

  const status =
    generation !== 'idle' ? generation : generatedCount >= requiredCount ? 'ready' : 'insufficient'

  if (status === 'complete' && detail) {
    const stats = [
      { label: '일지 기록', value: String(detail.journalDays), unit: '일' },
      { label: '업무 완료율', value: String(detail.performanceCount), unit: '%' },
      { label: '사용된 프로젝트 태그', value: String(detail.tagCount), unit: '개' },
    ]
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
        <WeeklyRetrospective
          period="monthly"
          dashboardId={detail.dashboardId}
          initialReflection={detail.weeklyReflections[0]}
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
      />
      <MonthlyWeekListPanel weeks={weeks} totalWeeks={weeks.length} onGoWeekly={onGoWeekly} />
    </>
  )
}
