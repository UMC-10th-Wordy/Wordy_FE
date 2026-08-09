import { useEffect, useState } from 'react'
import {
  createDashboard,
  createMonthlyDashboard,
  getDashboardDetail,
  getDashboardEligibility,
  getMonthlyDashboardDetail,
  getMonthlyEligibility,
  getDashboards,
  getMonthlyDashboards,
} from '@/api/dashboard/dashboard'
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?react'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/common/Toast/ToastContainer'
import { WeeklyStatusCard } from '@/components/dashboard/WeeklyStatusCard'
import { DiaryChecklistPanel } from '@/components/dashboard/DiaryChecklistPanel'
import { WeeklySummaryInsight } from '@/components/dashboard/WeeklySummaryInsight'
import { TagWorkflowSection } from '@/components/dashboard/TagWorkflowSection'
import { WeeklyHighlights } from '@/components/dashboard/WeeklyHighlights'
import { WeeklyRetrospective } from '@/components/dashboard/WeeklyRetrospective'
import { MonthlyDashboard } from '@/components/dashboard/MonthlyDashboard'
import type { MonthlyGeneration } from '@/components/dashboard/MonthlyDashboard'
import type { TagWorkflow } from '@/components/dashboard/TagWorkflowSection'
import type {
  DashboardDetailDto,
  DiaryEntry,
  WeeklyDashboardStatus,
  MonthlyEligibilityDto,
} from '@/types/dashboard'
import type { ProjectTagColor } from '@/components/todo/ProjectTag'
import { hexToTagColor } from '@/utils/tagMapper'

