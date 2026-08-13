import { useEffect, useMemo, useState } from 'react'
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?react'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/common/Toast/ToastContainer'
import { ErrorState, LoadingState } from '@/components/common/AsyncState/AsyncState'
import { WeeklyStatusCard } from '@/components/dashboard/WeeklyStatusCard'
import { DiaryChecklistPanel } from '@/components/dashboard/DiaryChecklistPanel'
import { WeeklySummaryInsight } from '@/components/dashboard/WeeklySummaryInsight'
import { TagWorkflowSection } from '@/components/dashboard/TagWorkflowSection'
import { WeeklyHighlights } from '@/components/dashboard/WeeklyHighlights'
import { WeeklyRetrospective } from '@/components/dashboard/WeeklyRetrospective'
import { MonthlyDashboard } from '@/components/dashboard/MonthlyDashboard'
import type { TagWorkflow } from '@/components/dashboard/TagWorkflowSection'
import type { WeeklyDashboardStatus } from '@/types/dashboard'
import type { ProjectTagColor } from '@/components/todo/ProjectTag'
import { hexToTagColor } from '@/utils/tagMapper'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'
import {
  useCreateMonthlyDashboard,
  useCreateWeeklyDashboard,
  useMonthlyDashboardDetail,
  useMonthlyDashboards,
  useMonthlyEligibility,
  useWeeklyDashboardDetail,
  useWeeklyDashboards,
  useWeeklyEligibility,
} from '@/hooks/useDashboardQueries'

