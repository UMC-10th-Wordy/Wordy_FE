import { useState } from 'react'

import { TextButton } from '@/components/common/Button/TextButton'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/common/Toast/ToastContainer'

import { PerformanceEditableSection } from './PerformanceEditableSection'
import { PerformanceIncompleteTaskList } from './PerformanceIncompleteTaskList'
import { PerformanceReadOnlySection } from './PerformanceReadOnlySection'
import { PerformanceResultProgress } from './PerformanceResultProgress'
import { PerformanceTaskResultCard } from './PerformanceTaskResultCard'

import type { PerformancePreviewResultData } from '@/types/performancePreviewResult'

import {
  clearPerformancePreviewDraft,
  getPerformancePreviewDraft,
  setPerformancePreviewDraft,
} from '@/utils/performance-preview/performancePreviewDraft'

interface PerformancePreviewResultProps {
  data: PerformancePreviewResultData
  reflectionSnapshotId?: string
  draftId?: string
  readOnly?: boolean
  initiallySaved?: boolean
  isSaving?: boolean
  movedTaskIds?: string[]
  onSave?: (values: { summary: string; insight: string }) => void | Promise<void>
  onMoveTaskToTomorrow?: (taskId: string) => void | Promise<void>
}

const formatInsightWithBullet = (insight: string) => {
  return insight
    .split('\n')
    .map((line) => {
      const trimmedLine = line.trim()

      if (trimmedLine.length === 0) {
        return ''
      }

      if (trimmedLine.startsWith('-')) {
        return trimmedLine
      }

      return `- ${trimmedLine}`
    })
    .join('\n')
}

