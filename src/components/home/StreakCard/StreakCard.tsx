import type { HTMLAttributes } from 'react'
import { WEEK_DAYS } from '@/components/home/constants'
import SuccessIcon from '@/assets/icons/success.svg?react'
import FailIcon from '@/assets/icons/minus.svg?react'
import FireIcon from '@/assets/icons/fire.svg?react'

export type DayRecord = 'success' | 'success-dim' | 'fail' | 'none'

export interface StreakCardProps extends HTMLAttributes<HTMLDivElement> {
  streak: number
  weekRecord: readonly DayRecord[]
}

export { WEEK_DAYS } from '@/components/home/constants'

const ICON_SIZE = { width: 32, height: 32 } as const

export function StreakCard({ streak, weekRecord, className, ...rest }: StreakCardProps) {
  return (
    <div
      className={[
        'flex flex-col gap-5 p-5 rounded-(--scale-20)',
        'border-[0.5px] border-(--color-border-brand-subtle)',
        'shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]',
        'bg-(--color-bg-default)',
        'h-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default) shrink-0">
        나의 기록 현황
      </span>

      <div className="flex flex-col gap-10 flex-1 items-center py-4">
        {/* 연속 기록 */}
        <div className="flex gap-2 items-start justify-center w-full">
          <FireIcon
            style={{ color: 'var(--primitive-orange-700)', ...ICON_SIZE }}
            className="shrink-0"
          />
          <div className="flex flex-col items-center">
            <span
              className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-semibold text-(--color-text-tertiary) text-center whitespace-nowrap"
              style={{ marginBottom: -12 }}
            >
              연속 기록
            </span>
            <div className="flex gap-1 items-end justify-center">
              <span className="[font-size:var(--font-size-heading-1)] leading-(--line-height-heading) font-semibold text-(--color-text-brand) whitespace-nowrap">
                {streak}
              </span>
              <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-default) h-10.75 w-9.25">
                일 째
              </span>
            </div>
          </div>
        </div>

        {/* 요일별 기록 */}
        <div className="flex items-start w-full">
          {WEEK_DAYS.map((day, i) => (
            <div key={day} className="flex flex-1 flex-col gap-2 items-center min-w-0">
              {weekRecord[i] === 'success' ? (
                <SuccessIcon
                  style={{ color: 'var(--primitive-orange-700)', ...ICON_SIZE }}
                  className="shrink-0"
                />
              ) : weekRecord[i] === 'success-dim' ? (
                <SuccessIcon
                  style={{ color: 'var(--primitive-orange-300)', ...ICON_SIZE }}
                  className="shrink-0"
                />
              ) : weekRecord[i] === 'fail' ? (
                <FailIcon
                  style={{ color: 'var(--color-icon-tertiary)', ...ICON_SIZE }}
                  className="shrink-0"
                />
              ) : (
                <div style={ICON_SIZE} className="shrink-0" />
              )}
              <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-default)">
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
