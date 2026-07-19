import LeftIcon from '@/assets/icons/Direction=left.svg?react'
import TrashIcon from '@/assets/icons/trash.svg?react'
import { IconButton } from '@/components/common/Button/IconButton'

interface DiaryDetailHeaderProps {
  dateLabel: string
  onBack: () => void
  onDelete?: () => void
  hideDelete?: boolean
}

export const DiaryDetailHeader = ({
  dateLabel,
  onBack,
  onDelete,
  hideDelete,
}: DiaryDetailHeaderProps) => {
  return (
    <header className="flex w-full items-start justify-between">
      <div className="flex items-center gap-(--scale-8)">
        <IconButton
          type="button"
          variant="text_neutral"
          size="small"
          aria-label="월별 기록으로 돌아가기"
          onClick={onBack}
          icon={<LeftIcon aria-hidden className="size-(--scale-24) text-(--color-icon-default)" />}
        />

        <h1 className="[font-size:var(--font-size-heading-4)] leading-(--line-height-heading) font-[var(--font-weight-bold)] text-(--color-text-default)">
          {dateLabel}
        </h1>
      </div>

      {!hideDelete && (
        <IconButton
          type="button"
          variant="text_neutral"
          size="small"
          aria-label="업무 일지 삭제"
          onClick={onDelete}
          icon={
            <TrashIcon aria-hidden className="size-(--scale-24) text-(--color-icon-secondary)" />
          }
        />
      )}
    </header>
  )
}
