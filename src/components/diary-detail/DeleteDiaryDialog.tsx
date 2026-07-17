import { useId } from 'react'
import { createPortal } from 'react-dom'

import ErrorIcon from '@/assets/icons/error.svg?react'
import { TextButton } from '@/components/common/Button/TextButton'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useModalFocus } from '@/hooks/useModalFocus'

interface DeleteDiaryDialogProps {
  onCancel: () => void
  onConfirm: () => void
}

export const DeleteDiaryDialog = ({ onCancel, onConfirm }: DeleteDiaryDialogProps) => {
  const titleId = useId()
  const dialogRef = useModalFocus<HTMLDivElement>()

  useEscapeKey(onCancel)

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <button
        type="button"
        aria-label="삭제 확인창 닫기"
        onClick={onCancel}
        className="absolute inset-0 bg-(--color-bg-overlay)"
      />

      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex flex-col items-center rounded-(--scale-12) bg-(--color-bg-default) px-(--scale-32) py-(--scale-20) shadow-[0px_1px_15px_0px_rgba(0,0,0,0.1)]"
      >
        <ErrorIcon aria-hidden className="size-(--scale-28) shrink-0 text-(--color-icon-brand)" />

        <p
          id={titleId}
          className="mt-(--scale-12) text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] text-(--color-text-secondary)"
        >
          이 날의 업무 일지를 삭제할까요?
        </p>

        <div className="mt-(--scale-20) flex items-center gap-[10px]">
          <TextButton
            type="button"
            variant="stroke_neutral"
            size="medium"
            className="w-32"
            onClick={onCancel}
          >
            취소하기
          </TextButton>

          <TextButton
            type="button"
            variant="fill"
            size="medium"
            className="w-32"
            onClick={onConfirm}
          >
            삭제하기
          </TextButton>
        </div>
      </div>
    </div>,
    document.body,
  )
}
