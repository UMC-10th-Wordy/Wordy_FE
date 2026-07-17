import FailIcon from '@/assets/icons/fail.svg?react'

export const DiaryListEmptyState = () => {
  return (
    <div className="mt-(--scale-20) flex min-h-0 flex-1 items-center justify-center">
      <div className="flex flex-col items-center">
        <FailIcon aria-hidden className="size-(--scale-32) shrink-0 text-(--color-icon-brand)" />

        <p className="mt-(--scale-12) text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-medium)] whitespace-pre-line text-(--color-text-secondary)">
          {'저장된 업무 일지가 없어요\n기록을 시작하고 성과로 변환해 주세요!'}
        </p>
      </div>
    </div>
  )
}
