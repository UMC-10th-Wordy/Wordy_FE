import SuccessIcon from '@/assets/icons/success.svg?react'
import type { ReactNode } from 'react'

export interface ToastProps {
  message: ReactNode
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-[10px] px-8 py-4 rounded-(--scale-12) bg-(--color-bg-default) shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)]"
    >
      <SuccessIcon
        width={32}
        height={32}
        aria-hidden
        className="shrink-0 text-(--color-icon-brand)"
      />
      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary) whitespace-nowrap">
        {message}
      </span>
    </div>
  )
}
