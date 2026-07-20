import type { DiarySearchSort as DiarySearchSortType } from '@/types/diarySearch'

interface DiarySearchSortProps {
  value: DiarySearchSortType
  onChange: (value: DiarySearchSortType) => void
}

interface SortButtonProps {
  selected: boolean
  label: string
  onClick: () => void
}

const SortButton = ({ selected, label, onClick }: SortButtonProps) => {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        '[font-size:var(--font-size-body-3)] leading-(--line-height-body)',
        'font-[var(--font-weight-medium)] transition-colors duration-100 ease-out',
        selected
          ? 'text-(--color-text-default)'
          : [
              'text-(--color-text-tertiary)',
              'hover:text-(--color-text-secondary)',
              'active:text-(--color-text-default)',
            ].join(' '),
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export const DiarySearchSort = ({ value, onChange }: DiarySearchSortProps) => {
  return (
    <div className="flex items-center gap-(--scale-12)">
      <SortButton
        selected={value === 'latest'}
        label="최신 순"
        onClick={() => onChange('latest')}
      />

      <span aria-hidden className="h-(--scale-8) w-px bg-(--color-border-subtle)" />

      <SortButton
        selected={value === 'oldest'}
        label="오래된 순"
        onClick={() => onChange('oldest')}
      />
    </div>
  )
}
