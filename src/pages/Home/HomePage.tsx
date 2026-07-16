import type { HTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/common/Button/IconButton'
import { HomeBanner } from '@/components/home/HomeBanner/HomeBanner'
import { TodayTaskCard } from '@/components/home/TodayTaskCard/TodayTaskCard'
import { StreakCard } from '@/components/home/StreakCard/StreakCard'
import { WEEK_DAYS } from '@/components/home/constants'
import { WeeklyTaskRecord } from '@/components/home/WeeklyTaskRecord/WeeklyTaskRecord'
import { RecentRecordCard } from '@/components/home/RecentRecordCard/RecentRecordCard'
import ArrowRightIcon from '@/assets/icons/Property 1=top_right.svg?react'

const MOCK_TODAY_TASKS = [
  {
    id: '1',
    project: '온보딩 리뉴얼',
    priority: 'must' as const,
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    id: '2',
    project: '온보딩 리뉴얼',
    priority: 'should' as const,
    title: 'Product Strategy Alignment 회의 준비',
  },
  { id: '3', priority: 'could' as const, title: 'Product Strategy Alignment 회의 준비' },
]

const MOCK_WEEK_RECORD = [
  'success-dim',
  'fail',
  'success',
  'success',
  'success',
  'success',
  'none',
] as const

const MOCK_WEEKLY_DAYS = [
  {
    date: 16,
    day: '일',
    tasks: [
      { id: '1', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
      { id: '2', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
      { id: '3', title: 'Product Strategy Alignment 회의 준비', priority: 'could' as const },
    ],
  },
  { date: 17, day: '월', tasks: [] },
  {
    date: 18,
    day: '화',
    tasks: [
      { id: '4', title: 'Product Strategy Alignment 회의 준비', priority: 'must' as const },
      { id: '5', title: 'Product Strategy Alignment 회의 준비', priority: 'could' as const },
    ],
  },
  {
    date: 19,
    day: '수',
    tasks: [
      { id: '6', title: 'Product Strategy Alignment 회의 준비', priority: 'must' as const },
      { id: '7', title: 'Product Strategy Alignment 회의 준비', priority: 'must' as const },
      { id: '8', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
      { id: '9', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
      { id: '10', title: 'Product Strategy Alignment 회의 준비', priority: 'could' as const },
    ],
  },
  {
    date: 20,
    day: '목',
    tasks: [
      { id: '11', title: 'Product Strategy Alignment 회의 준비', priority: 'must' as const },
      { id: '12', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
    ],
  },
  {
    date: 21,
    day: '금',
    tasks: [
      { id: '13', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
    ],
  },
  { date: 22, day: '토', tasks: [] },
]

const MOCK_RECENT_RECORDS = [
  {
    id: '1',
    date: '2026년 8월 20일 목요일',
    totalCount: 6,
    tasks: [
      {
        id: '1',
        project: '온보딩 리뉴얼',
        projectColor: 'green' as const,
        title: 'Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비',
      },
      {
        id: '2',
        project: 'AI 변환 일지 개선',
        projectColor: 'orange' as const,
        title: 'Product Strategy Alignment 회의 준비',
      },
      {
        id: '3',
        project: '디자인 시스템 V2',
        projectColor: 'pink' as const,
        title: 'Product Strategy Alignment 회의 준비',
      },
    ],
  },
  {
    id: '2',
    date: '2026년 8월 19일 수요일',
    totalCount: 4,
    tasks: [
      {
        id: '4',
        project: '온보딩 리뉴얼',
        projectColor: 'green' as const,
        title: 'Product Strategy Alignment 회의 준비',
      },
      {
        id: '5',
        project: 'AI 변환 일지 개선',
        projectColor: 'orange' as const,
        title: 'Product Strategy Alignment 회의 준비',
      },
      {
        id: '6',
        project: '디자인 시스템 V2',
        projectColor: 'pink' as const,
        title: 'Product Strategy Alignment 회의 준비',
      },
    ],
  },
]

export interface HomePageProps extends HTMLAttributes<HTMLDivElement> {
  userName?: string
}

export function HomePage({ userName = 'Alex Kim', className, ...rest }: HomePageProps) {
  const navigate = useNavigate()
  const today = new Date()
  const todayLabel = `${today.getMonth() + 1}월 ${today.getDate()}일 ${WEEK_DAYS[today.getDay()]}요일`

  return (
    <div className={['flex-1 overflow-y-auto p-10', className].filter(Boolean).join(' ')} {...rest}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <g transform="matrix(64.366 62 -56.089 43.527 960 763.5)">
          <foreignObject x="-216.09" y="-216.09" width="432.18" height="432.18">
            <div
              style={{
                backgroundImage:
                  'conic-gradient(from 90deg, rgb(217,228,255) -9.3274%, rgb(217,248,255) 21.842%, rgb(255,255,255) 33.523%, rgb(255,255,255) 70.649%, rgb(244,238,255) 84.074%, rgb(217,228,255) 90.673%, rgb(217,248,255) 121.84%)',
                height: '100%',
                width: '100%',
              }}
            />
          </foreignObject>
        </g>
      </svg>
      <div className="flex flex-col gap-8 pb-10">
        {/* 인사 영역 */}
        <div className="flex flex-col gap-1">
          <span className="[font-size:var(--font-size-heading-4)] leading-(--line-height-heading) font-bold text-(--color-text-default)">
            반가워요, {userName} 님
          </span>
          <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
            오늘도 워디와 함께해 볼까요?
          </span>
        </div>

        {/* 배너 + 오늘의 업무 */}
        <div className="grid grid-cols-3 gap-5 h-100">
          <HomeBanner className="col-span-2" />
          <TodayTaskCard
            dateLabel={todayLabel}
            tasks={MOCK_TODAY_TASKS}
            onNavigate={() => navigate('/today')}
          />
        </div>

        {/* 나의 기록 현황 + 이번 주 업무 기록 */}
        <div className="grid grid-cols-3 gap-5 h-90.25">
          <StreakCard streak={4} weekRecord={MOCK_WEEK_RECORD} />
          <WeeklyTaskRecord className="col-span-2" days={MOCK_WEEKLY_DAYS} />
        </div>

        {/* 최근 기록 */}
        <div className="bg-(--color-bg-default) rounded-(--scale-20) border-[0.5px] border-(--color-border-brand-subtle) shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)] p-5">
          <div className="flex items-center justify-between mb-5">
            <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
              최근 기록
            </span>
            <IconButton
              variant="icon_only"
              size="small"
              icon={<ArrowRightIcon className="size-8" />}
              aria-label="최근 기록 더보기"
              onClick={() => navigate('/records')}
            />
          </div>
          {MOCK_RECENT_RECORDS.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                첫 기록을 시작해 주세요!
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {MOCK_RECENT_RECORDS.map((record) => (
                <RecentRecordCard
                  key={record.id}
                  {...record}
                  onClick={() => navigate('/records')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
