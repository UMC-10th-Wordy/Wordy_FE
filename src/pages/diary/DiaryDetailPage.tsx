import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useDeleteDailyEntry, useGetDailyEntryDetail } from '@/hooks/useDiaryListQueries'

import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'

import { DeleteDiaryDialog } from '@/components/diary-detail/DeleteDiaryDialog'
import { DiaryDetailHeader } from '@/components/diary-detail/DiaryDetailHeader'
import { DiaryRetrospective } from '@/components/diary-detail/DiaryRetrospective'
import { ReadOnlyTaskCard } from '@/components/diary-detail/ReadOnlyTaskCard'
import { PERFORMANCE_PREVIEW_RESULT_MOCK } from '@/mocks/performance-preview/performancePreviewResultMock'
import { PerformancePreviewPanel } from '@/components/performance-preview/PerformancePreviewPanel'
import TodoTabs from '@/components/todo/TodoTabs'

import type { TodoFilter, TodoFilterCounts } from '@/types/todo'

const formatDateLabel = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)

  return `${year}년 ${month}월 ${day}일`
}

interface DiaryDetailPageProps {
  hideDelete?: boolean
}

interface DiaryDetailContentProps {
  diaryId: string
  hideDelete?: boolean
}

const DiaryDetailContent = ({ diaryId, hideDelete }: DiaryDetailContentProps) => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<TodoFilter>('completed')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data: diary } = useGetDailyEntryDetail(diaryId)

  const { mutate: deleteDiary, isPending: isDeletePending } = useDeleteDailyEntry()

  const handleBack = () => {
    navigate(-1)
  }

  const handleDeleteDiary = () => {
    if (isDeletePending) {
      return
    }

    deleteDiary(diaryId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        navigate('/records', { replace: true })
      },
      onError: (error) => {
        console.error('업무 일지 삭제에 실패했습니다.', error)
      },
    })
  }

  const completedTasks = diary.tasks.filter((task) => task.isCompleted)
  const incompleteTasks = diary.tasks.filter((task) => !task.isCompleted)

  const activeTasks = activeTab === 'completed' ? completedTasks : incompleteTasks

  const filterCounts: TodoFilterCounts = {
    completed: diary.completedCount,
    incomplete: diary.incompleteCount,
  }

  return (
    <div className="grid h-full min-h-0 min-w-0 flex-1 grid-cols-2 overflow-hidden bg-(--color-bg-default)">
      <main className="flex h-full min-h-0 min-w-0 w-full overflow-x-clip border-x-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default)">
        <Scrollbar scrollbarClassName="py-2 pr-1">
          <div className="flex min-h-full w-full flex-col px-(--scale-40) pt-(--scale-40) pb-[60px]">
            <DiaryDetailHeader
              dateLabel={formatDateLabel(diary.date)}
              onBack={handleBack}
              onDelete={() => setIsDeleteDialogOpen(true)}
              hideDelete={hideDelete}
            />

            <section className="mt-(--scale-48) flex w-full flex-col gap-(--scale-8)">
              <div className="flex w-full items-center justify-between">
                <h2 className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
                  오늘의 업무 일지
                </h2>

                <TodoTabs activeTab={activeTab} counts={filterCounts} onChange={setActiveTab} />
              </div>

              <div className="flex w-full flex-col gap-(--scale-16)">
                {activeTasks.map((task) => (
                  <ReadOnlyTaskCard key={task.id} task={task} />
                ))}
              </div>
            </section>

            <div className="mt-(--scale-48)">
              <DiaryRetrospective content={diary.retrospective} />
            </div>
          </div>
        </Scrollbar>
      </main>

      <div className="h-full min-w-0 overflow-hidden">
        <PerformancePreviewPanel
          key={diary.id}
          status="success"
          result={{
            // TODO(#149): 성과 미리보기 조회 API 연결 후 별도 Query 결과로 교체
            data: PERFORMANCE_PREVIEW_RESULT_MOCK,
            readOnly: true,
          }}
        />
      </div>

      {isDeleteDialogOpen && (
        <DeleteDiaryDialog
          onCancel={() => {
            if (!isDeletePending) {
              setIsDeleteDialogOpen(false)
            }
          }}
          onConfirm={handleDeleteDiary}
        />
      )}
    </div>
  )
}

export const DiaryDetailPage = ({ hideDelete }: DiaryDetailPageProps) => {
  const { diaryId } = useParams<{ diaryId: string }>()

  if (!diaryId) {
    throw new Error('업무 일지 ID가 없습니다.')
  }

  return <DiaryDetailContent diaryId={diaryId} hideDelete={hideDelete} />
}
