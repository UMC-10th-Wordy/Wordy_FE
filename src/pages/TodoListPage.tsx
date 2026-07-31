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
import { performanceQueryKeys } from '@/api/performance/performance'
import { dailyEntryQueryKeys } from '@/api/daily-entry/dailyEntry'
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [activeTab, setActiveTab] = useState<TodoFilter>(() =>
    readStoredActiveTab(toDateKey(new Date())),
  )
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loadedDateKey, setLoadedDateKey] = useState<string | null>(null)
  const [collapsedTaskIds, setCollapsedTaskIds] = useState<Set<string>>(new Set())
  const [retrospectiveByDate, setRetrospectiveByDate] = useState<Record<string, string>>({})
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false)

  const currentDateKey = toDateKey(currentDate)
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
  const { data: profile, isPending: isProfilePending } = useGetProfile()
  const performancePreview = usePerformancePreview()
  const moveTaskToTomorrowMutation = useMoveTaskToTomorrow()
  const updatePerformanceMutation = useUpdatePerformance()

  const questionChat = usePerformanceQuestionChat({
    isActive: performancePreview.status === 'questioning',
    questions: performancePreview.questions,
    onFinish: (answers) => {
      void performancePreview.completeQuestioning(answers).catch(() => {
        // usePerformancePreview 내부에서 failed 상태로 전환
      })
    },
  })

  const { data: fetchedTasks } = useGetTasksByDate(currentDateKey)

  const { data: performanceList } = useGetPerformancesByDate(currentDateKey)

  const savedPerformanceDetail =
    performanceList?.exists && performanceList.performance ? performanceList.performance : null

  const savedPerformanceId = savedPerformanceDetail?.dailyPerformanceId ?? null

  if (loadedDateKey !== currentDateKey) {
    setLoadedDateKey(currentDateKey)
    setTasks((prev) => [...prev.filter((task) => task.date !== currentDateKey), ...fetchedTasks])
  }

  const tasksForDate = tasks.filter((task) => task.date === currentDateKey)
  const retrospective = retrospectiveByDate[currentDateKey] ?? ''

  const savedPerformanceResult = savedPerformanceDetail
    ? mapPerformanceDetailResult(savedPerformanceDetail, tasksForDate)
    : null

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
    if (!values.tag?.id) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        date: currentDateKey,
        title: values.title,
        memo: values.memo,
        tag: values.tag,
        priority: values.priority,
        isCompleted: activeTab === 'completed',
      }
      setTasks((prev) => [...prev, newTask])
      setIsTaskFormOpen(false)
      return
    }
    try {
      const created = await createTask(
        mapDraftToCreateTaskPayload({
          title: values.title,
          priority: values.priority,
          date: currentDateKey,
          tagId: values.tag.id,
          memo: values.memo,
        }),
      )
      setTasks((prev) => [...prev, mapTaskDtoToTask(created)])
      queryClient.setQueryData<TaskDto[]>(taskQueryKeys.list(currentDateKey), (prev) =>
        prev ? [...prev, created] : [created],
      )
      setIsTaskFormOpen(false)
    } catch {
      addToast('업무 생성에 실패했어요. 다시 시도해 주세요')
    }
  }

  const handleDeleteTask = async (id: string) => {
    const target = tasks.find((task) => task.id === id)
    if (!target?.tag?.id) {
      setTasks((prev) => prev.filter((task) => task.id !== id))
      return
    }
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      queryClient.setQueryData<TaskDto[]>(taskQueryKeys.list(target.date), (prev) =>
        prev ? prev.filter((task) => task.taskId !== id) : prev,
      )
    } catch {
      addToast('업무 삭제에 실패했어요. 다시 시도해 주세요')
    }
  }

  const handleEditTask = async (id: string, values: TaskDraftValues) => {
    const target = tasks.find((task) => task.id === id)
    if (!target?.tag?.id || !values.tag?.id) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                title: values.title,
                memo: values.memo,
                tag: values.tag,
                priority: values.priority,
              }
            : task,
        ),
      )
      return
    }
    try {
      const updated = await updateTask(
        id,
        mapDraftToUpdateTaskPayload({
          title: values.title,
          priority: values.priority,
          date: target.date,
          tagId: values.tag.id,
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
      queryClient.setQueryData<TaskDto[]>(taskQueryKeys.list(target.date), (prev) =>
        prev
          ? prev.map((task) =>
              task.taskId === id ? { ...updated, taskResult: task.taskResult } : task,
            )
          : prev,
      )
    } catch {
      addToast('업무 수정에 실패했어요. 다시 시도해 주세요')
    }
  }

  const handleSaveResult = async (id: string, values: TaskResultValues) => {
    const target = tasks.find((task) => task.id === id)
    if (!target?.tag?.id) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                result: values.result,
                resultFiles: values.resultFiles,
                resultImages: values.resultImages,
              }
            : task,
        ),
      )
      return
    }

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
      const saved = await saveTaskResult(id, {
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
      getTaskDetail(id)
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

    if (!target.tag?.id) {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, isCompleted: nextCompleted } : task)),
      )
      addToast(nextCompleted ? '완료 업무로 이동되었어요' : '미완료 업무로 이동되었어요')
      return
    }

    pendingToggleIds.current.add(id)
    try {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.list(target.date) })
      const updated = await updateTask(
        id,
        mapDraftToUpdateTaskPayload({
          title: target.title,
          priority: target.priority,
          date: target.date,
          tagId: target.tag.id,
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
      queryClient.setQueryData<TaskDto[]>(taskQueryKeys.list(target.date), (prev) =>
        prev
          ? prev.map((task) =>
              task.taskId === id ? { ...updated, taskResult: task.taskResult } : task,
            )
          : prev,
      )
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
    reorderTasks(reorderPayload)
      .then(() => {
        queryClient.setQueryData<TaskDto[]>(taskQueryKeys.list(currentDateKey), (prev) => {
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
        })
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
    if (isPreviewOpen && savedPerformanceId) {
      performancePreview.resetPreview()
    }

    setIsPreviewOpen((prev) => !prev)
  }

  const handleChangeDate = (date: Date) => {
    performancePreview.resetPreview()
    questionChat.resetQuestionChat()
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
    const nextDate = new Date(currentDate)
    nextDate.setDate(nextDate.getDate() + 1)

    const nextDateKey = toDateKey(nextDate)

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
  }

  /* 성과 변환 클릭 시 성과 미리보기 패널을 변환 중 상태로 오픈 */
  const handleSavePerformance = async (values: { summary: string; insight: string }) => {
    await performancePreview.saveResult(values)

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: performanceQueryKeys.all,
      }),
      queryClient.invalidateQueries({
        queryKey: dailyEntryQueryKeys.all,
      }),
    ])
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
        queryKey: performanceQueryKeys.all,
      }),
      queryClient.invalidateQueries({
        queryKey: dailyEntryQueryKeys.all,
      }),
    ])
  }

  const handleConvert = async () => {
    if (isProfilePending) {
      return
    }

    questionChat.resetQuestionChat()
    performancePreview.preparePreview()
    setIsPreviewOpen(true)

    if (!profile) {
      performancePreview.failPreview()
      return
    }

    const projectTagId = tasksForDate.find((task) => task.tag?.id)?.tag?.id

    try {
      const projectTagDetail = projectTagId ? await getTagDetail(projectTagId) : undefined

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
        className="flex h-full min-h-0 min-w-0 flex-none flex-col overflow-x-clip border-x-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default)"
      >
        <Scrollbar>
          <div className="flex w-full flex-col gap-12 px-10 pt-10">
            <DateHeader
              date={currentDate}
              tasks={tasks}
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
                    icon={<PlusIcon aria-hidden className="size-8 text-(--color-icon-brand)" />}
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
                        <p className="w-[504px] text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
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
                        isNarrow={isPreviewOpen}
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
                        isNarrow={isPreviewOpen}
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
                        isNarrow={isPreviewOpen}
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
                value={retrospective}
                onChange={(event) =>
                  setRetrospectiveByDate((prev) => ({
                    ...prev,
                    [currentDateKey]: event.target.value,
                  }))
                }
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
                  isSaving: performancePreview.isSaving,
                  onSave: handleSavePerformance,
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
                  initiallySaved: true,
                  isSaving: updatePerformanceMutation.isPending,
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

      <ToastContainer toasts={toasts} />
    </div>
  )
}
