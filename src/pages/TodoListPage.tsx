import { useRef, useState } from 'react'
import TaskForm from '@/components/todo/TaskForm'
import TaskCard from '@/components/todo/TaskCard'
import TodoTabs from '@/components/todo/TodoTabs'
import PerformancePreviewPanel from '@/components/performance-preview/PerformancePreviewPanel'
import DateHeader from '@/components/header/DateHeader'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import { Input2 } from '@/components/common/Input/Input2'
import { ToastViewport } from '@/components/todo/ToastViewport'
import { useDragReorder, type DragOverInfo } from '@/hooks/useDragReorder'
import { useFlipAnimation } from '@/hooks/useFlipAnimation'
import { useToastQueue } from '@/hooks/useToastQueue'
import ProjectTag from '@/components/todo/ProjectTag'
import type {
  Task,
  TaskDraftValues,
  TaskPriority,
  TodoFilter,
  TodoFilterCounts,
} from '@/types/todo'
import ErrorIcon from '@/assets/icons/error.svg?react'
import GenerateIcon from '@/assets/icons/generate.svg?react'
import FailIcon from '@/assets/icons/fail.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import ExpandIcon from '@/assets/icons/Property 1=top_right.svg?react'

const MEMO_SAMPLE = '지난 분기 OKR 정리 / 디자인 시스템 V_2 진행 현황 슬라이드 1장'

function splitIntoColumns<T>(items: T[]): [T[], T[]] {
  const left: T[] = []
  const right: T[] = []
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      left.push(item)
    } else {
      right.push(item)
    }
  })
  return [left, right]
}

type PreviewEntry = { kind: 'task'; task: Task } | { kind: 'placeholder' }

function buildSectionPreview(
  sectionTasks: Task[],
  sectionKey: TaskPriority,
  draggingTask: Task | null,
  overInfo: DragOverInfo,
): PreviewEntry[] {
  if (!draggingTask) {
    return sectionTasks.map((task) => ({ kind: 'task', task }))
  }

  const entries: PreviewEntry[] = sectionTasks
    .filter((task) => task.id !== draggingTask.id)
    .map((task) => ({ kind: 'task', task }))

  if (overInfo.sectionKey !== sectionKey) {
    return entries
  }

  if (overInfo.itemId) {
    const targetIndex = entries.findIndex(
      (entry) => entry.kind === 'task' && entry.task.id === overInfo.itemId,
    )
    if (targetIndex === -1) {
      entries.push({ kind: 'placeholder' })
    } else {
      entries.splice(overInfo.insertAfter ? targetIndex + 1 : targetIndex, 0, {
        kind: 'placeholder',
      })
    }
  } else {
    entries.push({ kind: 'placeholder' })
  }

  return entries
}

/* 더미 데이터 */
const INITIAL_TASKS: Task[] = [
  {
    id: 'should-1',
    title: 'Product Strategy Alignment 회의 준비',
    tag: { label: '온보딩 리뉴얼', color: 'green' },
    priority: 'should',
    isCompleted: false,
  },
  {
    id: 'could-1',
    title: 'Product Strategy Alignment 회의 준비',
    memo: MEMO_SAMPLE,
    tag: { label: '디자인 시스템 V2', color: 'pink' },
    priority: 'could',
    isCompleted: false,
  },
  {
    id: 'could-2',
    title: 'Product Strategy Alignment 회의 준비',
    memo: MEMO_SAMPLE,
    tag: { label: '리서치', color: 'navy' },
    priority: 'could',
    isCompleted: false,
  },
  {
    id: 'could-3',
    title: 'Product Strategy Alignment 회의 준비',
    memo: MEMO_SAMPLE,
    tag: { label: '광고', color: 'blue' },
    priority: 'could',
    isCompleted: false,
  },
]

