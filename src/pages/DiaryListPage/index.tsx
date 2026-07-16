import { DiaryListHeader } from '@/components/diary-list/DiaryListHeader'
import { DiarySummarySection } from '@/components/diary-list/DiarySummarySection'
import { DIARY_SUMMARY_MOCK } from '@/components/diary-list/diaryListMock'
import { DiaryMonthlySection } from '@/components/diary-list/DiaryMonthlySection'
import { DIARY_MONTHLY_RECORDS } from '@/components/diary-list/diaryMonthlyMock'

export const DiaryListPage = () => {
  return (
    <main className="min-h-screen w-full flex-1 bg-(--color-bg-default)">
      <div className="flex w-full flex-col px-(--scale-40) pt-(--scale-40) pb-[60px]">
        <DiaryListHeader />

        <DiarySummarySection summary={DIARY_SUMMARY_MOCK} />
        <DiaryMonthlySection records={DIARY_MONTHLY_RECORDS} />
      </div>
    </main>
  )
}
