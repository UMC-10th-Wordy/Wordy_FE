import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import TaskForm from '@/components/todo/TaskForm'
import TodoTabs from '@/components/todo/TodoTabs'
import { PerformancePreviewPanel } from '@/components/performance-preview/PerformancePreviewPanel'
import DateHeader from '@/components/header/DateHeader'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import { Input2 } from '@/components/common/Input/Input2'
import { useToast } from '@/components/common/Toast/useToast'
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
import { INITIAL_TASKS } from './sampleData'
import FailIcon from '@/assets/icons/fail.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import ExpandIcon from '@/assets/icons/Property 1=top_right.svg?react'

export default function TodoListPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TodoFilter>('incomplete')
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [retrospectiveByDate, setRetrospectiveByDate] = useState<Record<string, string>>({})
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false)
  const [previewStatus, setPreviewStatus] = useState<'empty' | 'converting' | 'failed'>('empty')
  const taskListRef = useRef<HTMLDivElement>(null)
  const { toasts, addToast } = useToast()

  const currentDateKey = toDateKey(currentDate)
  const tasksForDate = tasks.filter((task) => task.date === currentDateKey)
  const retrospective = retrospectiveByDate[currentDateKey] ?? ''

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

  const handleAddTask = (values: TaskDraftValues) => {
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
  }

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const handleEditTask = (id: string, values: TaskDraftValues) => {
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
  }

  const handleSaveResult = (id: string, values: TaskResultValues) => {
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
  }

  const handleToggleComplete = (id: string) => {
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const nextCompleted = !target.isCompleted

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)),
    )
    addToast(nextCompleted ? '완료 업무로 이동되었어요' : '미완료 업무로 이동되었어요')
  }

  const handleTaskDrop = (draggedId: string, over: DragOverInfo) => {
    if (!over.sectionKey) return
    const targetPriority = over.sectionKey as TaskPriority

    setTasks((prev) => {
      const draggedTask = prev.find((task) => task.id === draggedId)
      if (!draggedTask) return prev

      const rest = prev.filter((task) => task.id !== draggedId)
      const movedTask: Task = { ...draggedTask, priority: targetPriority }

      if (over.itemId) {
        const targetIndex = rest.findIndex((task) => task.id === over.itemId)
        if (targetIndex === -1) {
          rest.push(movedTask)
        } else {
          rest.splice(over.insertAfter ? targetIndex + 1 : targetIndex, 0, movedTask)
        }
        return rest
      }

      let insertAt = rest.length
      for (let i = rest.length - 1; i >= 0; i -= 1) {
        if (rest[i].priority === targetPriority) {
          insertAt = i + 1
          break
        }
      }
      rest.splice(insertAt, 0, movedTask)
      return rest
    })
  }

  const { draggingId, overInfo, pointer, startDrag } = useDragReorder({
    onDrop: handleTaskDrop,
  })
  const draggingTask = draggingId ? (tasks.find((task) => task.id === draggingId) ?? null) : null

  useFlipAnimation(taskListRef, [tasks, activeTab])

  const shiftDate = (days: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev)
      next.setDate(next.getDate() + days)
      return next
    })
  }

  const goToToday = () => setCurrentDate(new Date())

  /* 성과 변환 클릭 시 성과 미리보기 패널을 변환 중 상태로 오픈 */
  const handleConvert = () => {
    setPreviewStatus('converting')
    setIsPreviewOpen(true)
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
              onTogglePreview={() => setIsPreviewOpen((prev) => !prev)}
              onPrevDay={() => shiftDate(-1)}
              onNextDay={() => shiftDate(1)}
              onToday={goToToday}
              onSelectDate={setCurrentDate}
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
                        draggingTask={draggingTask}
                        startDrag={startDrag}
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
                        draggingTask={draggingTask}
                        startDrag={startDrag}
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
                        draggingTask={draggingTask}
                        startDrag={startDrag}
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
            <PerformancePreviewPanel status={previewStatus} />
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