export default function TodoListPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TodoFilter>('incomplete')
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const taskListRef = useRef<HTMLDivElement>(null)
  const { toasts, showToast } = useToastQueue()

  const completedTasks = tasks.filter((task) => task.isCompleted)
  const incompleteTasks = tasks.filter((task) => !task.isCompleted)
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

  const handleToggleComplete = (id: string) => {
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const nextCompleted = !target.isCompleted

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isCompleted: nextCompleted } : task)),
    )
    showToast(nextCompleted ? '완료 업무로 이동되었어요.' : '미완료 업무로 이동되었어요.')
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

  const { draggingId, dragHeight, overInfo, pointer, startDrag } = useDragReorder({
    onDrop: handleTaskDrop,
  })
  const draggingTask = draggingId ? (tasks.find((task) => task.id === draggingId) ?? null) : null

  useFlipAnimation(taskListRef, [
    tasks,
    activeTab,
    draggingId,
    overInfo.itemId,
    overInfo.insertAfter,
    overInfo.sectionKey,
  ])

  const shiftDate = (days: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev)
      next.setDate(next.getDate() + days)
      return next
    })
  }

  const goToToday = () => setCurrentDate(new Date())

  const renderPreviewEntry = (entry: PreviewEntry) => {
    if (entry.kind === 'placeholder') {
      return (
        <div
          key="__placeholder__"
          data-flip-id="__placeholder__"
          style={{ height: dragHeight }}
          className="w-full shrink-0 rounded-lg bg-(--color-bg-tertiary)"
          aria-hidden
        />
      )
    }

    const { task } = entry
    return (
      <div
        key={task.id}
        data-flip-id={task.id}
        data-drag-row="true"
        data-drag-id={task.id}
        data-drag-section={task.priority}
      >
        <TaskCard
          task={task}
          onHandleMouseDown={startDrag(task.id)}
          onDelete={() => handleDeleteTask(task.id)}
          onEdit={(values) => handleEditTask(task.id, values)}
          onToggleComplete={() => handleToggleComplete(task.id)}
        />
      </div>
    )
  }

  const renderPrioritySection = (
    priorityKey: TaskPriority,
    title: string,
    description: string,
    sectionTasks: Task[],
  ) => {
    const previewEntries = buildSectionPreview(sectionTasks, priorityKey, draggingTask, overInfo)
    const [leftColumn, rightColumn] = splitIntoColumns(previewEntries)
    return (
      <div className="flex w-full flex-col gap-2">
        <div>
          <p className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-brand)">
            {title}
          </p>
          <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
            {description}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-start gap-4">
          <div
            className="flex min-h-2 min-w-[718px] flex-1 flex-col gap-4"
            data-drag-section-drop={priorityKey}
          >
            {leftColumn.map(renderPreviewEntry)}
          </div>
          <div
            className="flex min-h-2 min-w-[718px] flex-1 flex-col gap-4"
            data-drag-section-drop={priorityKey}
          >
            {rightColumn.map(renderPreviewEntry)}
          </div>
        </div>
      </div>
    )
  }

  const hasAnyTaskEverToday = tasks.length > 0
  const isActiveTabEmpty = activeTasks.length === 0

  return (
    <div className="flex h-screen w-full items-start bg-(--color-bg-default)">
      {/* 공통 Sidebar 컴포넌트로 교체 예정 */}
      <aside className="h-full w-[260px] shrink-0 bg-[#e5e5e5]" />

      <main className="h-screen flex-1 overflow-x-clip overflow-y-auto border-x-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) px-10 pt-10">
        <div className="flex w-full flex-col gap-12">
          <DateHeader
            date={currentDate}
            subtitle="오늘은 어떤 업무를 하실 예정인가요?"
            isPreviewOpen={isPreviewOpen}
            onTogglePreview={() => setIsPreviewOpen((prev) => !prev)}
            onPrevDay={() => shiftDate(-1)}
            onNextDay={() => shiftDate(1)}
            onToday={goToToday}
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

              {isActiveTabEmpty ? (
                !isTaskFormOpen && (
                  <div className="flex h-[180px] w-full flex-col items-center justify-center gap-1 py-10">
                    <FailIcon aria-hidden className="size-8 shrink-0 text-(--color-icon-brand)" />
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
                  {renderPrioritySection('must', 'Must do', '반드시 오늘 끝낼 거예요', mustDoTasks)}
                  {renderPrioritySection(
                    'should',
                    'Should do',
                    '가능하면 오늘 완료할 거예요',
                    shouldDoTasks,
                  )}
                  {renderPrioritySection(
                    'could',
                    'Could do',
                    '여유가 있으면 진행할 거예요',
                    couldDoTasks,
                  )}
                </>
              )}
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
                iconRight={<ExpandIcon aria-hidden className="size-7" />}
              >
                이렇게 작성해 보세요
              </TextButton>
            </div>
            <Input2
              placeholder="오늘 업무에서 잘했던 점, 배웠던 점, 아쉬운 점 등을 자유롭게 작성해 주세요."
              className="w-full !min-h-[200px]"
            />
          </section>

          <section className="flex w-full flex-col items-center gap-5 pb-[60px]">
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-1">
                <ErrorIcon aria-hidden className="size-5 shrink-0 text-(--color-icon-error)" />
                <p className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-semibold text-(--color-text-secondary)">
                  변환 전, 주의 사항을 꼭 읽어주세요
                </p>
              </div>
              <div className="flex w-full flex-col gap-1 rounded-lg bg-(--color-bg-secondary) px-2 py-3">
                <ul className="w-full list-disc">
                  <li className="ms-[21px] [font-size:var(--font-size-body-4)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                    AI 성과 변환은 입력하신 업무 일지를 바탕으로 수집 및 분석이 진행됩니다.
                  </li>
                </ul>
                <ul className="w-full list-disc">
                  <li className="ms-[21px] [font-size:var(--font-size-body-4)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                    작성하신 내용에 외부 공유가 제한된 정보(기밀자료, 고객 정보 등)를 입력하지
                    않았는지 확인해 주세요.
                  </li>
                </ul>
                <ul className="w-full list-disc">
                  <li className="ms-[21px] [font-size:var(--font-size-body-4)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                    {`'동의 후 분석'을 클릭하시면 상기 내용에 동의하신 것으로 보아 성과 변환 서비스를 제공합니다.`}
                  </li>
                </ul>
                <ul className="w-full list-disc">
                  <li className="ms-[21px] [font-size:var(--font-size-body-4)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                    입력된 데이터는 성과 분석 결과 생성을 위해 일시적으로 처리되며, 사용자의 동의
                    없이 외부에 공개되거나 제3자에게 제공되지 않습니다.
                  </li>
                </ul>
              </div>
            </div>
            <TextButton
              type="button"
              variant="fill"
              size="large"
              fullWidth
              disabled
              iconLeft={<GenerateIcon aria-hidden className="size-8" />}
            >
              동의하고 성과로 변환하기
            </TextButton>
          </section>
        </div>
      </main>

      {isPreviewOpen && <PerformancePreviewPanel />}

      {draggingTask && pointer && (
        <div
          style={{ position: 'fixed', top: pointer.y, left: pointer.x }}
          className="pointer-events-none z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border border-(--color-border-brand-subtle) bg-(--color-bg-default) px-4 py-3 opacity-90 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.2)]"
        >
          {draggingTask.tag && (
            <ProjectTag label={draggingTask.tag.label} color={draggingTask.tag.color} />
          )}
          <span className="max-w-[240px] truncate [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
            {draggingTask.title}
          </span>
        </div>
      )}

      <ToastViewport toasts={toasts} />
    </div>
  )
}
