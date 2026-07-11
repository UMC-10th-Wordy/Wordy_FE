import type { HTMLAttributes } from 'react'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import ArrowRightIcon from '@/assets/icons/Direction=right.svg?react'

// ── 목업 데이터 ──────────────────────────────────────────
const MOCK_TODAY_TASKS = [
  { id: '1', project: '온보딩 리뉴얼', title: 'Product Strategy Alignment 회의 준비' },
  { id: '2', project: '온보딩 리뉴얼', title: 'Product Strategy Alignment 회의 준비' },
  { id: '3', title: 'Product Strategy Alignment 회의 준비' },
]

const MOCK_STREAK = 4
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const
const MOCK_WEEK_RECORD: ('success' | 'fail' | 'none')[] = [
  'success',
  'fail',
  'success',
  'success',
  'success',
  'success',
  'none',
]

const MOCK_WEEKLY_TASKS: { date: number; day: string; tasks: { id: string; title: string }[] }[] = [
  {
    date: 16,
    day: '일',
    tasks: [
      { id: '1', title: 'Product Strategy Alignment 회의 준비' },
      { id: '2', title: 'Product Strategy Alignment 회의 준비' },
      { id: '3', title: 'Product Strategy Alignment 회의 준비' },
    ],
  },
  { date: 17, day: '월', tasks: [] },
  {
    date: 18,
    day: '화',
    tasks: [
      { id: '4', title: 'Product Strategy Alignment 회의 준비' },
      { id: '5', title: 'Product Strategy Alignment 회의 준비' },
    ],
  },
  {
    date: 19,
    day: '수',
    tasks: [
      { id: '6', title: 'Product Strategy Alignment 회의 준비' },
      { id: '7', title: 'Product Strategy Alignment 회의 준비' },
      { id: '8', title: 'Product Strategy Alignment 회의 준비' },
      { id: '9', title: 'Product Strategy Alignment 회의 준비' },
      { id: '10', title: 'Product Strategy Alignment 회의 준비' },
    ],
  },
  {
    date: 20,
    day: '목',
    tasks: [
      { id: '11', title: 'Product Strategy Alignment 회의 준비' },
      { id: '12', title: 'Product Strategy Alignment 회의 준비' },
    ],
  },
  { date: 21, day: '금', tasks: [{ id: '13', title: 'Product Strategy Alignment 회의 준비' }] },
  { date: 22, day: '토', tasks: [] },
]

const MOCK_RECENT_RECORDS = [
  {
    id: '1',
    date: '2026년 8월 20일 목요일',
    total: 6,
    tasks: [
      {
        id: '1',
        project: '온보딩 리뉴얼',
        title: 'Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비',
      },
      { id: '2', project: 'AI 변환 일지 개선', title: 'Product Strategy Alignment 회의 준비' },
      { id: '3', project: '디자인 시스템 V2', title: 'Product Strategy Alignment 회의 준비' },
    ],
  },
  {
    id: '2',
    date: '2026년 8월 19일 수요일',
    total: 4,
    tasks: [
      { id: '4', project: '온보딩 리뉴얼', title: 'Product Strategy Alignment 회의 준비' },
      { id: '5', project: 'AI 변환 일지 개선', title: 'Product Strategy Alignment 회의 준비' },
      { id: '6', project: '디자인 시스템 V2', title: 'Product Strategy Alignment 회의 준비' },
    ],
  },
]
// ─────────────────────────────────────────────────────────

export interface HomePageProps extends HTMLAttributes<HTMLDivElement> {
  userName?: string
}

