import DirectionLeftIcon from '@/assets/icons/Direction=left.svg?react'
import { IconButton } from '@/components/common/Button/IconButton'

interface DiarySearchBackButtonProps {
  onClick: () => void
  iconSize?: string
  iconColor?: string
}

export const DiarySearchBackButton = ({
  onClick,
  iconSize = 'size-(--scale-40)',
  iconColor = 'text-(--color-icon-secondary)',
}: DiarySearchBackButtonProps) => {
  return (
    <div className="flex items-center gap-(--scale-8)">
      <IconButton
        variant="text_neutral"
        size="large"
        iconClassName={iconSize}
        icon={<DirectionLeftIcon aria-hidden className={iconColor} />}
        onClick={onClick}
        aria-label="뒤로 가기"
      />

      <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-[var(--font-weight-medium)] text-(--color-text-secondary)">
        뒤로 가기
      </span>
    </div>
  )
}
