import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'

export interface WeeklyBoardStatus {
  id: string
  weekLabel: string // 예: '6월 1주차'
  rangeLabel: string // 예: '6월 1일 - 6월 6일'
  generated: boolean
}

interface MonthlyWeekListPanelProps {
  weeks: WeeklyBoardStatus[]
  totalWeeks: number
  onGoWeekly: (weekId: string) => void
  periodLabel?: string
}

export const MonthlyWeekListPanel = ({
  weeks,
  totalWeeks,
  onGoWeekly,
  periodLabel,
}: MonthlyWeekListPanelProps) => {
  const isEmpty = weeks.length === 0

  return (
    <aside className="flex h-[748px] min-w-0 max-w-[576px] flex-1 shrink flex-col gap-5 rounded-xl border border-(--color-border-brand-subtle) shadow-[0px_1px_5px_0px_#0000001A] bg-(--color-bg-default) p-6">
      <div className="flex items-baseline gap-2">
        <h2 className="[font-size:var(--font-size-body-2)] font-bold text-(--color-text-default)">
          생성에 사용할 주간 대시보드
        </h2>
        <span className="[font-size:var(--font-size-caption-1)] text-(--color-text-tertiary)">
          전체 {totalWeeks}주
        </span>
      </div>
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-(--color-text-tertiary)">
          <XMarkIcon
            width={32}
            height={32}
            className="rounded-full bg-(--color-button-default) p-1 text-(--color-text-inverse)"
          />
          <p className="[font-size:var(--font-size-body-2)] leading-[1.6] text-center text-(--color-text-tertiary)">
            {periodLabel ?? '이번 달'}에 생성한 주간 대시보드가 없어요
          </p>
        </div>
      ) : (
        <Scrollbar className="flex-1">
          <ul className="flex flex-col">
            {weeks.map((week) => (
              <li key={week.id} className="flex h-[52px] items-center gap-2.5 py-2.5">
                <span
                  className={[
                    'shrink-0 rounded-lg px-2 py-1 [font-size:var(--font-size-caption-1)] font-medium',
                    week.generated
                      ? 'bg-(--color-tag-green-bg) text-(--color-tag-green-text)'
                      : 'bg-(--color-tag-red-bg) text-(--color-tag-red-text)',
                  ].join(' ')}
                >
                  {week.generated ? '생성됨' : '생성되지 않음'}
                </span>
                <span className="shrink-0 [font-size:var(--font-size-body-2)] leading-[1.6] font-medium text-(--color-text-secondary)">
                  {week.weekLabel}
                </span>
                <span className="min-w-0 truncate [font-size:var(--font-size-body-3)] leading-[1.6] font-medium text-(--color-text-tertiary)">
                  {week.rangeLabel}
                </span>
                {!week.generated && (
                  <button
                    type="button"
                    onClick={() => onGoWeekly(week.id)}
                    className="ml-auto shrink-0 [font-size:var(--font-size-body-4)] text-(--color-text-brand)"
                  >
                    생성하기 &gt;
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Scrollbar>
      )}
    </aside>
  )
}
