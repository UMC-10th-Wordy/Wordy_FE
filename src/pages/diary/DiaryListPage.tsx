import { useGetDiaryListPageData } from '@/hooks/useDailyEntryQueries'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'

import { LoadingState } from '@/components/common/AsyncState/AsyncState'
import { DiaryListHeader } from '@/components/diary-list/DiaryListHeader'
import { DiaryMonthlySection } from '@/components/diary-list/DiaryMonthlySection'
import { DiarySummarySection } from '@/components/diary-list/DiarySummarySection'

const DiaryListContent = () => {
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

export const DiaryListPage = () => {
  const activeWorkspaceId = useActiveWorkspaceId()

  if (!activeWorkspaceId) {
    return <LoadingState message="불러오는 중입니다" className="h-full w-full" />
  }

  return <DiaryListContent />
}
