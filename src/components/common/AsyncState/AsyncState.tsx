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
      <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-(--font-weight-medium) text-(--color-text-secondary)">
        {message}
      </p>
    </div>
  )
}

export function ErrorState({ message, className }: AsyncStateMessageProps) {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`} role="alert">
      <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-(--font-weight-medium) text-(--color-text-secondary)">
        {message}
      </p>
    </div>
  )
}
