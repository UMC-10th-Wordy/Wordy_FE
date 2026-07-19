import CheckIcon from '@/assets/icons/check.svg?react'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import type { DiaryEntry } from './dashboard.types'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'

interface DiaryChecklistPanelProps {
  entries: DiaryEntry[]
  totalDays: number
  selectedIds: string[]
  onToggle: (id: string) => void
  disabled?: boolean
}

export const DiaryChecklistPanel = ({
  entries,
  totalDays,
  selectedIds,
  onToggle,
  disabled = false,
}: DiaryChecklistPanelProps) => {
  const isEmpty = entries.length === 0

  return (
    <aside className="flex h-[748px] min-w-[320px] max-w-[576px] flex-1 shrink flex-col gap-5 rounded-xl border border-(--color-border-subtle) bg-(--color-bg-default) p-6">
      <div className="flex items-baseline gap-2">
        <h2 className="[font-size:var(--font-size-body-2)] font-bold text-(--color-text-default)">
          생성에 사용할 업무 일지
        </h2>
        <span className="[font-size:var(--font-size-caption-1)] text-(--color-text-tertiary)">
          전체 {totalDays}일 기록
        </span>
      </div>

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-(--color-text-tertiary)">
          <XMarkIcon
            width={24}
            height={24}
            className="rounded-full bg-(--color-button-default) p-1 text-(--color-text-inverse)"
          />
          <p className="[font-size:var(--font-size-body-4)]">이번 주에 변환한 업무 일지가 없어요</p>
        </div>
      ) : (
        <Scrollbar axis="y" className="flex-1">
          <ul className="flex flex-col gap-1">
            {entries.map((entry) => {
              const checked = selectedIds.includes(entry.id)
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => onToggle(entry.id)}
                    aria-pressed={checked}
                    disabled={disabled}
                    className="flex h-[53px] w-full items-center gap-2.5 py-3 disabled:cursor-not-allowed"
                  >
                    <span
                      className={[
                        'flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors',
                        disabled
                          ? checked
                            ? 'border-transparent bg-(--color-icon-tertiary)'
                            : 'border-(--color-border-disabled) bg-(--color-bg-secondary)'
                          : checked
                            ? 'border-(--color-button-default) bg-(--color-button-default)'
                            : 'border-(--color-border-subtle) bg-(--color-bg-default)',
                      ].join(' ')}
                    >
                      {checked && (
                        <CheckIcon width={22} height={22} className="text-(--color-text-inverse)" />
                      )}
                    </span>
                    <span
                      className={[
                        '[font-size:var(--font-size-body-3)]',
                        disabled ? 'text-(--color-text-disabled)' : 'text-(--color-text-default)',
                      ].join(' ')}
                    >
                      {entry.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Scrollbar>
      )}
    </aside>
  )
}
