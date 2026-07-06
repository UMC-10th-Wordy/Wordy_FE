import { useState } from 'react'
import TaskForm from '@/components/todo/TaskForm'
import TaskCard from '@/components/todo/TaskCard'
import TodoTabs from '@/components/todo/TodoTabs'
import PerformancePreviewPanel from '@/components/performance-preview/PerformancePreviewPanel'
import DateHeader from '@/components/header/DateHeader'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import { Input2 } from '@/components/common/Input/Input2'
import type { Task, TodoFilter, TodoFilterCounts } from '@/types/todo'
import ErrorIcon from '@/assets/icons/error.svg?react'
import GenerateIcon from '@/assets/icons/generate.svg?react'
import FailIcon from '@/assets/icons/fail.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import ExpandIcon from '@/assets/icons/Property 1=top_right.svg?react'

const MEMO_SAMPLE = '지난 분기 OKR 정리 / 디자인 시스템 V_2 진행 현황 슬라이드 1장'

const mustDoTasks: Task[] = []

const shouldDoTasks: Task[] = [
  {
    id: 'should-1',
    title: 'Product Strategy Alignment 회의 준비',
    tag: { label: '온보딩 리뉴얼', color: 'green' },
    priority: 'should',
    isCompleted: false,
  },
]

const couldDoTasks: Task[] = [
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

const incompleteTaskCount = mustDoTasks.length + shouldDoTasks.length + couldDoTasks.length

export default function TodoListPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TodoFilter>('incomplete')
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  const filterCounts: TodoFilterCounts = { completed: 2, incomplete: incompleteTaskCount }

  const shiftDate = (days: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev)
      next.setDate(next.getDate() + days)
      return next
    })
  }

  const goToToday = () => setCurrentDate(new Date())

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
                  icon={<PlusIcon aria-hidden className="size-8 text-(--color-icon-secondary)" />}
                />
              </div>
              <TodoTabs activeTab={activeTab} counts={filterCounts} onChange={setActiveTab} />
            </div>

            {activeTab === 'incomplete' ? (
              incompleteTaskCount === 0 && !isTaskFormOpen ? (
                /* 미완료 업무 없음 */
                <div className="flex h-[180px] w-full flex-col items-center justify-center gap-1 py-10">
                  <FailIcon aria-hidden className="size-8 shrink-0 text-(--color-icon-brand)" />
                  <p className="w-[504px] text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                    오늘의 업무를 모두 완료했어요
                  </p>
                </div>
              ) : (
                <div className="flex w-full flex-col gap-8">
                  {isTaskFormOpen && <TaskForm onCancel={() => setIsTaskFormOpen(false)} />}

                  <div className="flex w-full flex-col gap-2">
                    <div>
                      <p className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-brand)">
                        Must do
                      </p>
                      <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                        반드시 오늘 끝낼 거예요
                      </p>
                    </div>
                    {mustDoTasks.length > 0 && (
                      <div className="flex w-full flex-wrap items-start gap-4">
                        {mustDoTasks.map((task) => (
                          <div key={task.id} className="min-w-[718px] flex-1">
                            <TaskCard task={task} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {shouldDoTasks.length > 0 && (
                    <div className="flex w-full flex-col gap-2">
                      <div>
                        <p className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-brand)">
                          Should do
                        </p>
                        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                          가능하면 오늘 완료할 거예요
                        </p>
                      </div>
                      <div className="flex w-full flex-wrap items-start gap-4">
                        {shouldDoTasks.map((task) => (
                          <div key={task.id} className="min-w-[718px] flex-1">
                            <TaskCard task={task} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {couldDoTasks.length > 0 && (
                    <div className="flex w-full flex-col gap-2">
                      <div>
                        <p className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-brand)">
                          Could do
                        </p>
                        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                          여유가 있으면 진행할 거예요
                        </p>
                      </div>
                      <div className="flex w-full flex-wrap items-start gap-4">
                        <div className="flex min-w-[718px] flex-1 flex-col gap-4">
                          {couldDoTasks.slice(0, 2).map((task) => (
                            <TaskCard key={task.id} task={task} />
                          ))}
                        </div>
                        <div className="min-w-[718px] flex-1">
                          {couldDoTasks.slice(2).map((task) => (
                            <TaskCard key={task.id} task={task} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-(--color-border-subtle) px-5 py-10">
                <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                  완료된 업무 화면
                </p>
                <p className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-normal text-(--color-text-disabled)">
                  구현 예정
                </p>
              </div>
            )}
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
    </div>
  )
}