// 서버 entryDate(YYYY-MM-DD) → 화면 라벨(YYYY년 M월 D일 X요일)
const formatEntryLabel = (dateStr: string) => {
  const date = new Date(`${dateStr}T00:00:00`)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`
}

const TAG_FALLBACK_COLORS: ProjectTagColor[] = ['green', 'pink', 'blue', 'orange']

export const DashboardPage = () => {
  const { toasts, addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly')
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [requiredCount, setRequiredCount] = useState(3)
  const [weekRange, setWeekRange] = useState({ start: '', end: '' })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [generation, setGeneration] = useState<'idle' | 'generating' | 'complete'>('idle')
  const [detail, setDetail] = useState<DashboardDetailDto | null>(null)

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

  const [weekStartDate, setWeekStartDate] = useState(() => getTeamWeekStart(new Date()))
  const weekLabel = `${weekStartDate.getFullYear()}년 ${weekStartDate.getMonth() + 1}월 ${Math.ceil((weekStartDate.getDate() + new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), 1).getDay()) / 7)}주차`
  // TODO: 월간 API 명세 확정 시 월 이동 데이터 갱신 연결. 현재는 라벨만 이동
  const [monthOffset, setMonthOffset] = useState(0)
  const [monthAnchor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const selectedMonth = new Date(monthAnchor)
  selectedMonth.setMonth(selectedMonth.getMonth() + monthOffset)
  const monthBaseDate = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-01`
  const monthLabel = `${selectedMonth.getFullYear()}년 ${selectedMonth.getMonth() + 1}월`

  // 월간 생성 상태 — 탭 전환 시 유실되지 않도록 부모에서 소유
  const [monthlyGeneration, setMonthlyGeneration] = useState<MonthlyGeneration>('idle')
  const [monthlyEligibility, setMonthlyEligibility] = useState<MonthlyEligibilityDto | null>(null)
  const [monthlyDetail, setMonthlyDetail] = useState<DashboardDetailDto | null>(null)

  useEffect(() => {
    let cancelled = false
    const baseDate = `${weekStartDate.getFullYear()}-${String(weekStartDate.getMonth() + 1).padStart(2, '0')}-${String(weekStartDate.getDate()).padStart(2, '0')}`
    const viewedEndDate = getTeamWeekEnd(weekStartDate)
    const viewedEnd = `${viewedEndDate.getFullYear()}-${String(viewedEndDate.getMonth() + 1).padStart(2, '0')}-${String(viewedEndDate.getDate()).padStart(2, '0')}`
    getDashboardEligibility(baseDate)
      .then((res) => {
        if (cancelled) return
        const mapped = res.entries.map((e) => ({
          id: e.dailyEntryId,
          label: formatEntryLabel(e.entryDate),
          converted: undefined, // TODO: 서버 변환 여부 필드 확정 시 e.필드명 연결
          date: e.entryDate,
        }))
        setEntries(mapped)
        setRequiredCount(res.requiredDays)
        setWeekRange({ start: res.weekStart, end: res.weekEnd })
        getDashboards()
          .then((list) => {
            const saved = list.find((d) => d.startDate === res.weekStart)
            // 서버가 요청과 다른 주를 반환하면(현 BaseDate 버그) 복원하지 않음 — 보는 주와 응답 주가 겹칠 때만 복원
            if (!saved || res.weekStart !== baseDate || res.weekEnd !== viewedEnd) return
            return getDashboardDetail(saved.dashboardId).then((detailRes) => {
              if (cancelled) return
              setDetail(detailRes)
              setGeneration('complete')
            })
          })
          .catch(() => {})
        setSelectedIds(mapped.map((e) => e.id)) // 기본: 전체 선택
      })
      .catch((error) => console.error('생성 조건 조회 실패:', error))
    return () => {
      cancelled = true
    }
  }, [weekStartDate])

  useEffect(() => {
    let cancelled = false
    getMonthlyEligibility(monthBaseDate)
      .then((res) => {
        if (!cancelled) setMonthlyEligibility(res)
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('월간 생성 조건 조회 실패:', error)
          setMonthlyEligibility(null)
        }
      })
    getMonthlyDashboards()
      .then((list) => {
        const saved = list.find((d) => d.startDate.slice(0, 7) === monthBaseDate.slice(0, 7))
        if (!saved) return
        return getMonthlyDashboardDetail(saved.dashboardId).then((detailRes) => {
          if (cancelled) return
          setMonthlyDetail(detailRes)
          setMonthlyGeneration('complete')
        })
      })
      .catch(() => {})
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [monthOffset, monthBaseDate])

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
    setGeneration('generating')
    createDashboard({ startDate: weekRange.start, endDate: weekRange.end })
      .then((created) => {
        if (!created.dashboardId) {
          throw new Error('생성 응답에 저장된 대시보드 ID가 없습니다')
        }
        return getDashboardDetail(created.dashboardId)
      })
      .then((res) => {
        setDetail(res)
        setGeneration('complete')
      })
      .catch((error) => {
        console.error('대시보드 생성 실패:', error)
        addToast('대시보드 생성에 실패했어요. 다시 시도해 주세요')
        setGeneration('idle')
      })
  }

  const handleMonthlyGenerate = () => {
    if (monthlyGeneration === 'generating') return
    if (!monthlyEligibility?.eligible) {
      addToast('아직 생성 조건을 충족하지 못했어요')
      return
    }
    setMonthlyGeneration('generating')
    createMonthlyDashboard({
      startDate: monthlyEligibility.monthStart,
      endDate: monthlyEligibility.monthEnd,
    })
      .then((created) => {
        if (!created.dashboardId) {
          throw new Error('생성 응답에 저장된 대시보드 ID가 없습니다')
        }
        return getMonthlyDashboardDetail(created.dashboardId)
      })
      .then((res) => {
        setMonthlyDetail(res)
        setMonthlyGeneration('complete')
      })
      .catch((error) => {
        console.error('월간 대시보드 생성 실패:', error)
        addToast('대시보드 생성에 실패했어요. 다시 시도해 주세요')
        setMonthlyGeneration('idle')
      })
  }

  // 기간 이동 시 이전 기간의 생성 조건 초기화 — 새 조회 완료 전 생성 방지 (리뷰 반영)
  const resetWeeklyCondition = () => {
    setEntries([])
    setSelectedIds([])
    setWeekRange({ start: '', end: '' })
    setDetail(null)
    setGeneration('idle')
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
    setMonthlyEligibility(null)
    setMonthlyDetail(null)
    setMonthlyGeneration('idle')
    setMonthOffset((v) => v + delta)
  }

  const refreshDetail = () => {
    if (!detail) return
    void getDashboardDetail(detail.dashboardId)
      .then((res) => setDetail(res))
      .catch((error) => console.error('상세 재조회 실패:', error))
  }

  const refreshMonthlyDetail = () => {
    if (!monthlyDetail) return
    void getMonthlyDashboardDetail(monthlyDetail.dashboardId)
      .then((res) => setMonthlyDetail(res))
      .catch((error) => console.error('월간 상세 재조회 실패:', error))
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
    <div className="flex flex-1 flex-col gap-7 bg-[#FAFAFC] px-(--scale-40) pt-(--scale-40) pb-[60px]">
      <header className="flex flex-col gap-1">
        <h1 className="[font-size:var(--font-size-heading-4)] leading-(--line-height-body) font-[var(--font-weight-bold)] text-(--color-text-default)">
          성과 리포트
        </h1>
        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] text-(--color-text-tertiary)">
          나의 업무 성과를 분석해 볼까요?
        </p>
      </header>

      <nav className="-mx-10 flex gap-3 border-b border-(--color-border-subtle) px-10">
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
          <div className="flex h-[52px] w-[250px] items-center justify-between gap-1 self-start rounded-xl border border-[#DDDDFF] bg-(--color-bg-default) px-2 py-1 shadow-[0px_1px_5px_0px_#0000001A]">
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
            {status === 'complete' ? (
              <div className="flex flex-1 flex-col gap-7">
                <WeeklySummaryInsight stats={stats} aiSummary={aiSummary} />
                <TagWorkflowSection tags={tags} />
                <WeeklyHighlights items={highlights} />
                <WeeklyRetrospective
                  dashboardId={detail?.dashboardId}
                  initialReflection={detail?.weeklyReflections[0]}
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
                />
                <DiaryChecklistPanel
                  entries={entries}
                  totalDays={totalDays}
                  selectedIds={selectedIds}
                  onToggle={handleToggle}
                  disabled={status === 'generating'}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {/* TODO: 월간 API 명세 확정 후 월 이동 데이터 갱신 연결 */}
          <div className="flex h-[52px] w-[203px] items-center justify-between gap-1 self-start rounded-xl border border-[#DDDDFF] bg-(--color-bg-default) px-2 py-1 shadow-[0px_1px_5px_0px_#0000001A]">
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
            <MonthlyDashboard
              generation={monthlyGeneration}
              onGenerate={handleMonthlyGenerate}
              onGoWeekly={handleGoWeekly}
              eligibility={monthlyEligibility}
              detail={monthlyDetail}
              onReflectionSaved={refreshMonthlyDetail}
            />
          </div>
        </>
      )}
      <ToastContainer toasts={toasts} align="left" />
    </div>
  )
}
