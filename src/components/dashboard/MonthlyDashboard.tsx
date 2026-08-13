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
import { hexToTagColor } from '@/utils/tagMapper'

export type MonthlyGeneration = 'idle' | 'generating' | 'complete'

interface MonthlyDashboardProps {
  generation: MonthlyGeneration
  workspaceId: string
  onGenerate: () => void
  onGoWeekly: (weekId: string) => void
  eligibility: MonthlyEligibilityDto | null
  detail: DashboardDetailDto | null
  onReflectionSaved: () => void
}

const TAG_FALLBACK_COLORS: ProjectTagColor[] = ['green', 'pink', 'blue', 'orange']

const toDateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const toRangeLabel = (start: Date, end: Date) =>
  start.getTime() === end.getTime()
    ? `${start.getDate()}일`
    : `${start.getDate()}일 - ${end.getDate()}일`

const buildWeeks = (eligibility: MonthlyEligibilityDto): WeeklyBoardStatus[] => {
  const weeks: WeeklyBoardStatus[] = []
  const monthStart = new Date(`${eligibility.monthStart}T00:00:00`)
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
  const cursor = new Date(monthStart)
  let index = 0
  while (cursor <= monthEnd) {
    const weekStart = new Date(cursor)
    const weekEnd = new Date(cursor)
    weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()))
    if (weekEnd > monthEnd) weekEnd.setTime(monthEnd.getTime())
    const startStr = toDateString(weekStart)
    const endStr = toDateString(weekEnd)
    const matched = eligibility.weeklyDashboards.find((w) => {
      const [sy, sm, sd] = w.startDate.split('-').map(Number)
      const [ey, em, ed] = w.endDate.split('-').map(Number)
      const s = Date.UTC(sy, sm - 1, sd)
      const e = Date.UTC(ey, em - 1, ed)
      const durationDays = (e - s) / 86400000
      const isWeekly = durationDays >= 0 && durationDays <= 7

      return isWeekly && w.startDate >= startStr && w.startDate <= endStr
    })
    weeks.push({
      id: matched?.dashboardId ?? `pending-${startStr}`,
      weekLabel: `${weekStart.getMonth() + 1}월 ${index + 1}주차`,
      rangeLabel: toRangeLabel(weekStart, weekEnd),
      generated: Boolean(matched),
    })
    cursor.setTime(weekEnd.getTime())
    cursor.setDate(cursor.getDate() + 1)
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
  workspaceId,
  onReflectionSaved,
}: MonthlyDashboardProps) => {
  const weeks = eligibility ? buildWeeks(eligibility) : []
  const generatedCount = eligibility?.weeklyDashboardCount ?? 0
  const requiredCount = eligibility?.requiredCount ?? 3

  // 서버의 eligible 판정을 생성 조건으로 사용 (리뷰 반영)
  const status =
    generation !== 'idle' ? generation : eligibility?.eligible ? 'ready' : 'insufficient'

  if (status === 'complete') {
    if (!detail) return null // 생성 완료 직후 상세 수신 전 과도기 — 렌더 없음

    const stats = [
      { label: '일지 기록', value: String(detail.journalDays), unit: '일' },
      {
        label: '업무 완료율',
        value: String(
          detail.performances.length
            ? Math.round(
                detail.performances.reduce((sum, p) => sum + (p.achievementRate ?? 0), 0) /
                  detail.performances.length,
              )
            : 0,
        ),
        unit: '%',
      },
      { label: '사용된 프로젝트 태그', value: String(detail.tagCount), unit: '개' },
    ]

    const tags: TagWorkflow[] = detail.tagAnalyses.map((t, i) => ({
      id: t.tagId ?? `monthly-tag-${i}`,
      name: t.tagName ?? `프로젝트 태그 ${i + 1}`,
      color: t.color ? hexToTagColor(t.color) : TAG_FALLBACK_COLORS[i % TAG_FALLBACK_COLORS.length],
      count: t.taskCount ?? 0,
      purpose: t.goal,
      expectedResult: t.expectedOutcome,
      taskCount: `${t.taskCount ?? 0}건`,
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
      dailyEntryId: p.dailyEntryId ?? p.items[0]?.dailyEntryId,
    }))
    const focusAreas = detail.focusedTags?.map((ft, i) => ({
      label: ft.tagName,
      color: TAG_FALLBACK_COLORS[i % TAG_FALLBACK_COLORS.length],
    }))

    return (
      <div className="flex flex-1 flex-col gap-7">
        <WeeklySummaryInsight
          title="월간 요약 인사이트"
          stats={stats}
          aiSummary={detail.summary}
          monthlyHighlight={detail.keyAchievement}
          focusAreas={focusAreas}
        />
        <TagWorkflowSection tags={tags} period="monthly" />
        <WeeklyHighlights
          items={highlights}
          title="기타 업무 성과"
          description="프로젝트 태그가 없는 업무의 성과를 요약했어요"
        />
        {/* 월간 회고는 별도 API — 주간 회고(weeklyReflections)로 초기값을 채우지 않음 (리뷰 반영) */}
        <WeeklyRetrospective
          key={detail.dashboardId}
          period="monthly"
          workspaceId={workspaceId}
          dashboardId={detail.dashboardId}
          initialReflection={(() => {
            const list = detail.weeklyReflections
            if (!list?.length) return undefined
            const latest = [...list].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            )[0]
            return {
              reflectionId: latest.weeklyReflectionId,
              workSummary: latest.workSummary,
              resourcesUsed: latest.resourcesUsed,
              learning: latest.learning,
            }
          })()}
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
        periodLabel={eligibility ? `${Number(eligibility.monthStart.slice(5, 7))}월` : undefined}
      />
      <MonthlyWeekListPanel
        weeks={weeks}
        totalWeeks={weeks.length}
        onGoWeekly={onGoWeekly}
        periodLabel={eligibility ? `${Number(eligibility.monthStart.slice(5, 7))}월` : undefined}
      />
    </>
  )
}
