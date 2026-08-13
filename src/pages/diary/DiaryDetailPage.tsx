import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AsyncBoundary } from '@/components/common/AsyncState/AsyncBoundary'
import { useDeleteDailyEntry, useGetDailyEntryDetail } from '@/hooks/useDailyEntryQueries'
import { useGetPerformanceDetail } from '@/hooks/usePerformanceQueries'

import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'

import { LoadingState } from '@/components/common/AsyncState/AsyncState'
import { ToastContainer } from '@/components/common/Toast/ToastContainer'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'
import { useToast } from '@/hooks/useToast'

import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog'
import { DiaryDetailHeader } from '@/components/diary-detail/DiaryDetailHeader'
import { DiaryRetrospective } from '@/components/diary-detail/DiaryRetrospective'
import { ReadOnlyTaskCard } from '@/components/diary-detail/ReadOnlyTaskCard'
import { PerformancePreviewPanel } from '@/components/performance-preview/PerformancePreviewPanel'
import TodoTabs from '@/components/todo/TodoTabs'

import { mapPerformanceDetailResult } from '@/utils/performance-preview/performancePreviewMapper'

import type { DiaryDetailContentData } from '@/types/diaryDetail'
import type { Task, TodoFilter, TodoFilterCounts } from '@/types/todo'

const formatDateLabel = (date: string) => {
  const [year, month, day] = date.split('-').map(Number)

  return `${year}년 ${month}월 ${day}일`
}

interface DiaryDetailPageProps {
  hideDelete?: boolean
}

export interface DiaryDetailContentProps {
  diary: DiaryDetailContentData
  hideDelete?: boolean
}

interface DiaryPerformancePanelProps {
  dailyPerformanceId: string
  diaryId: string
  tasks: Task[]
}

const DiaryPerformancePanel = ({
  dailyPerformanceId,
  diaryId,
  tasks,
}: DiaryPerformancePanelProps) => {
  const { data: performanceDetail } = useGetPerformanceDetail(dailyPerformanceId)

  const performanceResult = mapPerformanceDetailResult(performanceDetail, tasks)

  return (
    <PerformancePreviewPanel
      key={diaryId}
      status="success"
      result={{
        data: performanceResult,
        readOnly: true,
      }}
    />
  )
}

export const DiaryDetailContent = ({ diary, hideDelete }: DiaryDetailContentProps) => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<TodoFilter>(
    diary.completedCount > 0 ? 'completed' : 'incomplete',
  )
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toasts, addToast } = useToast()

  const { mutate: deleteDiary, isPending: isDeletePending } = useDeleteDailyEntry()

  const handleBack = () => {
    navigate(-1)
  }

  const handleDeleteDiary = () => {
    if (isDeletePending) {
      return
    }

    deleteDiary(diary.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        navigate('/records', { replace: true })
      },
      onError: (error) => {
        console.error('업무 일지 삭제에 실패했습니다.', error)
        addToast('일지 삭제에 실패했어요. 다시 시도해 주세요.')
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
          <div className="flex min-h-full w-full flex-col px-(--scale-40) pt-(--scale-40) pb-15">
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

            {diary.retrospective?.trim() && (
              <div className="mt-(--scale-48)">
                <DiaryRetrospective content={diary.retrospective} />
              </div>
            )}
          </div>
        </Scrollbar>
      </main>

      <div className="h-full min-w-0 overflow-hidden">
        {diary.dailyPerformanceId ? (
          <AsyncBoundary
            loadingMessage="성과를 불러오는 중입니다"
            errorMessage="성과를 불러오지 못했어요"
          >
            <DiaryPerformancePanel
              dailyPerformanceId={diary.dailyPerformanceId}
              diaryId={diary.id}
              tasks={diary.tasks}
            />
          </AsyncBoundary>
        ) : (
          <PerformancePreviewPanel status="empty" emptyMessage="변환된 성과가 없어요" />
        )}
      </div>

      {isDeleteDialogOpen && (
        <ConfirmDialog
          message="이 날의 업무 일지를 삭제할까요?"
          onCancel={() => {
            if (!isDeletePending) {
              setIsDeleteDialogOpen(false)
            }
          }}
          onConfirm={handleDeleteDiary}
        />
      )}

      <ToastContainer toasts={toasts} align="left" />
    </div>
  )
}

const DiaryDetailFetcher = ({ diaryId, hideDelete }: { diaryId: string; hideDelete?: boolean }) => {
  const { data: diary } = useGetDailyEntryDetail(diaryId)

  return <DiaryDetailContent diary={diary} hideDelete={hideDelete} />
}

export const DiaryDetailPage = ({ hideDelete }: DiaryDetailPageProps) => {
  const { diaryId } = useParams<{ diaryId: string }>()
  const activeWorkspaceId = useActiveWorkspaceId()

  if (!diaryId) {
    throw new Error('업무 일지 ID가 없습니다.')
  }

  if (!activeWorkspaceId) {
    return <LoadingState message="불러오는 중입니다" className="h-full w-full" />
  }

  return <DiaryDetailFetcher key={diaryId} diaryId={diaryId} hideDelete={hideDelete} />
}
