import type { ReactNode } from 'react'
import { TextButton } from '@/components/common/Button/TextButton'
import ErrorIcon from '@/assets/icons/error.svg?react'

export interface ConfirmDialogProps {
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function ConfirmDialog({
  message,
  confirmLabel = '삭제하기',
  cancelLabel = '취소하기',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      {/* dim */}
      <div
        className="absolute inset-0 bg-(--color-bg-overlay) backdrop-blur-xs"
        onClick={onCancel}
      />

      {/* dialog */}
      <div className="relative z-10 flex flex-col gap-5 items-center justify-center px-8 py-5 bg-(--color-bg-default) rounded-(--scale-12) drop-shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col gap-3 items-center">
          <ErrorIcon width={28} height={28} className="text-(--color-icon-brand)" />
          <div className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary) text-center">
            {message}
          </div>
        </div>
        <div className="flex gap-2.5 items-center">
          <TextButton variant="stroke_neutral" size="medium" className="w-32" onClick={onCancel}>
            {cancelLabel}
          </TextButton>
          <TextButton variant="fill" size="medium" className="w-32" onClick={onConfirm}>
            {confirmLabel}
          </TextButton>
        </div>
      </div>
    </div>
  )
}
