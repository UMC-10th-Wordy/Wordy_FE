import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'

import { DeleteDiaryDialog } from '@/components/diary-detail/DeleteDiaryDialog'
import { DiaryDetailHeader } from '@/components/diary-detail/DiaryDetailHeader'
import { DiaryRetrospective } from '@/components/diary-detail/DiaryRetrospective'
import { ReadOnlyTaskCard } from '@/components/diary-detail/ReadOnlyTaskCard'
import { DIARY_DETAIL_MOCK } from '@/mocks/diaryDetailMock'
import { PerformancePreviewPanel } from '@/components/performance-preview/PerformancePreviewPanel'
import TodoTabs from '@/components/todo/TodoTabs'

import type { TodoFilter, TodoFilterCounts } from '@/types/todo'

const formatDateLabel = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)

  return `${year}년 ${month}월 ${day}일`
}

export const DiaryDetailPage = ({ hideDelete }: { hideDelete?: boolean }) => {
  const navigate = useNavigate()
  const { diaryId } = useParams<{ diaryId: string }>()

  const [activeTab, setActiveTab] = useState<TodoFilter>('completed')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // TODO(#65): diaryId를 이용한 업무 일지 상세 조회 API 연결
  const diary = {
    ...DIARY_DETAIL_MOCK,
    id: diaryId ?? DIARY_DETAIL_MOCK.id,
    date: diaryId ?? DIARY_DETAIL_MOCK.date,
  }

  const completedTasks = diary.tasks.filter((task) => task.isCompleted)
  const incompleteTasks = diary.tasks.filter((task) => !task.isCompleted)

  const activeTasks = activeTab === 'completed' ? completedTasks : incompleteTasks

  const filterCounts: TodoFilterCounts = {
    completed: completedTasks.length,
    incomplete: incompleteTasks.length,
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleDeleteDiary = () => {
    // TODO(#65): 해당 업무 일지 삭제 API 연결 후 목록 데이터 갱신
    setIsDeleteDialogOpen(false)
    navigate('/records', { replace: true })
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
            data: diary.performance,
            readOnly: true,
          }}
        />
      </div>

      {isDeleteDialogOpen && (
        <DeleteDiaryDialog
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteDiary}
        />
      )}
    </div>
  )
}
