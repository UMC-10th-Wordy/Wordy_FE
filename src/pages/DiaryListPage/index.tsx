import { DiaryListHeader } from '@/components/diary-list/DiaryListHeader'
import { DiaryMonthlySection } from '@/components/diary-list/DiaryMonthlySection'
import { DIARY_MONTHLY_RECORDS, EMPTY_DIARY_MONTHLY_RECORDS } from '@/mocks/diaryMonthlyMock'
import { DiarySummarySection } from '@/components/diary-list/DiarySummarySection'
import { DIARY_SUMMARY_MOCK, EMPTY_DIARY_SUMMARY_MOCK } from '@/mocks/diaryListMock'

// 업무 일지 기록이 없는 상태를 테스트하기 위한 코드, 실제 서비스에서는 API 호출 결과에 따라 결정
const IS_EMPTY_STATE = false

export const DiaryListPage = () => {
  const summary = IS_EMPTY_STATE ? EMPTY_DIARY_SUMMARY_MOCK : DIARY_SUMMARY_MOCK
  const records = IS_EMPTY_STATE ? EMPTY_DIARY_MONTHLY_RECORDS : DIARY_MONTHLY_RECORDS

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
