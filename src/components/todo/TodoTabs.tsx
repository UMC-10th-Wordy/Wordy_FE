import type { TodoFilter, TodoFilterCounts } from '@/types/todo'

interface TodoTabsProps {
  activeTab: TodoFilter
  counts: TodoFilterCounts
  onChange: (tab: TodoFilter) => void
}

export default function TodoTabs({ activeTab, counts, onChange }: TodoTabsProps) {
  const isCompletedActive = activeTab === 'completed'

  return (
    <div className="flex shrink-0 items-center rounded-lg bg-(--color-bg-brand-light) p-1">
      <button
        type="button"
        onClick={() => onChange('completed')}
        aria-pressed={isCompletedActive}
        className={`flex w-[84px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 ${
          isCompletedActive
            ? 'bg-(--color-bg-default) shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.1)]'
            : ''
        }`}
      >
        <span
          className={`[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium ${isCompletedActive ? 'text-(--color-text-default)' : 'text-(--color-text-tertiary)'}`}
        >
          완료
        </span>
        <span
          className={`[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-semibold ${isCompletedActive ? 'text-(--color-text-brand)' : 'text-(--color-text-brand-subtle)'}`}
        >
          {counts.completed}건
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChange('incomplete')}
        aria-pressed={!isCompletedActive}
        className={`flex w-[100px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 ${
          !isCompletedActive
            ? 'bg-(--color-bg-default) shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.1)]'
            : ''
        }`}
      >
        <span
          className={`[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium ${!isCompletedActive ? 'text-(--color-text-default)' : 'text-(--color-text-tertiary)'}`}
        >
          미완료
        </span>
        <span
          className={`[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-semibold ${!isCompletedActive ? 'text-(--color-text-brand)' : 'text-(--color-text-brand-subtle)'}`}
        >
          {counts.incomplete}건
        </span>
      </button>
    </div>
  )
}