export function HomePage({ userName = 'Alex Kim', className, ...rest }: HomePageProps) {
  const today = new Date()
  const todayLabel = `${today.getMonth() + 1}월 ${today.getDate()}일 ${['일', '월', '화', '수', '목', '금', '토'][today.getDay()]}요일`

  return (
    <div
      className={['flex-1 overflow-y-auto bg-(--color-bg-default) px-10 py-10', className].join(
        ' ',
      )}
      {...rest}
    >
      {/* 인사 영역 */}
      <div className="flex flex-col gap-1 mb-10">
        <span className="[font-size:var(--font-size-heading-3)] leading-(--line-height-heading) font-bold text-(--color-text-default)">
          반가워요, {userName} 님
        </span>
        <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
          오늘도 워디와 함께해 볼까요?
        </span>
      </div>

      {/* 상단 두 카드 */}
      <div className="flex gap-5 mb-5">
        {/* 오늘의 업무 카드 */}
        <div className="flex flex-col flex-1 bg-(--color-bg-default) rounded-(--scale-16) border border-(--color-border-subtle) shadow-[0px_1px_5px_rgba(0,0,0,0.05)] p-5 min-h-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex flex-col gap-1">
              <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
                오늘의 업무
              </span>
              <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                {todayLabel}
              </span>
            </div>
            <IconButton
              variant="text_neutral"
              size="small"
              icon={<ArrowRightIcon className="size-6" />}
              aria-label="오늘의 업무 이동"
            />
          </div>

          {MOCK_TODAY_TASKS.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                오늘의 업무가 없어요
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              {MOCK_TODAY_TASKS.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col py-4 border-b border-(--color-border-subtle) last:border-b-0"
                >
                  {task.project && (
                    <span className="[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-normal text-(--color-text-tertiary) mb-1">
                      {task.project}
                    </span>
                  )}
                  <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default) truncate">
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-6">
            <TextButton variant="fill" size="large">
              오늘의 업무 기록하러 가기
            </TextButton>
          </div>
        </div>

        {/* 나의 기록 현황 카드 */}
        <div className="flex flex-col w-72 bg-(--color-bg-default) rounded-(--scale-16) border border-(--color-border-subtle) shadow-[0px_1px_5px_rgba(0,0,0,0.05)] p-5 min-h-100 shrink-0">
          <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default) mb-6">
            나의 기록 현황
          </span>

          {/* 연속 기록 */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-2xl">🔥</span>
            <div className="flex flex-col">
              <span className="[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                연속 기록
              </span>
              <div className="flex items-baseline gap-1">
                <span className="[font-size:var(--font-size-heading-1)] leading-(--line-height-heading) font-bold text-(--color-text-brand)">
                  {MOCK_STREAK}
                </span>
                <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                  일 째
                </span>
              </div>
            </div>
          </div>

          {/* 요일별 기록 */}
          <div className="flex justify-between">
            {WEEK_DAYS.map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <span className="text-xl">
                  {MOCK_WEEK_RECORD[i] === 'success'
                    ? '✅'
                    : MOCK_WEEK_RECORD[i] === 'fail'
                      ? '❌'
                      : '⬜'}
                </span>
                <span className="[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 이번 주 업무 기록 */}
      <div className="bg-(--color-bg-default) rounded-(--scale-16) border border-(--color-border-subtle) shadow-[0px_1px_5px_rgba(0,0,0,0.05)] p-5 mb-5">
        <div className="flex items-center justify-between mb-5">
          <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
            이번 주 업무 기록
          </span>
          <div className="flex items-center gap-4">
            {[
              { color: 'bg-(--color-status-error)', label: 'Must do' },
              { color: 'bg-(--color-status-warning)', label: 'Should do' },
              { color: 'bg-(--color-status-success)', label: 'Could do' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`size-3.5 rounded-full shrink-0 ${color}`} />
                <span className="[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0">
          {MOCK_WEEKLY_TASKS.map((col, i) => (
            <div
              key={col.date}
              className={[
                'flex flex-col',
                i > 0 ? 'border-l border-(--color-border-subtle) pl-3' : '',
              ].join(' ')}
            >
              <div className="flex items-center gap-1 mb-2 h-6">
                <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
                  {col.date}일
                </span>
                <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                  {col.day}
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                {col.tasks.map((task) => (
                  <div key={task.id} className="bg-(--color-bg-brand-subtle) rounded px-2 py-1.5">
                    <span className="[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-normal text-(--color-text-default) line-clamp-1">
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 최근 기록 */}
      <div className="bg-(--color-bg-default) rounded-(--scale-16) border border-(--color-border-subtle) shadow-[0px_1px_5px_rgba(0,0,0,0.05)] p-5">
        <div className="flex items-center justify-between mb-5">
          <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
            최근 기록
          </span>
          <IconButton
            variant="text_neutral"
            size="small"
            icon={<ArrowRightIcon className="size-6" />}
            aria-label="최근 기록 더보기"
          />
        </div>

        {MOCK_RECENT_RECORDS.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
              첫 기록을 시작해 주세요!
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {MOCK_RECENT_RECORDS.map((record) => (
              <div
                key={record.id}
                className="border border-(--color-border-subtle) rounded-(--scale-12) p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
                    {record.date}
                  </span>
                  <span className="[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                    전체 {record.total}건
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {record.tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2">
                      {task.project && (
                        <span className="bg-(--color-bg-brand-subtle) [font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-normal text-(--color-text-brand) px-2 py-0.5 rounded shrink-0">
                          {task.project}
                        </span>
                      )}
                      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default) truncate">
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
