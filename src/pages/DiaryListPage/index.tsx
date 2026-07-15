import { DiaryListHeader } from '@/components/diary-list/DiaryListHeader'
import { DiarySummarySection } from '@/components/diary-list/DiarySummarySection'
import { DIARY_SUMMARY_MOCK } from '@/components/diary-list/diaryListMock'

export const DiaryListPage = () => {
  return (
    <main className="min-h-screen w-full flex-1 bg-(--color-bg-default)">
      {/* TODO(#29): 사이드바 레이아웃 연결 후 남은 콘텐츠 영역 기준으로 동작하는지 확인 */}

      <div className="flex w-full flex-col px-(--scale-40) pt-(--scale-40) pb-[60px]">
        <DiaryListHeader />

        <DiarySummarySection summary={DIARY_SUMMARY_MOCK} />
      </div>
    </main>
  )
}
