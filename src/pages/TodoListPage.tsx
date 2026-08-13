import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import TaskForm from '@/components/todo/TaskForm'
import TodoTabs from '@/components/todo/TodoTabs'
import { PerformancePreviewPanel } from '@/components/performance-preview/PerformancePreviewPanel'
import DateHeader from '@/components/header/DateHeader'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import { Input2 } from '@/components/common/Input/Input2'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/common/Toast/ToastContainer'
import { PrioritySection } from '@/components/todo/PrioritySection'
import { DraggingTaskGhost } from '@/components/todo/DraggingTaskGhost'
import { DragLineIndicator } from '@/components/todo/DragLineIndicator'
import { ConversionNoticeSection } from '@/components/todo/ConversionNoticeSection'
import { RetrospectiveExampleModal } from '@/components/todo/RetrospectiveExampleModal'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'
import { useDragReorder, type DragOverInfo } from '@/hooks/useDragReorder'
import { useFlipAnimation } from '@/hooks/useFlipAnimation'
import { toDateKey } from '@/utils/calendar'
import type {
  Task,
  TaskDraftValues,
  TaskPriority,
  TaskResultValues,
  TodoFilter,
  TodoFilterCounts,
} from '@/types/todo'
import {
  createTask,
  deleteTask,
  getTaskDetail,
  reorderTasks,
  saveTaskResult,
  taskQueryKeys,
  updateTask,
} from '@/api/task/task'
import { homeQueryKeys } from '@/api/home/home'
import { performanceQueryKeys } from '@/api/performance/performance'
import { dailyEntryQueryKeys } from '@/api/daily-entry/dailyEntry'
import {
  useCreateDailyEntry,
  useDeleteDailyEntry,
  useGetDailyEntryByDate,
} from '@/hooks/useDailyEntryQueries'
import { useGetTasksByDate, useMoveTaskToTomorrow } from '@/hooks/useTaskQueries'
import {
  mapDraftToCreateTaskPayload,
  mapDraftToUpdateTaskPayload,
  mapTaskDtoToTask,
  mapTaskResultDtoToValues,
  mapTasksToReorderPayload,
} from '@/utils/taskMapper'
import { getTagDetail } from '@/api/tag/tag'
import { useGetProfile } from '@/hooks/useUserQueries'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'
import { LoadingState } from '@/components/common/AsyncState/AsyncState'
import { usePerformancePreview } from '@/hooks/usePerformancePreview'
import { usePerformanceQuestionChat } from '@/hooks/usePerformanceQuestionChat'
import { useGetPerformancesByDate, useUpdatePerformance } from '@/hooks/usePerformanceQueries'
import {
  mapPerformanceDetailResult,
  mapPerformancePreviewRequest,
  mapTagDtoToPerformanceProjectTag,
} from '@/utils/performance-preview/performancePreviewMapper'
import type { TaskDto } from '@/types/task'
import FailIcon from '@/assets/icons/fail.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import EditIcon from '@/assets/icons/edit.svg?react'
import ExpandIcon from '@/assets/icons/Property 1=top_right.svg?react'

const ACTIVE_TAB_STORAGE_KEY = 'todo-active-tab'

const readStoredActiveTab = (dateKey: string): TodoFilter => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(ACTIVE_TAB_STORAGE_KEY) ?? 'null') as {
      date: string
      tab: TodoFilter
    } | null
    if (
      stored &&
      stored.date === dateKey &&
      (stored.tab === 'completed' || stored.tab === 'incomplete')
    ) {
      return stored.tab
    }
    return 'incomplete'
  } catch {
    return 'incomplete'
  }
}

const parseGrowthInsights = (insight: string): string[] => {
  return insight
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean)
}

export default function TodoListPage() {
  const workspaceId = useActiveWorkspaceId()

  if (!workspaceId) {
    return <LoadingState message="불러오는 중입니다" className="h-screen w-full" />
  }

  return <TodoListPageContent key={workspaceId} workspaceId={workspaceId} />
}

const TWO_COLUMN_MIN_VIEWPORT_WIDTH = 1500

