import MonthlySummaryIcon from '@/assets/icons/diary-summary-month.svg?react'
import StreakSummaryIcon from '@/assets/icons/diary-summary-streak.svg?react'
import TagSummaryIcon from '@/assets/icons/diary-summary-tag.svg?react'

type DiarySummaryCardVariant = 'monthly' | 'streak' | 'tag'

interface DiarySummaryCardProps {
  variant: DiarySummaryCardVariant
  title: string
  value: number | string
  unit?: string
  currentMonthCount?: number
  previousMonthCount?: number
  bestStreakDays?: number
  mostUsedTagRatio?: number
}

const SUMMARY_ICON = {
  monthly: MonthlySummaryIcon,
  streak: StreakSummaryIcon,
  tag: TagSummaryIcon,
} as const

const SUMMARY_CARD_STYLE = {
  monthly: {
    backgroundClassName: 'bg-(--color-bg-brand-light)',
    iconClassName: 'absolute top-[6px] right-[-4.67px] h-[155px] w-[228px]',
    highlightClassName: 'text-(--color-text-brand)',
    textAreaClassName: 'max-w-[calc(100%-190px)]',
  },
  streak: {
    backgroundClassName: 'bg-(--primitive-pink-200)',
    iconClassName: 'absolute top-[-58px] right-[-16px] h-[234px] w-[231px]',
    highlightClassName: 'text-[#FF319E]',
    textAreaClassName: 'max-w-[calc(100%-190px)]',
  },
  tag: {
    backgroundClassName: 'bg-(--primitive-secondary-200)',
    iconClassName: 'absolute top-[9px] right-[-14.33px] h-[150px] w-[184px]',
    highlightClassName: 'text-(--primitive-secondary-800)',
    textAreaClassName: 'max-w-[calc(100%-175.33px)]',
  },
} as const

const renderMonthlyDescription = (
  currentMonthCount: number,
  previousMonthCount: number,
  highlightClassName: string,
) => {
  if (previousMonthCount === 0) {
    return '이번 달의 기록을 열심히 작성해 볼까요?'
  }

  const differenceCount = Math.abs(currentMonthCount - previousMonthCount)

  if (currentMonthCount < previousMonthCount) {
    return (
      <>
        지난 달보다{' '}
        <span className={`font-[var(--font-weight-medium)] ${highlightClassName}`}>
          {differenceCount}개
        </span>{' '}
        적어요
      </>
    )
  }

  return (
    <>
      지난 달보다{' '}
      <span className={`font-[var(--font-weight-medium)] ${highlightClassName}`}>
        {differenceCount}개 더
      </span>{' '}
      작성하고 있어요
    </>
  )
}

export const DiarySummaryCard = ({
  variant,
  title,
  value,
  unit,
  currentMonthCount,
  previousMonthCount,
  bestStreakDays,
  mostUsedTagRatio,
}: DiarySummaryCardProps) => {
  const Icon = SUMMARY_ICON[variant]
  const style = SUMMARY_CARD_STYLE[variant]

  return (
    <article
      className={`relative h-[152px] min-w-0 overflow-hidden rounded-(--scale-12) ${style.backgroundClassName}`}
    >
      <div
        className={`relative z-10 flex h-full flex-col py-(--scale-16) pl-(--scale-20) ${style.textAreaClassName}`}
      >
        <h3 className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
          {title}
        </h3>

        {variant === 'tag' ? (
          <div className="mt-[17px] flex min-w-0 flex-col">
            <strong className="truncate [font-size:var(--font-size-heading-2)] leading-[51px] font-[var(--font-weight-semibold)] text-(--color-text-default)">
              {value}
            </strong>

            <p className="-mt-[3px] h-[26px] whitespace-nowrap [font-size:var(--font-size-body-3)] leading-[26px] font-[var(--font-weight-regular)] text-(--color-text-secondary)">
              전체의{' '}
              <span className={`font-[var(--font-weight-medium)] ${style.highlightClassName}`}>
                {mostUsedTagRatio}%
              </span>
              를 차지하고 있어요
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex h-[77px] items-end gap-[2px]">
              <strong className="[font-size:var(--font-size-heading-1)] leading-[77px] font-[var(--font-weight-semibold)] text-(--color-text-default)">
                {value}
              </strong>

              {unit && (
                <span className="mb-[11px] [font-size:var(--font-size-body-2)] leading-[43px] font-[var(--font-weight-semibold)] text-(--color-text-default)">
                  {unit}
                </span>
              )}
            </div>

            <p className="-mt-(--scale-12) h-[26px] whitespace-nowrap [font-size:var(--font-size-body-3)] leading-[26px] font-[var(--font-weight-regular)] text-(--color-text-secondary)">
              {variant === 'monthly' &&
                currentMonthCount !== undefined &&
                previousMonthCount !== undefined &&
                renderMonthlyDescription(
                  currentMonthCount,
                  previousMonthCount,
                  style.highlightClassName,
                )}

              {variant === 'streak' && (
                <>
                  최고 기록은{' '}
                  <span className={`font-[var(--font-weight-medium)] ${style.highlightClassName}`}>
                    {bestStreakDays}일
                  </span>
                  이었어요
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <Icon aria-hidden className={style.iconClassName} />
    </article>
  )
}
