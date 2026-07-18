import DirectionLeftIcon from '@/assets/icons/Direction=left.svg?react'
import { IconButton } from '@/components/common/Button/IconButton'

interface DiarySearchBackButtonProps {
  onClick: () => void
}

export const DiarySearchBackButton = ({ onClick }: DiarySearchBackButtonProps) => {
  return (
    <div className="flex items-center gap-(--scale-8)">
      <IconButton
        variant="text_neutral"
        size="large"
        icon={
          <DirectionLeftIcon
            aria-hidden
            className="size-(--scale-40) text-(--color-icon-secondary)"
          />
        }
        onClick={onClick}
        aria-label="뒤로 가기"
      />

      <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-[var(--font-weight-medium)] text-(--color-text-secondary)">
        뒤로 가기
      </span>
    </div>
  )
}