function TodoListPageContent({ workspaceId }: { workspaceId: string }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isViewportNarrow, setIsViewportNarrow] = useState(
    () => window.innerWidth < TWO_COLUMN_MIN_VIEWPORT_WIDTH,
  )

  useEffect(() => {
    const updateIsViewportNarrow = () =>
      setIsViewportNarrow(window.innerWidth < TWO_COLUMN_MIN_VIEWPORT_WIDTH)
    window.addEventListener('resize', updateIsViewportNarrow)
    return () => window.removeEventListener('resize', updateIsViewportNarrow)
  }, [])
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [movedPerformanceTaskIds, setMovedPerformanceTaskIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<TodoFilter>(() =>
    readStoredActiveTab(toDateKey(new Date())),
  )
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loadedDateKey, setLoadedDateKey] = useState<string | null>(null)
  const [collapsedTaskIds, setCollapsedTaskIds] = useState<Set<string>>(new Set())
  const [retrospectiveByDate, setRetrospectiveByDate] = useState<Record<string, string>>({})
  const [isRetrospectiveFocused, setIsRetrospectiveFocused] = useState(false)
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false)

  const currentDateKey = toDateKey(currentDate)

  const nextDate = new Date(currentDate)
  nextDate.setDate(nextDate.getDate() + 1)
  const nextDateKey = toDateKey(nextDate)

  const previousDateKeyRef = useRef(currentDateKey)

  useEffect(() => {
    if (previousDateKeyRef.current === currentDateKey) return
    previousDateKeyRef.current = currentDateKey
    setActiveTab('incomplete')
  }, [currentDateKey])

  useEffect(() => {
    try {
      sessionStorage.setItem(
        ACTIVE_TAB_STORAGE_KEY,
        JSON.stringify({ date: currentDateKey, tab: activeTab }),
      )
    } catch {
      return
    }
  }, [activeTab, currentDateKey])

  const taskListRef = useRef<HTMLDivElement>(null)
  const pendingToggleIds = useRef<Set<string>>(new Set())
  const { toasts, addToast } = useToast()
  const queryClient = useQueryClient()
  const activeWorkspaceId = useActiveWorkspaceId()
  const { data: profile, isPending: isProfilePending } = useGetProfile()
  const performancePreview = usePerformancePreview(currentDateKey)
  const moveTaskToTomorrowMutation = useMoveTaskToTomorrow()
  const updatePerformanceMutation = useUpdatePerformance()
  const createDailyEntryMutation = useCreateDailyEntry()
  const deleteDailyEntryMutation = useDeleteDailyEntry()
  const retrospectiveSaveQueueRef = useRef(Promise.resolve())
  const retrospectiveDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (retrospectiveDebounceRef.current) {
        clearTimeout(retrospectiveDebounceRef.current)
      }
    }
  }, [])

  const questionChat = usePerformanceQuestionChat({
    entryDate: currentDateKey,
    isActive: performancePreview.status === 'questioning',
    questions: performancePreview.questions,
    onFinish: (answers) => {
      void performancePreview.completeQuestioning(answers).catch(() => {
        // usePerformancePreview 내부에서 failed 상태로 전환
      })
    },
  })

  const { data: fetchedTasks } = useGetTasksByDate(currentDateKey)
  const { data: fetchedTomorrowTasks } = useGetTasksByDate(nextDateKey)

  const { data: performanceList } = useGetPerformancesByDate(currentDateKey)

  const { data: fetchedDailyEntry } = useGetDailyEntryByDate(currentDateKey)

  const savedPerformanceDetail =
    performanceList?.exists && performanceList.performance ? performanceList.performance : null

  const savedPerformanceId = savedPerformanceDetail?.dailyPerformanceId ?? null

  if (loadedDateKey !== currentDateKey) {
    setLoadedDateKey(currentDateKey)
    setTasks((prev) => [...prev.filter((task) => task.date !== currentDateKey), ...fetchedTasks])
  }

  const tasksForDate = tasks.filter((task) => task.date === currentDateKey)
  const retrospective =
    retrospectiveByDate[currentDateKey] ?? fetchedDailyEntry?.reflectionContent ?? ''

  const hasResolvedRetrospective =
    currentDateKey in retrospectiveByDate || fetchedDailyEntry !== undefined
  const isRetrospectiveButtonVisible =
    hasResolvedRetrospective && !isRetrospectiveFocused && retrospective.trim().length === 0

  const savedPerformanceResult = savedPerformanceDetail
    ? mapPerformanceDetailResult(savedPerformanceDetail, tasksForDate)
    : null

  const previewIncompleteTasks =
    performancePreview.result?.incompleteTasks ?? savedPerformanceResult?.incompleteTasks ?? []

  const movedTaskIdsFromServer = previewIncompleteTasks
    .filter((previewTask) =>
      fetchedTomorrowTasks.some((tomorrowTask) => tomorrowTask.id === previewTask.id),
    )
    .map((task) => task.id)

  const effectiveMovedPerformanceTaskIds = [
    ...new Set([...movedPerformanceTaskIds, ...movedTaskIdsFromServer]),
  ]

  const completedTasks = tasksForDate.filter((task) => task.isCompleted)
  const incompleteTasks = tasksForDate.filter((task) => !task.isCompleted)
  const activeTasks = activeTab === 'completed' ? completedTasks : incompleteTasks
  const mustDoTasks = activeTasks.filter((task) => task.priority === 'must')
  const shouldDoTasks = activeTasks.filter((task) => task.priority === 'should')
  const couldDoTasks = activeTasks.filter((task) => task.priority === 'could')

  const filterCounts: TodoFilterCounts = {
    completed: completedTasks.length,
    incomplete: incompleteTasks.length,
  }

  const handleAddTask = async (values: TaskDraftValues) => {
    try {
      const created = await createTask(
        workspaceId,
        mapDraftToCreateTaskPayload({
          title: values.title,
          priority: values.priority,
          date: currentDateKey,
          tagId: values.tag?.id,
          memo: values.memo,
          isCompleted: activeTab === 'completed',
        }),
      )
      setTasks((prev) => [...prev, mapTaskDtoToTask(created)])
      queryClient.setQueryData<TaskDto[]>(
        taskQueryKeys.list(workspaceId, currentDateKey),
        (prev) => (prev ? [...prev, created] : [created]),
      )

      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.summary(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.monthlyRecords(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.monthlyEntries(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.searches(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: homeQueryKeys.all(workspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.calendars(workspaceId),
        }),
      ])

      setIsTaskFormOpen(false)
    } catch {
      addToast('업무 생성에 실패했어요. 다시 시도해 주세요')
    }
  }

  const handleDeleteTask = async (id: string) => {
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    try {
      await deleteTask(workspaceId, id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      queryClient.setQueryData<TaskDto[]>(taskQueryKeys.list(workspaceId, target.date), (prev) =>
        prev ? prev.filter((task) => task.taskId !== id) : prev,
      )
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.summary(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.monthlyRecords(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.monthlyEntries(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.searches(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: homeQueryKeys.all(workspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: taskQueryKeys.calendars(workspaceId),
        }),
      ])
    } catch {
      addToast('업무 삭제에 실패했어요. 다시 시도해 주세요')
    }
  }

  const handleEditTask = async (id: string, values: TaskDraftValues) => {
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    try {
      const updated = await updateTask(
        workspaceId,
        id,
        mapDraftToUpdateTaskPayload({
          title: values.title,
          priority: values.priority,
          date: target.date,
          tagId: values.tag?.id,
          memo: values.memo,
          isCompleted: target.isCompleted,
        }),
      )
      const mappedUpdated = mapTaskDtoToTask(updated)
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                ...mappedUpdated,
                taskResultId: task.taskResultId,
                result: task.result,
                resultFiles: task.resultFiles,
                resultImages: task.resultImages,
              }
            : task,
        ),
      )
      queryClient.setQueryData<TaskDto[]>(taskQueryKeys.list(workspaceId, target.date), (prev) =>
        prev
          ? prev.map((task) =>
              task.taskId === id ? { ...updated, taskResult: task.taskResult } : task,
            )
          : prev,
      )
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.summary(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.monthlyRecords(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.monthlyEntries(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: dailyEntryQueryKeys.searches(activeWorkspaceId),
        }),
        queryClient.invalidateQueries({
          queryKey: homeQueryKeys.all(workspaceId),
        }),
      ])
    } catch {
      addToast('업무 수정에 실패했어요. 다시 시도해 주세요')
    }
  }

  const handleSaveResult = async (id: string, values: TaskResultValues) => {
    const target = tasks.find((task) => task.id === id)
    if (!target) return

    const existingAttachmentIds = new Set(
      [...(target.resultFiles ?? []), ...(target.resultImages ?? [])]
        .map((item) => item.attachmentId)
        .filter((attachmentId): attachmentId is string => Boolean(attachmentId)),
    )
    const keptAttachmentIds = new Set(
      [...values.resultFiles, ...values.resultImages]
        .map((item) => item.attachmentId)
        .filter((attachmentId): attachmentId is string => Boolean(attachmentId)),
    )
    const removedAttachmentIds = [...existingAttachmentIds].filter(
      (attachmentId) => !keptAttachmentIds.has(attachmentId),
    )
    const files = [...values.resultFiles, ...values.resultImages]
      .map((item) => item.file)
      .filter((file): file is File => Boolean(file))

    try {
      const saved = await saveTaskResult(workspaceId, id, {
        content: values.result,
        removedAttachmentIds,
        files,
      })
      const mapped = mapTaskResultDtoToValues(saved)
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                taskResultId: mapped.taskResultId,
                result: mapped.result,
                resultFiles: mapped.resultFiles,
                resultImages: mapped.resultImages,
              }
            : task,
        ),
      )
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.all(workspaceId) })
    } catch {
      addToast('업무 결과 저장에 실패했어요. 다시 시도해 주세요')
    }
  }

  const isTaskExpanded = (id: string) => !collapsedTaskIds.has(id)

  const toggleTaskExpanded = (id: string) => {
    const isExpanding = collapsedTaskIds.has(id)
    setCollapsedTaskIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    if (isExpanding) {
      getTaskDetail(workspaceId, id)
        .then((dto) => {
          if (!dto) return
          const mapped = mapTaskDtoToTask(dto)
          setTasks((prev) => {
            const current = prev.find((task) => task.id === id)
            if (
              current &&
              current.date === mapped.date &&
              current.title === mapped.title &&
              current.memo === mapped.memo &&
              current.priority === mapped.priority &&
              current.isCompleted === mapped.isCompleted &&
              current.tag?.id === mapped.tag?.id &&
              current.tag?.label === mapped.tag?.label &&
              current.tag?.color === mapped.tag?.color
            ) {
              return prev
            }
            return prev.map((task) => (task.id === id ? { ...task, ...mapped } : task))
          })
        })
        .catch(() => {})
    }
  }

  const handleToggleComplete = async (id: string) => {
    if (pendingToggleIds.current.has(id)) return
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const nextCompleted = !target.isCompleted

    pendingToggleIds.current.add(id)
    try {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.list(workspaceId, target.date) })
      const updated = await updateTask(
        workspaceId,
        id,
        mapDraftToUpdateTaskPayload({
          title: target.title,
          priority: target.priority,
          date: target.date,
          tagId: target.tag?.id,
          memo: target.memo,
          isCompleted: nextCompleted,
        }),
      )
      const mappedUpdated = mapTaskDtoToTask(updated)
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                ...mappedUpdated,
                taskResultId: task.taskResultId,
                result: task.result,
                resultFiles: task.resultFiles,
                resultImages: task.resultImages,
              }
            : task,
        ),
      )
      queryClient.setQueryData<TaskDto[]>(taskQueryKeys.list(workspaceId, target.date), (prev) =>
        prev
          ? prev.map((task) =>
              task.taskId === id ? { ...updated, taskResult: task.taskResult } : task,
            )
          : prev,
      )
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.all(workspaceId) })
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.calendars(workspaceId) })
      addToast(nextCompleted ? '완료 업무로 이동되었어요' : '미완료 업무로 이동되었어요')
    } catch {
      addToast('업무 상태 변경에 실패했어요. 다시 시도해 주세요')
    } finally {
      pendingToggleIds.current.delete(id)
    }
  }

  const handleTaskDrop = (draggedId: string, over: DragOverInfo) => {
    if (!over.sectionKey) return
    const targetPriority = over.sectionKey as TaskPriority

    const draggedTask = tasks.find((task) => task.id === draggedId)
    if (!draggedTask) return

    const rest = tasks.filter((task) => task.id !== draggedId)
    const movedTask: Task = { ...draggedTask, priority: targetPriority }
    const next = [...rest]

    if (over.itemId) {
      const targetIndex = next.findIndex((task) => task.id === over.itemId)
      if (targetIndex === -1) {
        next.push(movedTask)
      } else {
        next.splice(over.insertAfter ? targetIndex + 1 : targetIndex, 0, movedTask)
      }
    } else {
      let insertAt = next.length
      for (let i = next.length - 1; i >= 0; i -= 1) {
        if (next[i].priority === targetPriority) {
          insertAt = i + 1
          break
        }
      }
      next.splice(insertAt, 0, movedTask)
    }

    setTasks(next)

    const tasksForDay = next.filter((task) => task.date === currentDateKey)
    const reorderPayload = mapTasksToReorderPayload(tasksForDay)
    reorderTasks(workspaceId, reorderPayload)
      .then(() => {
        queryClient.setQueryData<TaskDto[]>(
          taskQueryKeys.list(workspaceId, currentDateKey),
          (prev) => {
            if (!prev) return prev
            const orderIndex = new Map(
              reorderPayload.tasks.map((item, index) => [item.taskId, index]),
            )
            const priorityById = new Map(
              reorderPayload.tasks.map((item) => [item.taskId, item.priority]),
            )
            return prev
              .map((dto) =>
                priorityById.has(dto.taskId)
                  ? { ...dto, priority: priorityById.get(dto.taskId)! }
                  : dto,
              )
              .slice()
              .sort((a, b) => (orderIndex.get(a.taskId) ?? 0) - (orderIndex.get(b.taskId) ?? 0))
          },
        )
        queryClient.invalidateQueries({ queryKey: homeQueryKeys.all(workspaceId) })
      })
      .catch(() => {
        addToast('업무 순서 변경에 실패했어요. 다시 시도해 주세요')
      })
  }

  const { draggingId, overInfo, pointer, startDrag } = useDragReorder({
    onDrop: handleTaskDrop,
  })
  const draggingTask = draggingId ? (tasks.find((task) => task.id === draggingId) ?? null) : null

  useFlipAnimation(taskListRef, [tasks, activeTab])

  const handleTogglePreview = () => {
    setIsPreviewOpen((prev) => !prev)
  }

  const handleChangeDate = (date: Date) => {
    const nextDateKey = toDateKey(date)

    questionChat.restoreQuestionChat(nextDateKey)
    performancePreview.restorePreview(nextDateKey)

    setMovedPerformanceTaskIds([])
    setCurrentDate(date)
  }

  const shiftDate = (days: number) => {
    const next = new Date(currentDate)
    next.setDate(next.getDate() + days)

    handleChangeDate(next)
  }

  const goToToday = () => {
    handleChangeDate(new Date())
  }

  const handleMoveTaskToTomorrow = async (taskId: string): Promise<void> => {
    await moveTaskToTomorrowMutation.mutateAsync({
      taskId,
      taskDate: nextDateKey,
    })

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              date: nextDateKey,
            }
          : task,
      ),
    )

    setMovedPerformanceTaskIds((prev) => (prev.includes(taskId) ? prev : [...prev, taskId]))

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.list(workspaceId, currentDateKey),
      }),
      queryClient.invalidateQueries({
        queryKey: taskQueryKeys.list(workspaceId, nextDateKey),
      }),
    ])
  }

  /* 성과 변환 클릭 시 성과 미리보기 패널을 변환 중 상태로 오픈 */
  const handleSavePerformance = async (values: { summary: string; insight: string }) => {
    await performancePreview.saveResult(values)
  }

  const handleUpdatePerformance = async (values: { summary: string; insight: string }) => {
    if (!savedPerformanceId) {
      throw new Error('수정할 업무 성과 ID가 없습니다.')
    }

    await updatePerformanceMutation.mutateAsync({
      dailyPerformanceId: savedPerformanceId,
      payload: {
        summary: values.summary.trim(),
        growthInsights: parseGrowthInsights(values.insight),
      },
    })

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: performanceQueryKeys.workspace(activeWorkspaceId),
      }),
      queryClient.invalidateQueries({
        queryKey: dailyEntryQueryKeys.workspace(activeWorkspaceId),
      }),
    ])
  }

  const handleFocusRetrospectiveInput = () => {
    const target = document.getElementById('today-retrospective-input')
    if (!target) return

    target.focus({ preventScroll: true })

    const scrollContainer = target.closest('.overflow-y-scroll')
    if (!(scrollContainer instanceof HTMLElement)) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const containerRect = scrollContainer.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const startTop = scrollContainer.scrollTop
    const delta =
      targetRect.top - containerRect.top - containerRect.height / 2 + targetRect.height / 2
    const endTop = startTop + delta
    const duration = 800
    const startTime = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      scrollContainer.scrollTop = startTop + (endTop - startTop) * eased
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  const saveRetrospective = (content: string) => {
    const trimmedRetrospective = content.trim()
    const dailyEntryIdToDelete = fetchedDailyEntry?.dailyEntryId

    retrospectiveSaveQueueRef.current = retrospectiveSaveQueueRef.current
      .then(async () => {
        if (trimmedRetrospective.length === 0) {
          if (dailyEntryIdToDelete) {
            await deleteDailyEntryMutation.mutateAsync(dailyEntryIdToDelete)
          }
          return
        }

        await createDailyEntryMutation.mutateAsync({
          entryDate: currentDateKey,
          reflectionContent: trimmedRetrospective,
        })
      })
      .catch(() => {
        addToast('회고 저장에 실패했어요. 다시 시도해 주세요')
      })
  }

  const handleRetrospectiveChange = (value: string) => {
    setRetrospectiveByDate((prev) => ({
      ...prev,
      [currentDateKey]: value,
    }))

    if (retrospectiveDebounceRef.current) {
      clearTimeout(retrospectiveDebounceRef.current)
    }
    retrospectiveDebounceRef.current = setTimeout(() => {
      saveRetrospective(value)
    }, 1000)
  }

  const handleRetrospectiveBlur = () => {
    setIsRetrospectiveFocused(false)

    if (retrospectiveDebounceRef.current) {
      clearTimeout(retrospectiveDebounceRef.current)
      retrospectiveDebounceRef.current = null
    }
    saveRetrospective(retrospective)
  }

  const handleConvert = async () => {
    if (isProfilePending) {
      return
    }

    questionChat.resetQuestionChat()
    performancePreview.preparePreview()
    setIsPreviewOpen(true)

    if (completedTasks.length === 0) {
      performancePreview.failPreview()
      return
    }

    if (!profile) {
      performancePreview.failPreview()
      return
    }

    const projectTagId = tasksForDate.find((task) => task.tag?.id)?.tag?.id

    try {
      const projectTagDetail = projectTagId
        ? await getTagDetail(workspaceId, projectTagId)
        : undefined

      if (projectTagId && !projectTagDetail) {
        performancePreview.failPreview()
        return
      }

      const performanceRequest = mapPerformancePreviewRequest({
        tasks: tasksForDate,
        projectTag: projectTagDetail
          ? mapTagDtoToPerformanceProjectTag(projectTagDetail)
          : undefined,
      })

      await performancePreview.startPreview({
        entryDate: currentDateKey,
        reflectionContent: retrospective,
        tasks: tasksForDate,
        profile,
        performanceRequest,
      })
    } catch {
      performancePreview.failPreview()
    }
  }

  const hasAnyTaskEverToday = tasksForDate.length > 0
  const isActiveTabEmpty = activeTasks.length === 0

  return (
    <div className="relative flex h-screen min-w-0 flex-1 items-start overflow-x-hidden bg-(--color-bg-default)">
      <motion.main
        initial={false}
        animate={{
          width: isPreviewOpen ? '50%' : '100%',
        }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        className="relative flex h-full min-h-0 min-w-0 flex-none flex-col overflow-x-clip border-x-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default)"
      >
        <Scrollbar scrollbarClassName="py-2 pr-1">
          <div className="flex w-full flex-col gap-12 px-10 pt-10">
            <DateHeader
              date={currentDate}
              subtitle="오늘은 어떤 업무를 하실 예정인가요?"
              isPreviewOpen={isPreviewOpen}
              onTogglePreview={handleTogglePreview}
              onPrevDay={() => shiftDate(-1)}
              onNextDay={() => shiftDate(1)}
              onToday={goToToday}
              onSelectDate={handleChangeDate}
            />

            <section className="flex w-full flex-col gap-2">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
                    오늘의 업무
                  </h2>
                  <IconButton
                    type="button"
                    variant="stroke_neutral"
                    size="medium"
                    aria-label="업무 추가"
                    aria-expanded={isTaskFormOpen}
                    onClick={() => setIsTaskFormOpen((prev) => !prev)}
                    iconClassName="size-8"
                    icon={<PlusIcon aria-hidden className="text-(--color-icon-brand)" />}
                  />
                </div>
                <TodoTabs activeTab={activeTab} counts={filterCounts} onChange={setActiveTab} />
              </div>

              <div ref={taskListRef} className="flex w-full flex-col gap-8">
                {isTaskFormOpen && (
                  <TaskForm onCancel={() => setIsTaskFormOpen(false)} onSubmit={handleAddTask} />
                )}

                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                  className="flex w-full flex-col gap-8"
                >
                  {isActiveTabEmpty ? (
                    !isTaskFormOpen && (
                      <div className="flex h-[180px] w-full flex-col items-center justify-center gap-1 py-10">
                        <FailIcon
                          aria-hidden
                          className="size-8 shrink-0 text-(--color-icon-brand)"
                        />
                        <p className="w-full max-w-126 text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                          {!hasAnyTaskEverToday
                            ? '오늘의 업무를 시작해 볼까요?'
                            : activeTab === 'incomplete'
                              ? '오늘의 업무를 모두 완료했어요'
                              : '오늘 완료한 업무가 없어요'}
                        </p>
                      </div>
                    )
                  ) : (
                    <>
                      <PrioritySection
                        priorityKey="must"
                        title="Must do"
                        description="반드시 오늘 끝낼 거예요"
                        sectionTasks={mustDoTasks}
                        isNarrow={isPreviewOpen || isViewportNarrow}
                        draggingTask={draggingTask}
                        startDrag={startDrag}
                        isTaskExpanded={isTaskExpanded}
                        onToggleTaskExpanded={toggleTaskExpanded}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                        onSaveResult={handleSaveResult}
                        onToggleComplete={handleToggleComplete}
                      />
                      <PrioritySection
                        priorityKey="should"
                        title="Should do"
                        description="가능하면 오늘 완료할 거예요"
                        sectionTasks={shouldDoTasks}
                        isNarrow={isPreviewOpen || isViewportNarrow}
                        draggingTask={draggingTask}
                        startDrag={startDrag}
                        isTaskExpanded={isTaskExpanded}
                        onToggleTaskExpanded={toggleTaskExpanded}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                        onSaveResult={handleSaveResult}
                        onToggleComplete={handleToggleComplete}
                      />
                      <PrioritySection
                        priorityKey="could"
                        title="Could do"
                        description="여유가 있으면 진행할 거예요"
                        sectionTasks={couldDoTasks}
                        isNarrow={isPreviewOpen || isViewportNarrow}
                        draggingTask={draggingTask}
                        startDrag={startDrag}
                        isTaskExpanded={isTaskExpanded}
                        onToggleTaskExpanded={toggleTaskExpanded}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                        onSaveResult={handleSaveResult}
                        onToggleComplete={handleToggleComplete}
                      />
                    </>
                  )}
                </motion.div>
              </div>
            </section>

            <section className="flex w-full flex-col gap-3">
              <div className="flex w-full items-center justify-between">
                <p className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold">
                  <span className="text-(--color-text-default)">오늘의 회고 </span>
                  <span className="text-(--color-text-required)">*</span>
                </p>
                <TextButton
                  type="button"
                  variant="text_only"
                  size="medium"
                  onClick={() => setIsExampleModalOpen(true)}
                  iconRight={<ExpandIcon aria-hidden className="size-7" />}
                >
                  이렇게 작성해 보세요
                </TextButton>
              </div>
              <Input2
                id="today-retrospective-input"
                value={retrospective}
                onChange={(event) => handleRetrospectiveChange(event.target.value)}
                onFocus={() => setIsRetrospectiveFocused(true)}
                onBlur={handleRetrospectiveBlur}
                placeholder="오늘 업무에서 잘했던 점, 배웠던 점, 아쉬운 점 등을 자유롭게 작성해 주세요."
                className="w-full !min-h-[200px]"
              />
            </section>

            <ConversionNoticeSection
              isEnabled={retrospective.trim().length > 0}
              onConvert={handleConvert}
            />
          </div>
        </Scrollbar>

        <AnimatePresence>
          {isRetrospectiveButtonVisible && (
            <motion.div
              key="retrospective-floating-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute right-6 bottom-8"
            >
              <TextButton
                type="button"
                variant="fill"
                size="large"
                iconLeft={<EditIcon aria-hidden />}
                onClick={handleFocusRetrospectiveInput}
                className="!rounded-[1000px] shadow-[0px_1px_15px_0px_rgba(0,0,0,0.1)]"
              >
                회고 작성하기
              </TextButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      <AnimatePresence initial={false}>
        {isPreviewOpen && (
          <motion.div
            key="performance-preview"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
            className="absolute top-0 right-0 h-full w-1/2 overflow-hidden"
          >
            {performancePreview.status === 'questioning' ? (
              <PerformancePreviewPanel
                status="questioning"
                questionChat={{
                  messages: questionChat.messages,
                  answer: questionChat.answer,
                  isWordyTyping: questionChat.isWordyTyping,
                  isFinished: questionChat.isFinished,
                  latestQuestionMessageId: questionChat.latestQuestionMessageId,
                  onChangeAnswer: questionChat.onChangeAnswer,
                  onSubmitAnswer: questionChat.onSubmitAnswer,
                  onSkipQuestion: questionChat.onSkipQuestion,
                }}
              />
            ) : performancePreview.status === 'success' && performancePreview.result ? (
              <PerformancePreviewPanel
                key={`preview-${performancePreview.reflectionSnapshotId}`}
                status="success"
                result={{
                  data: performancePreview.result,
                  reflectionSnapshotId: performancePreview.reflectionSnapshotId ?? undefined,
                  draftId: currentDateKey,
                  initiallySaved: performancePreview.isSaved,
                  isSaving: performancePreview.isSaved
                    ? updatePerformanceMutation.isPending
                    : performancePreview.isSaving,
                  movedTaskIds: effectiveMovedPerformanceTaskIds,
                  onSave: performancePreview.isSaved
                    ? handleUpdatePerformance
                    : handleSavePerformance,
                  onMoveTaskToTomorrow: handleMoveTaskToTomorrow,
                }}
              />
            ) : performancePreview.status === 'converting' ? (
              <PerformancePreviewPanel status="converting" />
            ) : performancePreview.status === 'failed' ? (
              <PerformancePreviewPanel status="failed" />
            ) : savedPerformanceResult ? (
              <PerformancePreviewPanel
                key={`saved-${savedPerformanceId}`}
                status="success"
                result={{
                  data: savedPerformanceResult,
                  draftId: currentDateKey,
                  initiallySaved: true,
                  isSaving: updatePerformanceMutation.isPending,
                  movedTaskIds: effectiveMovedPerformanceTaskIds,
                  onSave: handleUpdatePerformance,
                  onMoveTaskToTomorrow: handleMoveTaskToTomorrow,
                }}
              />
            ) : (
              <PerformancePreviewPanel status="empty" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {draggingTask && pointer && <DraggingTaskGhost task={draggingTask} pointer={pointer} />}

      {draggingTask && overInfo.line && <DragLineIndicator rect={overInfo.line} />}

      {isExampleModalOpen && (
        <RetrospectiveExampleModal onClose={() => setIsExampleModalOpen(false)} />
      )}

      <ToastContainer toasts={toasts} align="left" />
    </div>
  )
}
