import { useState } from 'react'
import ArrowLeftIcon from '@/assets/icons/Direction=left.svg?react'
import ArrowRightIcon from '@/assets/icons/Direction=right.svg?react'
import { WeeklyStatusCard } from './WeeklyStatusCard'
import { DiaryChecklistPanel } from './DiaryChecklistPanel'
import { WeeklySummaryInsight } from './WeeklySummaryInsight'
import { TagWorkflowSection } from './TagWorkflowSection'
import { WeeklyHighlights } from './WeeklyHighlights'
import { WeeklyRetrospective } from './WeeklyRetrospective'
import { DUMMY_WEEKS, MonthlyDashboard } from './MonthlyDashboard'
import type { MonthlyGeneration } from './MonthlyDashboard'
import type { TagWorkflow } from './TagWorkflowSection'
import type { DiaryEntry, WeeklyDashboardStatus } from './dashboard.types'

// TODO(#44): API 연동 시 실제 변환 완료 일지 데이터로 교체
// 일지 0개 상태 테스트: 아래 배열을 [] 로 바꾸면 빈 패널 + 미충족 화면 확인 가능
const DUMMY_ENTRIES: DiaryEntry[] = [
  { id: '1', label: '2026년 6월 11일 목요일', converted: true },
  { id: '2', label: '2026년 6월 12일 금요일', converted: true },
  { id: '3', label: '2026년 6월 13일 토요일', converted: true },
  { id: '4', label: '2026년 6월 15일 월요일', converted: true },
  { id: '5', label: '2026년 6월 16일 화요일', converted: true },
]

// TODO(#44): API 연동 시 생성 결과 데이터로 교체
const DUMMY_STATS = [
  { label: '일지 기록', value: '4', unit: '일' },
  { label: '업무 완료율', value: '65', unit: '%' },
  { label: '사용된 프로젝트 태그', value: '9', unit: '개' },
]

const DUMMY_AI_SUMMARY =
  '이번 주에는 온보딩 리뉴얼과 디자인 시스템 정비를 중심으로 구조 정리와 개선 기준을 수립했어요.'

const DUMMY_TAGS: TagWorkflow[] = [
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

const DUMMY_HIGHLIGHTS = [
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

export const WeeklyDashboard = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly')
  // 기본: 전체 선택 상태에서 시작
  const [selectedIds, setSelectedIds] = useState<string[]>(DUMMY_ENTRIES.map((e) => e.id))
  const [generation, setGeneration] = useState<'idle' | 'generating' | 'complete'>('idle')
  // TODO(#44): API 연동 시 주차별 일지 조회로 교체. 현재는 주차 라벨만 이동
  const [weekOffset, setWeekOffset] = useState(0)

  // 월간 생성 상태 — 탭 전환 시 유실되지 않도록 부모에서 소유 (리뷰 반영)
  const [monthlyGeneration, setMonthlyGeneration] = useState<MonthlyGeneration>('idle')

  const weekLabel = `2026년 6월 ${3 + weekOffset}주차`

  const totalDays = DUMMY_ENTRIES.length
  const requiredCount = totalDays > 0 ? Math.min(3, totalDays) : 3

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }

  const handleGenerate = () => {
    setGeneration('generating')
    // TODO(#44): API 연동 시 생성 완료 응답으로 교체. 데모: 2초 후 완료
    setTimeout(() => setGeneration('complete'), 2000)
  }

  const handleMonthlyGenerate = () => {
    setMonthlyGeneration('generating')
    // TODO(#66): API 연동 시 생성 완료 응답으로 교체. 데모: 2초 후 완료
    setTimeout(() => setMonthlyGeneration('complete'), 2000)
  }

  // 미생성 주차 "생성하기" → 해당 주차로 이동하며 주간 탭 전환 (리뷰 반영)
  const handleGoWeekly = (weekId: string) => {
    const index = DUMMY_WEEKS.findIndex((w) => w.id === weekId)
    if (index !== -1) setWeekOffset(index + 1 - 3) // 3주차가 offset 0 기준
    setActiveTab('weekly')
  }

  // 선택 requiredCount개 이상이면 충족, 미만이면 미충족. 생성 진행/완료가 우선
  const status: WeeklyDashboardStatus =
    generation !== 'idle'
      ? (generation as WeeklyDashboardStatus)
      : selectedIds.length >= requiredCount
        ? 'ready'
        : 'insufficient'

  return (
    <div className="flex flex-1 flex-col gap-6 px-10 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="[font-size:var(--font-size-heading-4)] font-bold text-(--color-text-default)">
          성과 대시보드
        </h1>
        <p className="[font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
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
                <WeeklySummaryInsight stats={DUMMY_STATS} aiSummary={DUMMY_AI_SUMMARY} />
                <TagWorkflowSection tags={DUMMY_TAGS} />
                <WeeklyHighlights items={DUMMY_HIGHLIGHTS} />
                <WeeklyRetrospective />
              </div>
            ) : (
              <>
                <WeeklyStatusCard
                  status={status === 'generating' ? 'generating' : status}
                  convertedCount={selectedIds.length}
                  onGenerate={handleGenerate}
                />
                <DiaryChecklistPanel
                  entries={DUMMY_ENTRIES}
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
          {/* TODO(#66): API 연동 시 월 이동에 따른 데이터 갱신 */}
          <div className="flex items-center gap-2 self-start rounded-full border border-(--color-border-subtle) px-4 py-2">
            <button type="button" aria-label="이전 달">
              <ArrowLeftIcon width={16} height={16} className="text-(--color-icon-tertiary)" />
            </button>
            <span className="[font-size:var(--font-size-body-4)] text-(--color-text-default)">
              2026년 6월
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
            />
          </div>
        </>
      )}
    </div>
  )
}
