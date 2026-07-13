import { useEffect, useRef, useState } from 'react'

import { TextButton } from '@/components/common/Button/TextButton'

import { PerformanceEditableSection } from './PerformanceEditableSection'
import { PerformanceIncompleteTaskList } from './PerformanceIncompleteTaskList'
import { PerformanceResultProgress } from './PerformanceResultProgress'
import { PerformanceTaskResultCard } from './PerformanceTaskResultCard'
import { PerformanceToastViewport } from './PerformanceToastViewport'

import type {
  PerformancePreviewResultData,
  PerformanceToast,
} from '@/types/performancePreviewResult'

interface PerformancePreviewResultProps {
  data: PerformancePreviewResultData
  onSave?: (values: { summary: string; insight: string }) => void
  onMoveTaskToTomorrow?: (taskId: string) => void
}

const TOAST_VISIBLE_TIME = 2000
const MAX_TOAST_COUNT = 3

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
  onSave,
  onMoveTaskToTomorrow,
}: PerformancePreviewResultProps) => {
  const [summary, setSummary] = useState(data.summary)
  const [insight, setInsight] = useState(() => formatInsightWithBullet(data.insight))
  const [isSaved, setIsSaved] = useState(false)
  const [movedTaskIds, setMovedTaskIds] = useState<string[]>([])
  const [toasts, setToasts] = useState<PerformanceToast[]>([])
  const toastTimerIdsRef = useRef<number[]>([])

  useEffect(() => {
    return () => {
      toastTimerIdsRef.current.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [])

  const showToast = (message: string) => {
    const toastId = crypto.randomUUID()

    setToasts((prev) => [...prev.slice(-(MAX_TOAST_COUNT - 1)), { id: toastId, message }])

    const timerId = window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== toastId))
    }, TOAST_VISIBLE_TIME)

    toastTimerIdsRef.current.push(timerId)
  }

  const handleChangeSummary = (value: string) => {
    setSummary(value)
    setIsSaved(false)
  }

  const handleChangeInsight = (value: string) => {
    setInsight(value)
    setIsSaved(false)
  }

  const handleMoveTaskToTomorrow = (taskId: string) => {
    if (movedTaskIds.includes(taskId)) {
      return
    }

    setMovedTaskIds((prev) => [...prev, taskId])
    onMoveTaskToTomorrow?.(taskId)
    showToast('내일 업무로 변경했어요')
  }

  const handleSaveDiary = () => {
    onSave?.({ summary, insight })
    setIsSaved(true)
    showToast('업무 일지가 저장되었어요')
  }

  return (
    <div className="flex w-full flex-col">
      <PerformanceResultProgress
        totalTaskCount={data.totalTaskCount}
        completedTaskCount={data.completedTaskCount}
      />

      <div className="mt-(--scale-24)">
        <PerformanceIncompleteTaskList
          tasks={data.incompleteTasks}
          movedTaskIds={movedTaskIds}
          onMoveToTomorrow={handleMoveTaskToTomorrow}
        />
      </div>

      <div className="mt-(--scale-48)">
        <PerformanceEditableSection
          title="오늘의 성과 요약"
          value={summary}
          placeholder="오늘의 성과 요약을 작성해 주세요."
          onChangeValue={handleChangeSummary}
        />
      </div>

      <div className="mt-(--scale-48)">
        <PerformanceEditableSection
          title="성장 인사이트"
          value={insight}
          placeholder="성장 인사이트를 작성해 주세요."
          onChangeValue={handleChangeInsight}
        />
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

      <div className="mt-[60px] mb-(--scale-40)">
        <TextButton
          type="button"
          variant="fill"
          size="large"
          fullWidth
          disabled={isSaved}
          onClick={handleSaveDiary}
          className="![font-size:var(--font-size-body-1)] font-[var(--font-weight-medium)]"
        >
          업무 일지 저장하기
        </TextButton>
      </div>

      <PerformanceToastViewport toasts={toasts} />
    </div>
  )
}
