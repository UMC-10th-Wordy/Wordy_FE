import { useGetDiaryListPageData } from '@/hooks/useDiaryListQueries'
import { DiaryListHeader } from '@/components/diary-list/DiaryListHeader'
import { DiaryMonthlySection } from '@/components/diary-list/DiaryMonthlySection'
import { DiarySummarySection } from '@/components/diary-list/DiarySummarySection'

export const DiaryListPage = () => {
  const { summary, records } = useGetDiaryListPageData()

  return (
    <main className="relative z-0 h-full min-w-0 w-full flex-1 bg-(--color-bg-default)">
      <div className="flex min-h-full w-full flex-col px-(--scale-40) pt-(--scale-40) pb-[60px]">
        <DiaryListHeader />

        <DiarySummarySection summary={summary} />
        <DiaryMonthlySection records={records} />
      </div>
    </main>
  )
}
