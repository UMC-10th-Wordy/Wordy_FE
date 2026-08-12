import { useParams } from 'react-router-dom'

import { LoadingState } from '@/components/common/AsyncState/AsyncState'
import { DiaryDetailContent } from '@/pages/diary/DiaryDetailPage'
import { useGetTrashDailyEntryDetail } from '@/hooks/useTrashQueries'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'

const TrashDiaryDetailFetcher = ({ diaryId }: { diaryId: string }) => {
  const { data: diary } = useGetTrashDailyEntryDetail(diaryId)

  return <DiaryDetailContent diary={diary} hideDelete />
}

export function TrashDiaryDetailPage() {
  const { diaryId } = useParams<{ diaryId: string }>()
  const activeWorkspaceId = useActiveWorkspaceId()

  if (!diaryId) {
    throw new Error('업무 일지 ID가 없습니다.')
  }

  if (!activeWorkspaceId) {
    return <LoadingState message="불러오는 중입니다" className="h-full w-full" />
  }

  return <TrashDiaryDetailFetcher key={diaryId} diaryId={diaryId} />
}
