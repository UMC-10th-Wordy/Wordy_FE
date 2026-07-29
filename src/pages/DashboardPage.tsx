import { useEffect, useState } from 'react'
import {
  createDashboard,
  createMonthlyDashboard,
  getDashboardDetail,
  getDashboardEligibility,
  getMonthlyDashboardDetail,
  getMonthlyEligibility,
} from '@/api/dashboard/dashboard'
import ArrowLeftIcon from '@/assets/icons/Direction=left.svg?react'
import ArrowRightIcon from '@/assets/icons/Direction=right.svg?react'
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

// 서버 entryDate(YYYY-MM-DD) → 화면 라벨(YYYY년 M월 D일 X요일)
const formatEntryLabel = (dateStr: string) => {
  const date = new Date(`${dateStr}T00:00:00`)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`
}

// TODO: 스키마에 태그명/색상 없음 (백엔드 확인 중) — 임시 순환 배정
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
  // TODO: API에 주차 이동 파라미터(BaseDate) 연결 예정. 현재는 라벨만 이동
  const [weekOffset, setWeekOffset] = useState(0)
  // TODO: 월간 API 명세 확정 시 월 이동 데이터 갱신 연결. 현재는 라벨만 이동
  const [monthOffset, setMonthOffset] = useState(0)

  // 월간 생성 상태 — 탭 전환 시 유실되지 않도록 부모에서 소유
  const [monthlyGeneration, setMonthlyGeneration] = useState<MonthlyGeneration>('idle')
  const [monthlyEligibility, setMonthlyEligibility] = useState<MonthlyEligibilityDto | null>(null)
  const [monthlyDetail, setMonthlyDetail] = useState<DashboardDetailDto | null>(null)

  useEffect(() => {
    let cancelled = false
    getDashboardEligibility()
      .then((res) => {
        if (cancelled) return
        const mapped = res.entries.map((e) => ({
          id: e.dailyEntryId,
          label: formatEntryLabel(e.entryDate),
          converted: true,
        }))
        setEntries(mapped)
        setRequiredCount(res.requiredDays)
        setWeekRange({ start: res.weekStart, end: res.weekEnd })
        setSelectedIds(mapped.map((e) => e.id)) // 기본: 전체 선택
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const month = 6 + monthOffset
    const baseDate = `2026-${String(month).padStart(2, '0')}-01`
    getMonthlyEligibility(baseDate)
      .then((res) => {
        if (!cancelled) setMonthlyEligibility(res)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [monthOffset])

  const weekLabel = `2026년 6월 ${3 + weekOffset}주차`
  const totalDays = entries.length

  // 상세 응답(DTO) → 화면 모델 매핑
  const stats = detail
    ? [
        { label: '일지 기록', value: String(detail.journalDays), unit: '일' },
        { label: '업무 완료율', value: String(detail.performanceCount), unit: '%' },
        { label: '사용된 프로젝트 태그', value: String(detail.tagCount), unit: '개' },
      ]
    : []
  const aiSummary = detail?.summary ?? ''
  const tags: TagWorkflow[] = detail
    ? detail.tagAnalyses.map((t, i) => ({
        id: `tag-${i}`,
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
    : []
  const highlights = detail
    ? detail.performances.map((p) => ({
        text: p.summary,
        source: p.items[0]?.output ?? '업무 일지',
      }))
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
      .then((dashboardId) => getDashboardDetail(dashboardId))
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

  // 회고 저장 후 상세 재조회 — 탭 전환 복귀 시 최신 회고 복원용
  const refreshDetail = () => {
    if (!detail) return
    getDashboardDetail(detail.dashboardId).then((res) => setDetail(res))
  }

  const handleMonthlyGenerate = () => {
    if (monthlyGeneration === 'generating') return
    if (!monthlyEligibility) {
      addToast('생성 조건을 불러오지 못했어요. 잠시 후 다시 시도해 주세요')
      return
    }
    setMonthlyGeneration('generating')
    createMonthlyDashboard({
      startDate: monthlyEligibility.monthStart,
      endDate: monthlyEligibility.monthEnd,
    })
      .then((created) => getMonthlyDashboardDetail(created.dashboardId))
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

  // 월간 회고 저장 후 상세 재조회
  const refreshMonthlyDetail = () => {
    if (!monthlyDetail) return
    getMonthlyDashboardDetail(monthlyDetail.dashboardId).then((res) => setMonthlyDetail(res))
  }
  // TODO: 주간 주차 이동(BaseDate) 연동 시 해당 주차로 정확히 이동하도록 개선
  const handleGoWeekly = (_weekId: string) => {
    setActiveTab('weekly')
  }

  const status: WeeklyDashboardStatus =
    generation !== 'idle'
      ? (generation as WeeklyDashboardStatus)
      : selectedIds.length >= requiredCount
        ? 'ready'
        : 'insufficient'

  return (
    <div className="flex flex-1 flex-col gap-6 px-(--scale-40) pt-(--scale-40) pb-[60px]">
      <header className="flex flex-col gap-1">
        <h1 className="[font-size:var(--font-size-heading-4)] leading-(--line-height-body) font-[var(--font-weight-bold)] text-(--color-text-default)">
          성과 대시보드
        </h1>
        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] text-(--color-text-tertiary)">
          나의 업무 성과를 분석해 볼까요?
        </p>
      </header>

      <nav className="flex gap-6 border-b border-(--color-border-subtle)">
        <button
          type="button"
          onClick={() => setActiveTab('weekly')}
          className={
            activeTab === 'weekly'
              ? 'border-b-2 border-(--color-text-default) pb-2 font-semibold text-(--color-text-default)'
              : 'pb-2 text-(--color-text-tertiary)'
          }
        >
          주간
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('monthly')}
          className={
            activeTab === 'monthly'
              ? 'border-b-2 border-(--color-text-default) pb-2 font-semibold text-(--color-text-default)'
              : 'pb-2 text-(--color-text-tertiary)'
          }
        >
          월간
        </button>
      </nav>

      {activeTab === 'weekly' ? (
        <>
          <div className="flex items-center gap-2 self-start rounded-full border border-(--color-border-subtle) px-4 py-2">
            <button
              type="button"
              aria-label="이전 주차"
              onClick={() => setWeekOffset((v) => v - 1)}
            >
              <ArrowLeftIcon width={16} height={16} className="text-(--color-icon-tertiary)" />
            </button>
            <span className="[font-size:var(--font-size-body-4)] text-(--color-text-default)">
              {weekLabel}
            </span>
            <button
              type="button"
              aria-label="다음 주차"
              onClick={() => setWeekOffset((v) => v + 1)}
            >
              <ArrowRightIcon width={16} height={16} className="text-(--color-icon-tertiary)" />
            </button>
          </div>

          <div className="flex gap-7">
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
          <div className="flex items-center gap-2 self-start rounded-full border border-(--color-border-subtle) px-4 py-2">
            <button type="button" aria-label="이전 달" onClick={() => setMonthOffset((v) => v - 1)}>
              <ArrowLeftIcon width={16} height={16} className="text-(--color-icon-tertiary)" />
            </button>
            <span className="[font-size:var(--font-size-body-4)] text-(--color-text-default)">
              {`2026년 ${6 + monthOffset}월`}
            </span>
            <button type="button" aria-label="다음 달">
              <ArrowRightIcon width={16} height={16} className="text-(--color-icon-tertiary)" />
            </button>
          </div>

          <div className="flex gap-7">
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
