import ErrorIcon from '@/assets/icons/error.svg?react'
import { TextButton } from '@/components/common/Button/TextButton'

interface DeleteConfirmDialogProps {
  onCancel: () => void
  onConfirm: () => void
}

/* 업무 카드 삭제 확인 오버레이 */
export function DeleteConfirmDialog({ onCancel, onConfirm }: DeleteConfirmDialogProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-(--color-bg-overlay)">
      <div className="flex flex-col items-center gap-5 rounded-(--scale-12) bg-(--color-bg-default) px-8 py-5 shadow-[0px_1px_7.5px_0px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center gap-3">
          <ErrorIcon aria-hidden className="size-7 text-(--color-icon-brand)" />
          <p className="text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary)">
            이 업무를 삭제할까요?
            <br />
            삭제하면 되돌릴 수 없어요
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <TextButton type="button" variant="stroke_neutral" className="w-32" onClick={onCancel}>
            취소하기
          </TextButton>
          <TextButton type="button" variant="fill" className="w-32" onClick={onConfirm}>
            삭제하기
          </TextButton>
        </div>
      </div>
    </div>
  )
}