export const PerformancePreviewResult = ({
  data,
  reflectionSnapshotId,
  draftId,
  readOnly = false,
  initiallySaved = false,
  isSaving = false,
  movedTaskIds = [],
  onSave,
  onMoveTaskToTomorrow,
}: PerformancePreviewResultProps) => {
  const resolvedDraftId = draftId ?? reflectionSnapshotId

  const [initialDraft] = useState(() =>
    !readOnly && resolvedDraftId ? getPerformancePreviewDraft(resolvedDraftId) : null,
  )

  const [summary, setSummary] = useState(() => initialDraft?.summary ?? data.summary)

  const [insight, setInsight] = useState(
    () => initialDraft?.insight ?? formatInsightWithBullet(data.insight),
  )

  const displaySummary = readOnly ? data.summary : summary
  const displayInsight = readOnly ? formatInsightWithBullet(data.insight) : insight

  const [isSaved, setIsSaved] = useState(() => initiallySaved && !initialDraft)
  const [pendingMoveTaskIds, setPendingMoveTaskIds] = useState<string[]>([])
  const [isSubmittingSave, setIsSubmittingSave] = useState(false)
  const { toasts, addToast } = useToast()

  const handleChangeSummary = (value: string) => {
    setSummary(value)
    setIsSaved(false)

    if (resolvedDraftId) {
      setPerformancePreviewDraft(resolvedDraftId, {
        summary: value,
        insight,
      })
    }
  }

  const handleChangeInsight = (value: string) => {
    setInsight(value)
    setIsSaved(false)

    if (resolvedDraftId) {
      setPerformancePreviewDraft(resolvedDraftId, {
        summary,
        insight: value,
      })
    }
  }

  const handleMoveTaskToTomorrow = async (taskId: string) => {
    if (
      movedTaskIds.includes(taskId) ||
      pendingMoveTaskIds.includes(taskId) ||
      !onMoveTaskToTomorrow
    ) {
      return
    }

    setPendingMoveTaskIds((prev) => [...prev, taskId])

    try {
      await onMoveTaskToTomorrow(taskId)

      addToast('내일 업무로 변경했어요')
    } catch {
      addToast('내일 업무로 변경하지 못했어요. 다시 시도해 주세요')
    } finally {
      setPendingMoveTaskIds((prev) => prev.filter((id) => id !== taskId))
    }
  }

  const handleSaveDiary = async () => {
    if (!onSave || isSaving || isSaved || isSubmittingSave) {
      return
    }

    setIsSubmittingSave(true)

    try {
      await onSave({ summary, insight })

      if (resolvedDraftId) {
        clearPerformancePreviewDraft(resolvedDraftId)
      }

      setIsSaved(true)
      addToast('업무 일지가 저장되었어요')
    } catch {
      addToast('업무 일지 저장에 실패했어요. 다시 시도해 주세요')
    } finally {
      setIsSubmittingSave(false)
    }
  }

  const unavailableTaskIds = data.incompleteTasks
    .filter((task) => !task.canMoveToTomorrow)
    .map((task) => task.id)

  const disabledMoveTaskIds = [
    ...new Set([...movedTaskIds, ...pendingMoveTaskIds, ...unavailableTaskIds]),
  ]

  return (
    <div
      className={['flex w-full flex-col', readOnly ? 'pb-(--scale-40)' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <PerformanceResultProgress
        totalTaskCount={data.totalTaskCount}
        completedTaskCount={data.completedTaskCount}
        shouldAnimate={!readOnly}
      />

      <div className="mt-(--scale-24)">
        <PerformanceIncompleteTaskList
          tasks={data.incompleteTasks}
          movedTaskIds={disabledMoveTaskIds}
          onMoveToTomorrow={(taskId) => {
            void handleMoveTaskToTomorrow(taskId)
          }}
          readOnly={readOnly}
        />
      </div>

      <div className="mt-(--scale-48)">
        {readOnly ? (
          <PerformanceReadOnlySection title="오늘의 성과 요약" value={displaySummary} />
        ) : (
          <PerformanceEditableSection
            title="오늘의 성과 요약"
            value={summary}
            placeholder="오늘의 성과 요약을 작성해 주세요."
            onChangeValue={handleChangeSummary}
          />
        )}
      </div>

      <div className="mt-(--scale-48)">
        {readOnly ? (
          <PerformanceReadOnlySection title="성장 인사이트" value={displayInsight} showBullet />
        ) : (
          <PerformanceEditableSection
            title="성장 인사이트"
            value={insight}
            placeholder="성장 인사이트를 작성해 주세요."
            onChangeValue={handleChangeInsight}
          />
        )}
      </div>

      {data.nextTasks.length > 0 && (
        <section className="mt-(--scale-48) flex w-full flex-col">
          <h3 className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
            워디가 추천하는 다음 업무
          </h3>

          <ul className="mt-[10px] flex w-full flex-col gap-(--scale-8)">
            {data.nextTasks.map((nextTask, index) => (
              <li key={`${nextTask}-${index}`} className="flex items-start">
                <span className="flex shrink-0 px-(--scale-8) py-[13px]">
                  <span className="h-[3px] w-[3px] rounded-(--scale-1000) bg-(--color-icon-default)" />
                </span>

                <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] text-(--color-text-default)">
                  {nextTask}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-(--scale-48) flex w-full flex-col">
        <h3 className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
          업무별 성과 정리
        </h3>

        <div className="mt-[10px] flex w-full flex-col gap-(--scale-16)">
          {data.taskResults.map((taskResult) => (
            <PerformanceTaskResultCard key={taskResult.id} taskResult={taskResult} />
          ))}
        </div>
      </section>

      {!readOnly && (
        <div className="mt-[60px] mb-(--scale-40)">
          <TextButton
            type="button"
            variant="fill"
            size="large"
            fullWidth
            disabled={isSaved || isSaving || isSubmittingSave}
            onClick={() => {
              void handleSaveDiary()
            }}
            className="[font-size:var(--font-size-body-1)] font-[var(--font-weight-medium)]"
          >
            업무 성과 저장하기
          </TextButton>
        </div>
      )}
      <ToastContainer toasts={toasts} align="left" contained />
    </div>
  )
}
