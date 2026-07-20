import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'
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
}

export const MonthlyWeekListPanel = ({
  weeks,
  totalWeeks,
  onGoWeekly,
}: MonthlyWeekListPanelProps) => {
  return (
    <aside className="flex h-[748px] min-w-[320px] max-w-[576px] flex-1 shrink flex-col gap-5 rounded-xl border border-(--color-border-subtle) bg-(--color-bg-default) p-6">
      <div className="flex items-baseline gap-2">
        <h2 className="[font-size:var(--font-size-body-2)] font-bold text-(--color-text-default)">
          생성에 사용할 주간 대시보드
        </h2>
        <span className="[font-size:var(--font-size-caption-1)] text-(--color-text-tertiary)">
          전체 {totalWeeks}주
        </span>
      </div>

      <Scrollbar className="flex-1">
        <ul className="flex flex-col">
          {weeks.map((week) => (
            <li key={week.id} className="flex h-[48px] items-center gap-2.5">
              <span
                className={[
                  'rounded-lg px-2 py-1 [font-size:var(--font-size-caption-1)] font-medium',
                  week.generated
                    ? 'bg-(--color-tag-green-bg) text-(--color-tag-green-text)'
                    : 'bg-[#FFE9EC] text-(--color-tag-red-text)',
                ].join(' ')}
              >
                {week.generated ? '생성됨' : '생성되지 않음'}
              </span>
              <span className="[font-size:var(--font-size-body-3)] font-medium text-(--color-text-default)">
                {week.weekLabel}
              </span>
              <span className="[font-size:var(--font-size-caption-1)] text-(--color-text-tertiary)">
                · {week.rangeLabel}
              </span>
              {!week.generated && (
                <button
                  type="button"
                  onClick={() => onGoWeekly(week.id)}
                  className="ml-auto [font-size:var(--font-size-body-4)] text-(--color-text-brand)"
                >
                  생성하기 &gt;
                </button>
              )}
            </li>
          ))}
        </ul>
      </Scrollbar>
    </aside>
  )
}
