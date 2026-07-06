import ArrowLeftIcon from '@/assets/icons/Direction=left.svg?react'
import ArrowRightIcon from '@/assets/icons/Direction=right.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'

interface DateHeaderProps {
  date: Date
  subtitle: string
  isPreviewOpen: boolean
  onTogglePreview: () => void
  onPrevDay: () => void
  onNextDay: () => void
  onToday: () => void
}

export default function DateHeader({
  date,
  subtitle,
  isPreviewOpen,
  onTogglePreview,
  onPrevDay,
  onNextDay,
  onToday,
}: DateHeaderProps) {
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`

  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex flex-col items-start whitespace-nowrap">
        <h1 className="[font-size:var(--font-size-heading-4)] leading-(--line-height-body) font-bold text-(--color-text-default)">
          {formattedDate}
        </h1>
        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
          {subtitle}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <TextButton
          type="button"
          variant="text_only"
          size="medium"
          onClick={onTogglePreview}
          aria-pressed={isPreviewOpen}
          className="aria-pressed:bg-(--color-bg-brand-light) aria-pressed:text-(--color-button-hover)"
        >
          성과 미리보기
        </TextButton>
        <IconButton
          type="button"
          variant="text_neutral"
          size="small"
          aria-label="이전 날짜"
          onClick={onPrevDay}
          icon={<ArrowLeftIcon aria-hidden className="size-6" />}
        />
        <TextButton type="button" variant="text_neutral" size="medium" onClick={onToday}>
          오늘
        </TextButton>
        <IconButton
          type="button"
          variant="text_neutral"
          size="small"
          aria-label="다음 날짜"
          onClick={onNextDay}
          icon={<ArrowRightIcon aria-hidden className="size-6" />}
        />
        {/* 캘린더 선택 UI 구현 필요 */}
        <IconButton
          type="button"
          variant="text_neutral"
          size="small"
          aria-label="캘린더 열기"
          icon={<CalendarIcon aria-hidden className="size-6" />}
        />
      </div>
    </div>
  )
}
