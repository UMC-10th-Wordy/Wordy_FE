import { useGetMonthlyDailyEntriesByYearMonth } from '@/hooks/useDiaryListQueries'

import { DiaryMonthlyEntry } from './DiaryMonthlyEntry'

interface DiaryMonthlyEntriesContentProps {
  yearMonth: string
}

export const DiaryMonthlyEntriesContent = ({ yearMonth }: DiaryMonthlyEntriesContentProps) => {
  const { data: entries } = useGetMonthlyDailyEntriesByYearMonth(yearMonth)

  const sortedEntries = [...entries].sort(
    (firstEntry, secondEntry) => secondEntry.day - firstEntry.day,
  )

  const middleIndex = Math.ceil(sortedEntries.length / 2)
  const leftEntries = sortedEntries.slice(0, middleIndex)
  const rightEntries = sortedEntries.slice(middleIndex)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] gap-x-2.5">
      <div className="flex min-w-0 flex-col gap-(--scale-24)">
        {leftEntries.map((entry) => (
          <DiaryMonthlyEntry key={entry.id} entry={entry} />
        ))}
      </div>

      <div
        className="my-(--scale-8) w-px self-stretch"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, var(--color-border-subtle) 0 2px, transparent 2px 4px)',
        }}
        aria-hidden="true"
      />

      <div className="flex min-w-0 flex-col gap-(--scale-24)">
        {rightEntries.map((entry) => (
          <DiaryMonthlyEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
