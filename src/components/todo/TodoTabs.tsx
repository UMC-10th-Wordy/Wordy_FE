import type { TodoFilter, TodoFilterCounts } from '@/types/todo'

interface TodoTabsProps {
  activeTab: TodoFilter
  counts: TodoFilterCounts
  onChange: (tab: TodoFilter) => void
}

export default function TodoTabs({ activeTab, counts, onChange }: TodoTabsProps) {
  const isCompletedActive = activeTab === 'completed'

  return (
    <div className="flex shrink-0 items-center rounded-lg bg-[#f4f4ff] p-1">
      <button
        type="button"
        onClick={() => onChange('completed')}
        aria-pressed={isCompletedActive}
        className={`flex w-[84px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 ${
          isCompletedActive ? 'bg-white shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.1)]' : ''
        }`}
      >
        <span
          className={`font-['Pretendard'] text-base font-medium leading-[1.6] ${
            isCompletedActive ? 'text-[#111111]' : 'text-[#727272]'
          }`}
        >
          완료
        </span>
        <span
          className={`font-['Pretendard'] text-xs font-semibold leading-[1.6] ${
            isCompletedActive ? 'text-[#5d5df1]' : 'text-[#a5a5ff]'
          }`}
        >
          {counts.completed}건
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChange('incomplete')}
        aria-pressed={!isCompletedActive}
        className={`flex w-[100px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 ${
          !isCompletedActive ? 'bg-white shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.1)]' : ''
        }`}
      >
        <span
          className={`font-['Pretendard'] text-base font-medium leading-[1.6] ${
            !isCompletedActive ? 'text-[#111111]' : 'text-[#727272]'
          }`}
        >
          미완료
        </span>
        <span
          className={`font-['Pretendard'] text-xs font-semibold leading-[1.6] ${
            !isCompletedActive ? 'text-[#5d5df1]' : 'text-[#a5a5ff]'
          }`}
        >
          {counts.incomplete}건
        </span>
      </button>
    </div>
  )
}
