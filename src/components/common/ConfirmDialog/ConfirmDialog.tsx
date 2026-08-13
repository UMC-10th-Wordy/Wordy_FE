import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { TextButton } from '@/components/common/Button/TextButton'
import ErrorIcon from '@/assets/icons/error.svg?react'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useModalFocus } from '@/hooks/useModalFocus'

/* 중첩된 다이얼로그 중 가장 나중에 마운트된(최상단) 것만 Enter를 처리하도록 하는 스택 */
const confirmStack: string[] = []

export interface ConfirmDialogProps {
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  /** 'viewport': 화면 전체를 덮는 모달(body에 포털) / 'local': 가장 가까운 relative 조상만 덮는 로컬 오버레이 */
  scope?: 'viewport' | 'local'
}

export function ConfirmDialog({
  message,
  confirmLabel = '삭제하기',
  cancelLabel = '취소하기',
  onConfirm,
  onCancel,
  scope = 'viewport',
}: ConfirmDialogProps) {
  const titleId = useId()
  const id = useId()
  const dialogRef = useModalFocus<HTMLDivElement>()
  const isViewport = scope === 'viewport'
  const onConfirmRef = useRef(onConfirm)

  useEffect(() => {
    onConfirmRef.current = onConfirm
  })

  useEscapeKey(() => onCancel?.())

  useEffect(() => {
    confirmStack.push(id)
    return () => {
      const index = confirmStack.indexOf(id)
      if (index !== -1) confirmStack.splice(index, 1)
    }
  }, [id])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      if (confirmStack[confirmStack.length - 1] !== id) return
      onConfirmRef.current?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [id])

  const content = (
    <div
      className={
        isViewport
          ? 'fixed inset-0 z-100 flex items-center justify-center'
          : 'absolute inset-0 z-10 flex items-center justify-center rounded-lg'
      }
    >
      {/* dim */}
      <div
        className={
          isViewport
            ? 'absolute inset-0 bg-(--color-bg-overlay) backdrop-blur-sm'
            : 'absolute inset-0 bg-black/15'
        }
        onClick={onCancel}
      />

      {/* dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal={isViewport}
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 flex flex-col gap-5 items-center justify-center px-8 py-5 bg-(--color-bg-default) rounded-(--scale-12) drop-shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col gap-3 items-center">
          <ErrorIcon width={28} height={28} className="text-(--color-icon-brand)" />
          <div
            id={titleId}
            className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary) text-center"
          >
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

  return isViewport ? createPortal(content, document.body) : content
}
