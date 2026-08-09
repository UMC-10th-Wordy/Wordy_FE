import CheckIcon from '@/assets/icons/check-bold.svg?react'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import type { DiaryEntry } from '@/types/dashboard'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'
import { useNavigate } from 'react-router-dom'
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg?react'

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

  const navigate = useNavigate()

  return (
    <aside className="flex h-[748px] min-w-[513px] max-w-[576px] flex-1 shrink flex-col gap-5 rounded-xl border border-[#DDDDFF] shadow-[0px_1px_5px_0px_#0000001A]bg-(--color-bg-default) p-6">
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
            width={32}
            height={32}
            className="rounded-full bg-(--color-button-default) p-[3px] text-(--color-text-inverse)"
          />
          <p className="[font-size:var(--font-size-body-2)] leading-[1.6] text-center text-(--color-text-tertiary)">
            이번 주에 변환한 업무 일지가 없어요
          </p>
        </div>
      ) : (
        <Scrollbar className="flex-1">
          <ul className="flex flex-col gap-1">
            {entries.map((entry) => {
              const checked = selectedIds.includes(entry.id)
              const unconverted = entry.converted === false
              return (
                <li key={entry.id} className="flex h-[52px] items-center gap-2.5 py-2.5">
                  <button
                    type="button"
                    onClick={() => onToggle(entry.id)}
                    aria-pressed={checked}
                    disabled={disabled || unconverted}
                    className="flex min-w-0 flex-1 items-center gap-2.5 disabled:cursor-not-allowed"
                  >
                    <span
                      className={[
                        'flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors',
                        unconverted
                          ? 'border-(--color-border-disabled) bg-(--color-bg-secondary)'
                          : disabled
                            ? checked
                              ? 'border-transparent bg-(--color-icon-tertiary)'
                              : 'border-(--color-border-disabled) bg-(--color-bg-secondary)'
                            : checked
                              ? 'border-(--color-button-default) bg-(--color-button-default)'
                              : 'border-(--color-border-subtle) bg-(--color-bg-default)',
                      ].join(' ')}
                    >
                      {checked && !unconverted && (
                        <CheckIcon width={16} height={16} className="text-(--color-text-inverse)" />
                      )}
                    </span>
                    <span
                      className={[
                        '[font-size:var(--font-size-body-2)] leading-[1.6] font-medium',
                        disabled || unconverted
                          ? 'text-(--color-text-disabled)'
                          : 'text-(--color-text-secondary)',
                      ].join(' ')}
                    >
                      {entry.label}
                    </span>
                  </button>
                  {unconverted && (
                    <button
                      type="button"
                      onClick={() => navigate(`/today?date=${entry.date ?? ''}`)}
                      className="flex shrink-0 items-center gap-1 [font-size:var(--font-size-body-4)] leading-[1.6] font-medium text-(--color-button-default)"
                    >
                      성과 생성하기
                      <ArrowLeftIcon
                        aria-hidden="true"
                        width={20}
                        height={20}
                        className="rotate-180"
                      />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </Scrollbar>
      )}
    </aside>
  )
}
