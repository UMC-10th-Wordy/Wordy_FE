import {
  useGetDailyEntriesSummary,
  useGetMonthlyDailyEntries,
} from '@/api/diary-list/diary-list.query'
import { DiaryListHeader } from '@/components/diary-list/DiaryListHeader'
import { DiaryMonthlySection } from '@/components/diary-list/DiaryMonthlySection'
import { DiarySummarySection } from '@/components/diary-list/DiarySummarySection'

export const DiaryListPage = () => {
  const {
    data: summary,
    isPending: isSummaryPending,
    isError: isSummaryError,
  } = useGetDailyEntriesSummary()

  const {
    data: records,
    isPending: isRecordsPending,
    isError: isRecordsError,
  } = useGetMonthlyDailyEntries()

  const isPending = isSummaryPending || isRecordsPending
  const isError = isSummaryError || isRecordsError

  return (
    <main className="relative z-0 h-full min-w-0 w-full flex-1 bg-(--color-bg-default)">
      <div className="flex min-h-full w-full flex-col px-(--scale-40) pt-(--scale-40) pb-[60px]">
        <DiaryListHeader />

        {/* isPending, isError UI와 문구는 API 테스트를 위해 임의로 지정함. 이후 삭제 예정 */}
        {isPending && (
          <div className="flex flex-1 items-center justify-center" role="status" aria-live="polite">
            <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-(--font-weight-medium) text-(--color-text-secondary)">
              업무 일지를 불러오는 중이에요
            </p>
          </div>
        )}
        {!isPending && isError && (
          <div className="flex flex-1 items-center justify-center" role="alert">
            <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-(--font-weight-medium) text-(--color-text-secondary)">
              업무 일지를 불러오지 못했어요
            </p>
          </div>
        )}

        {!isPending && !isError && summary && records && (
          <>
            <DiarySummarySection summary={summary} />
            <DiaryMonthlySection records={records} />
          </>
        )}
      </div>
    </main>
  )
}