// 서버 entryDate(YYYY-MM-DD) → 화면 라벨(YYYY년 M월 D일 X요일)
const formatEntryLabel = (dateStr: string) => {
  const date = new Date(`${dateStr}T00:00:00`)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`
}

const TAG_FALLBACK_COLORS: ProjectTagColor[] = ['green', 'pink', 'blue', 'orange']

const getTeamWeekStart = (date: Date) => {
  const sunday = new Date(date)
  sunday.setDate(sunday.getDate() - sunday.getDay())
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
  return sunday < monthStart ? monthStart : sunday
}
const getTeamWeekEnd = (start: Date) => {
  const saturday = new Date(start)
  saturday.setDate(saturday.getDate() + (6 - saturday.getDay()))
  const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0)
  return saturday > lastDay ? lastDay : saturday
}
const toDateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const DashboardPage = () => {
  const workspaceId = useActiveWorkspaceId()
  const { toasts, addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  // 백엔드가 주/월 대시보드를 "주어진 기간의 것 조회, 없으면 생성" 형태로 제공하지 않아
  // 이번 세션에서 새로 생성한 대시보드 id를 별도로 들고 있다가 상세 조회에 우선 사용함
  const [createdWeeklyDashboardId, setCreatedWeeklyDashboardId] = useState<string | undefined>()
  const [createdMonthlyDashboardId, setCreatedMonthlyDashboardId] = useState<string | undefined>()

  const [weekStartDate, setWeekStartDate] = useState(() => getTeamWeekStart(new Date()))
  const weekLabel = `${weekStartDate.getFullYear()}년 ${weekStartDate.getMonth() + 1}월 ${Math.ceil((weekStartDate.getDate() + new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), 1).getDay()) / 7)}주차`
  const baseDate = toDateString(weekStartDate)
  const viewedEnd = toDateString(getTeamWeekEnd(weekStartDate))

  const [monthOffset, setMonthOffset] = useState(0)
  const [monthAnchor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const selectedMonth = new Date(monthAnchor)
  selectedMonth.setMonth(selectedMonth.getMonth() + monthOffset)
  const monthBaseDate = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-01`
  const monthLabel = `${selectedMonth.getFullYear()}년 ${selectedMonth.getMonth() + 1}월`

  const weeklyEligibilityQuery = useWeeklyEligibility(workspaceId, baseDate)
  const weeklyListQuery = useWeeklyDashboards(workspaceId, true)
  const savedWeeklyDashboardId = useMemo(() => {
    const eligibility = weeklyEligibilityQuery.data
    const list = weeklyListQuery.data
    if (!eligibility || !list) return undefined
    // 서버가 요청과 다른 주를 반환하면(현 BaseDate 버그) 복원하지 않음 — 보는 주와 응답 주가 겹칠 때만 복원
    if (eligibility.weekStart !== baseDate || eligibility.weekEnd !== viewedEnd) return undefined
    return list.find((d) => d.startDate === eligibility.weekStart)?.dashboardId
  }, [weeklyEligibilityQuery.data, weeklyListQuery.data, baseDate, viewedEnd])
  const weeklyDetailQuery = useWeeklyDashboardDetail(
    workspaceId,
    createdWeeklyDashboardId ?? savedWeeklyDashboardId,
  )
  const createWeeklyMutation = useCreateWeeklyDashboard(workspaceId)

  const monthlyEligibilityQuery = useMonthlyEligibility(
    workspaceId,
    monthBaseDate,
    activeTab === 'monthly',
  )
  const monthlyListQuery = useMonthlyDashboards(workspaceId, activeTab === 'monthly')
  const savedMonthlyDashboardId = useMemo(() => {
    const list = monthlyListQuery.data
    if (!list) return undefined
    return list.find((d) => d.startDate.slice(0, 7) === monthBaseDate.slice(0, 7))?.dashboardId
  }, [monthlyListQuery.data, monthBaseDate])
  const monthlyDetailQuery = useMonthlyDashboardDetail(
    workspaceId,
    createdMonthlyDashboardId ?? savedMonthlyDashboardId,
  )
  const createMonthlyMutation = useCreateMonthlyDashboard(workspaceId)

  useEffect(() => {
    if (!weeklyEligibilityQuery.data) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIds(weeklyEligibilityQuery.data.entries.map((e) => e.dailyEntryId))
  }, [weeklyEligibilityQuery.data])

  useEffect(() => {
    if (!weeklyEligibilityQuery.isError) return
    console.error('생성 조건 조회 실패:', weeklyEligibilityQuery.error)
  }, [weeklyEligibilityQuery.isError, weeklyEligibilityQuery.error])

  useEffect(() => {
    if (!monthlyEligibilityQuery.isError) return
    console.error('월간 생성 조건 조회 실패:', monthlyEligibilityQuery.error)
  }, [monthlyEligibilityQuery.isError, monthlyEligibilityQuery.error])

  useEffect(() => {
    if (!weeklyListQuery.isError) return
    console.error('주간 대시보드 목록 조회 실패:', weeklyListQuery.error)
  }, [weeklyListQuery.isError, weeklyListQuery.error])

  useEffect(() => {
    if (!monthlyListQuery.isError) return
    console.error('월간 대시보드 목록 조회 실패:', monthlyListQuery.error)
  }, [monthlyListQuery.isError, monthlyListQuery.error])

  const entries = useMemo(
    () =>
      (weeklyEligibilityQuery.data?.entries ?? []).map((e) => ({
        id: e.dailyEntryId,
        label: formatEntryLabel(e.entryDate),
        converted: e.converted,
        date: e.entryDate,
      })),
    [weeklyEligibilityQuery.data],
  )
  const requiredCount = weeklyEligibilityQuery.data?.requiredDays ?? 3
  const weekRange = {
    start: weeklyEligibilityQuery.data?.weekStart ?? '',
    end: weeklyEligibilityQuery.data?.weekEnd ?? '',
  }
  const isWeeklyLoading = weeklyEligibilityQuery.isLoading
  const detail = weeklyDetailQuery.data ?? null
  const isCreatingWeeklyDetail =
    !!createdWeeklyDashboardId && !weeklyDetailQuery.data && !weeklyDetailQuery.isError
  const generation: 'idle' | 'generating' | 'complete' =
    createWeeklyMutation.isPending || isCreatingWeeklyDetail
      ? 'generating'
      : detail
        ? 'complete'
        : 'idle'

  const monthlyEligibility = monthlyEligibilityQuery.data ?? null
  const isMonthlyLoading = monthlyEligibilityQuery.isLoading
  const monthlyDetail = monthlyDetailQuery.data ?? null
  const isCreatingMonthlyDetail =
    !!createdMonthlyDashboardId && !monthlyDetailQuery.data && !monthlyDetailQuery.isError
  const monthlyGeneration: 'idle' | 'generating' | 'complete' =
    createMonthlyMutation.isPending || isCreatingMonthlyDetail
      ? 'generating'
      : monthlyDetail
        ? 'complete'
        : 'idle'

  const totalDays = entries.length

  // 상세 응답(DTO) → 화면 모델 매핑
  const stats = detail
    ? [
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
    : []
  const aiSummary = detail?.summary ?? ''
  const tags: TagWorkflow[] = detail
    ? detail.tagAnalyses.map((t, i) => ({
        id: t.tagId ?? `tag-${i}`,
        name: t.tagName ?? `프로젝트 태그 ${i + 1}`,
        color: t.color
          ? hexToTagColor(t.color)
          : TAG_FALLBACK_COLORS[i % TAG_FALLBACK_COLORS.length],
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
    : []
  const highlights = detail
    ? detail.performances.map((p) => {
        const entryDate = entries.find((e) => e.id === p.dailyEntryId)?.date
        const sourceLabel = entryDate
          ? `${new Date(`${entryDate}T00:00:00`).getFullYear()}년 ${new Date(`${entryDate}T00:00:00`).getMonth() + 1}월 ${new Date(`${entryDate}T00:00:00`).getDate()}일 업무 일지`
          : '업무 일지'
        return { text: p.summary, source: sourceLabel, dailyEntryId: p.dailyEntryId }
      })
    : []

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }

  const handleGenerate = () => {
    if (generation === 'generating') return
    if (!weekRange.start || !weekRange.end) {
      addToast('생성 조건을 불러오지 못했어요. 잠시 후 다시 시도해 주세요')
      return
    }
    createWeeklyMutation.mutate(
      { startDate: weekRange.start, endDate: weekRange.end },
      {
        onSuccess: (created) => setCreatedWeeklyDashboardId(created.dashboardId),
        onError: (error) => {
          console.error('대시보드 생성 실패:', error)
          addToast('대시보드 생성에 실패했어요. 다시 시도해 주세요')
        },
      },
    )
  }

  const handleMonthlyGenerate = () => {
    if (monthlyGeneration === 'generating') return
    if (!monthlyEligibility?.eligible) {
      addToast('아직 생성 조건을 충족하지 못했어요')
      return
    }
    createMonthlyMutation.mutate(
      { startDate: monthlyEligibility.monthStart, endDate: monthlyEligibility.monthEnd },
      {
        onSuccess: (created) => setCreatedMonthlyDashboardId(created.dashboardId),
        onError: (error) => {
          console.error('월간 대시보드 생성 실패:', error)
          addToast('대시보드 생성에 실패했어요. 다시 시도해 주세요')
        },
      },
    )
  }

  // 기간 이동 시 이전 기간의 생성 조건 초기화 — 새 조회 완료 전 생성 방지 (리뷰 반영)
  const resetWeeklyCondition = () => {
    setSelectedIds([])
    setCreatedWeeklyDashboardId(undefined)
  }

  const handleWeekMove = (delta: number) => {
    if (generation === 'generating') return
    resetWeeklyCondition()
    setWeekStartDate((prev) => {
      const stepDate =
        delta > 0
          ? new Date(getTeamWeekEnd(prev).getTime() + 86400000) // 이번 주 끝 다음날
          : new Date(prev.getTime() - 86400000) // 이번 주 시작 전날
      return getTeamWeekStart(stepDate)
    })
  }

  // 월 이동 — 이전 월의 상세/생성 상태 무효화 (리뷰 반영)
  const handleMonthMove = (delta: number) => {
    if (monthlyGeneration === 'generating') return
    setCreatedMonthlyDashboardId(undefined)
    setMonthOffset((v) => v + delta)
  }

  const refreshDetail = () => {
    void weeklyDetailQuery.refetch().then((result) => {
      if (result.isError) {
        console.error('상세 재조회 실패:', result.error)
        addToast('최신 내용을 불러오지 못했어요. 다시 시도해 주세요')
      }
    })
  }

  const refreshMonthlyDetail = () => {
    void monthlyDetailQuery.refetch().then((result) => {
      if (result.isError) {
        console.error('월간 상세 재조회 실패:', result.error)
        addToast('최신 내용을 불러오지 못했어요. 다시 시도해 주세요')
      }
    })
  }

  const handleGoWeekly = (weekId: string) => {
    if (weekId.startsWith('pending-')) {
      const dateStr = weekId.replace('pending-', '')
      resetWeeklyCondition()
      setWeekStartDate(getTeamWeekStart(new Date(`${dateStr}T00:00:00`)))
    }
    setActiveTab('weekly')
  }

  const status: WeeklyDashboardStatus =
    generation !== 'idle'
      ? (generation as WeeklyDashboardStatus)
      : selectedIds.length >= requiredCount
        ? 'ready'
        : 'insufficient'

  return (
    <div className="flex min-h-full flex-col gap-7 bg-(--color-bg-brand-subtle) px-(--scale-40) pt-(--scale-40) pb-15">
      <header className="flex flex-col gap-1">
        <h1 className="[font-size:var(--font-size-heading-4)] leading-(--line-height-body) font-[var(--font-weight-bold)] text-(--color-text-default)">
          성과 리포트
        </h1>
        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] text-(--color-text-tertiary)">
          나의 업무 성과를 분석해 볼까요?
        </p>
      </header>

      <nav className="flex gap-3 border-b border-(--color-border-subtle)">
        <button
          type="button"
          onClick={() => setActiveTab('weekly')}
          className={
            activeTab === 'weekly'
              ? 'h-[45px] border-b-2 border-(--color-text-brand) px-5 py-2 font-semibold text-(--color-text-default)'
              : 'h-[45px] px-5 py-2 text-(--color-text-tertiary)'
          }
        >
          주간
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('monthly')}
          className={
            activeTab === 'monthly'
              ? 'h-[45px] border-b-2 border-(--color-text-brand) px-5 py-2 font-semibold text-(--color-text-default)'
              : 'h-[45px] px-5 py-2 text-(--color-text-tertiary)'
          }
        >
          월간
        </button>
      </nav>

      {activeTab === 'weekly' ? (
        <>
          <div className="flex h-[52px] w-[250px] items-center justify-between gap-1 self-start rounded-xl border border-(--color-border-brand-subtle) bg-(--color-bg-default) px-2 py-1 shadow-[0px_1px_5px_0px_#0000001A]">
            <button type="button" aria-label="이전 주차" onClick={() => handleWeekMove(-1)}>
              <ArrowLeftIcon width={24} height={24} className="text-(--color-icon-secondary)" />
            </button>
            <span className="[font-size:var(--font-size-body-2)] leading-[1.6] font-medium text-(--color-text-secondary)">
              {weekLabel}
            </span>
            <button
              type="button"
              aria-label="다음 주차"
              disabled={generation === 'generating'}
              onClick={() => handleWeekMove(1)}
              className="disabled:opacity-40"
            >
              <ArrowLeftIcon
                width={24}
                height={24}
                className="rotate-180 text-(--color-icon-secondary)"
              />
            </button>
          </div>

          <div className="flex gap-5">
            {isWeeklyLoading ? (
              <LoadingState message="주간 데이터를 불러오는 중이에요" className="flex-1 py-20" />
            ) : status !== 'complete' &&
              (weeklyEligibilityQuery.isError || weeklyListQuery.isError) ? (
              <ErrorState
                message="생성 조건을 불러오지 못했어요"
                className="flex-1 py-20"
                onRetry={() => {
                  void weeklyEligibilityQuery.refetch()
                  void weeklyListQuery.refetch()
                }}
              />
            ) : status === 'complete' ? (
              <div className="flex flex-1 flex-col gap-7">
                <WeeklySummaryInsight stats={stats} aiSummary={aiSummary} />
                <TagWorkflowSection tags={tags} />
                <WeeklyHighlights items={highlights} />
                <WeeklyRetrospective
                  key={detail?.dashboardId ?? weekStartDate.getTime()}
                  dashboardId={detail?.dashboardId}
                  workspaceId={workspaceId}
                  initialReflection={(() => {
                    const list = detail?.weeklyReflections
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
                  onSaved={refreshDetail}
                />
              </div>
            ) : (
              <>
                <WeeklyStatusCard
                  status={status === 'generating' ? 'generating' : status}
                  convertedCount={selectedIds.length}
                  onGenerate={handleGenerate}
                  requiredCount={requiredCount}
                  periodLabel={weekLabel.replace(/^\d+년\s*/, '')}
                />
                <DiaryChecklistPanel
                  entries={entries}
                  totalDays={totalDays}
                  selectedIds={selectedIds}
                  onToggle={handleToggle}
                  disabled={status === 'generating'}
                  periodLabel={weekLabel.replace(/^\d+년\s*/, '')}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex h-[52px] w-[203px] items-center justify-between gap-1 self-start rounded-xl border border-(--color-border-brand-subtle) bg-(--color-bg-default) px-2 py-1 shadow-[0px_1px_5px_0px_#0000001A]">
            <button
              type="button"
              aria-label="이전 달"
              disabled={monthlyGeneration === 'generating'}
              onClick={() => handleMonthMove(-1)}
            >
              <ArrowLeftIcon width={24} height={24} className="text-(--color-icon-secondary)" />
            </button>
            <span className="[font-size:var(--font-size-body-2)] leading-[1.6] font-medium text-(--color-text-secondary)">
              {monthLabel}
            </span>
            <button
              type="button"
              aria-label="다음 달"
              disabled={monthlyGeneration === 'generating'}
              onClick={() => handleMonthMove(1)}
            >
              <ArrowLeftIcon
                width={24}
                height={24}
                className="rotate-180 text-(--color-icon-secondary)"
              />
            </button>
          </div>

          <div className="flex gap-5">
            {isMonthlyLoading ? (
              <LoadingState message="월간 데이터를 불러오는 중이에요" className="flex-1 py-20" />
            ) : monthlyGeneration !== 'complete' &&
              (monthlyEligibilityQuery.isError || monthlyListQuery.isError) ? (
              <ErrorState
                message="생성 조건을 불러오지 못했어요"
                className="flex-1 py-20"
                onRetry={() => {
                  void monthlyEligibilityQuery.refetch()
                  void monthlyListQuery.refetch()
                }}
              />
            ) : (
              <MonthlyDashboard
                generation={monthlyGeneration}
                workspaceId={workspaceId}
                onGenerate={handleMonthlyGenerate}
                onGoWeekly={handleGoWeekly}
                eligibility={monthlyEligibility}
                detail={monthlyDetail}
                onReflectionSaved={refreshMonthlyDetail}
              />
            )}
          </div>
        </>
      )}
      <ToastContainer toasts={toasts} align="left" />
    </div>
  )
}
