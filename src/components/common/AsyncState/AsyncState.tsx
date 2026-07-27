import SpinnerTrackIcon from '@/assets/icons/spinner-track.svg?react'
import SpinnerArcIcon from '@/assets/icons/spinner-arc.svg?react'
import ErrorIcon from '@/assets/icons/error.svg?react'
import { TextButton } from '@/components/common/Button/TextButton'

interface AsyncStateMessageProps {
  message: string
  className?: string
}

export function LoadingState({ message, className }: AsyncStateMessageProps) {
  return (
    <div
      className={`flex items-center justify-center ${className ?? ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">{message}</span>
      <div className="relative size-16" aria-hidden="true">
        <SpinnerTrackIcon className="absolute inset-0 size-full text-(--color-bg-tertiary)" />
        <SpinnerArcIcon className="absolute inset-0 size-full animate-spin text-(--color-icon-brand)" />
      </div>
    </div>
  )
}

interface ErrorStateProps extends AsyncStateMessageProps {
  onRetry?: () => void
}

export function ErrorState({ message, className, onRetry }: ErrorStateProps) {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`} role="alert">
      <div className="flex w-100 flex-col items-center gap-5 rounded-(--scale-12) bg-(--color-bg-default) px-8 py-5 shadow-[0px_1px_15px_0px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center gap-3">
          <ErrorIcon aria-hidden className="size-9 text-(--color-icon-brand)" />
          <p className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) text-(--color-text-secondary) text-center">
            {message}
          </p>
        </div>
        {onRetry && (
          <TextButton variant="stroke_neutral" size="large" className="w-43.25" onClick={onRetry}>
            다시 시도하기
          </TextButton>
        )}
      </div>
    </div>
  )
}
