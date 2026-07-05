import { useState } from 'react'
import TaskForm from '@/components/todo/TaskForm'
import TaskCard from '@/components/todo/TaskCard'
import TodoTabs from '@/components/todo/TodoTabs'
import PerformancePreviewPanel from '@/components/todo/PerformancePreviewPanel'
import type { Task, TodoFilter, TodoFilterCounts } from '@/types/todo'
import arrowLeftIcon from '@/assets/icons/Direction=left.svg'
import arrowRightIcon from '@/assets/icons/Direction=right.svg'
import calendarIcon from '@/assets/icons/calendar.svg'
import errorIcon from '@/assets/icons/error.svg'
import generateIcon from '@/assets/icons/generate.svg'
import failIcon from '@/assets/icons/fail.svg'

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

  const filterCounts: TodoFilterCounts = { completed: 2, incomplete: incompleteTaskCount }

  const formattedDate = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`

  const shiftDate = (days: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev)
      next.setDate(next.getDate() + days)
      return next
    })
  }

  const goToToday = () => setCurrentDate(new Date())

  return (
    <div className="flex h-screen w-full items-start bg-white">
      {/* 공통 Sidebar 컴포넌트로 교체 예정 */}
      <aside className="h-full w-[260px] shrink-0 bg-[#e5e5e5]" />

      <main className="h-screen flex-1 overflow-x-clip overflow-y-auto border-x-[0.5px] border-[#ddf] bg-white px-10 pt-10">
        <div className="flex w-full flex-col gap-12">
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col items-start whitespace-nowrap">
              <h1 className="font-['Pretendard'] text-2xl font-bold leading-[1.6] text-black">
                {formattedDate}
              </h1>
              <p className="font-['Pretendard'] text-lg font-normal leading-[1.6] text-[#727272]">
                오늘은 어떤 업무를 하실 예정인가요?
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setIsPreviewOpen((prev) => !prev)}
                aria-pressed={isPreviewOpen}
                className={`flex h-11 shrink-0 items-center gap-1 rounded-lg px-3 ${
                  isPreviewOpen ? 'bg-[#f4f4ff]' : ''
                }`}
              >
                <span
                  className={`font-['Pretendard'] text-base font-medium leading-[1.6] ${
                    isPreviewOpen ? 'text-[#4040d2]' : 'text-[#5d5df1]'
                  }`}
                >
                  성과 미리보기
                </span>
              </button>
              <button
                type="button"
                onClick={() => shiftDate(-1)}
                aria-label="이전 날짜"
                className="flex size-8 shrink-0 items-center justify-center rounded-md"
              >
                <img src={arrowLeftIcon} alt="" className="size-6 shrink-0" />
              </button>
              <button
                type="button"
                onClick={goToToday}
                className="flex h-11 shrink-0 items-center gap-1 rounded-lg px-3"
              >
                <span className="font-['Pretendard'] text-base font-medium leading-[1.6] text-[#4d4d4d]">
                  오늘
                </span>
              </button>
              <button
                type="button"
                onClick={() => shiftDate(1)}
                aria-label="다음 날짜"
                className="flex size-8 shrink-0 items-center justify-center rounded-md"
              >
                <img src={arrowRightIcon} alt="" className="size-6 shrink-0" />
              </button>
              <button
                type="button"
                className="flex size-8 shrink-0 items-center justify-center rounded-md"
              >
                <img src={calendarIcon} alt="" className="size-6 shrink-0" />
              </button>
            </div>
          </div>

          <section className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-['Pretendard'] text-xl font-semibold leading-[1.6] text-[#111111]">
                  오늘의 업무
                </h2>
                <button
                  type="button"
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#ccc] bg-white"
                >
                  <span className="size-8 shrink-0" />
                </button>
              </div>
              <TodoTabs activeTab={activeTab} counts={filterCounts} onChange={setActiveTab} />
            </div>

            {activeTab === 'incomplete' ? (
              incompleteTaskCount === 0 ? (
                /* 미완료 업무 없음 */
                <div className="flex h-[180px] w-full flex-col items-center justify-center gap-1 py-10">
                  <img src={failIcon} alt="" className="size-8 shrink-0" />
                  <p className="w-[504px] text-center font-['Pretendard'] text-lg font-normal leading-[1.6] text-[#727272]">
                    오늘의 업무를 모두 완료했어요
                  </p>
                </div>
              ) : (
                <div className="flex w-full flex-col gap-8">
                  <TaskForm />

                  <div className="flex w-full flex-col gap-2">
                    <div>
                      <p className="font-['Pretendard'] text-xl font-semibold leading-[1.6] text-[#5d5df1]">
                        Must do
                      </p>
                      <p className="font-['Pretendard'] text-lg font-normal leading-[1.6] text-[#727272]">
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
                        <p className="font-['Pretendard'] text-xl font-semibold leading-[1.6] text-[#5d5df1]">
                          Should do
                        </p>
                        <p className="font-['Pretendard'] text-lg font-normal leading-[1.6] text-[#727272]">
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
                        <p className="font-['Pretendard'] text-xl font-semibold leading-[1.6] text-[#5d5df1]">
                          Could do
                        </p>
                        <p className="font-['Pretendard'] text-lg font-normal leading-[1.6] text-[#727272]">
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
              <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#ccc] px-5 py-10">
                <p className="font-['Pretendard'] text-lg font-medium leading-[1.6] text-[#727272]">
                  완료된 업무 화면
                </p>
                <p className="font-['Pretendard'] text-sm font-normal leading-[1.6] text-[#a6a6a6]">
                  구현 예정
                </p>
              </div>
            )}
          </section>

          <section className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center justify-between">
              <p className="font-['Pretendard'] text-xl font-semibold leading-[1.6]">
                <span className="text-[#111111]">오늘의 회고 </span>
                <span className="text-[#ff3f55]">*</span>
              </p>
              <button
                type="button"
                className="flex h-11 shrink-0 items-center gap-1 rounded-lg px-3"
              >
                <span className="font-['Pretendard'] text-base font-medium leading-[1.6] text-[#5d5df1]">
                  이렇게 작성해 보세요
                </span>
                <span className="size-7 shrink-0" />
              </button>
            </div>
            <div className="flex h-[200px] min-h-[200px] w-full items-start rounded-lg border-[0.5px] border-[#ddf] bg-[#fafafc] px-5 py-3">
              <p className="w-full font-['Pretendard'] text-lg font-medium leading-[1.6] text-[#727272]">
                오늘 업무에서 잘했던 점, 배웠던 점, 아쉬운 점 등을 자유롭게 작성해 주세요.
              </p>
            </div>
          </section>

          <section className="flex w-full flex-col items-center gap-5 pb-[60px]">
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-1">
                <img src={errorIcon} alt="" className="size-5 shrink-0" />
                <p className="font-['Pretendard'] text-sm font-semibold leading-[1.6] text-[#4d4d4d]">
                  변환 전, 주의 사항을 꼭 읽어주세요
                </p>
              </div>
              <div className="flex w-full flex-col gap-1 rounded-lg bg-[#fafafa] px-2 py-3">
                <ul className="w-full list-disc">
                  <li className="ms-[21px] font-['Pretendard'] text-sm font-medium leading-[1.6] text-[#727272]">
                    AI 성과 변환은 입력하신 업무 일지를 바탕으로 수집 및 분석이 진행됩니다.
                  </li>
                </ul>
                <ul className="w-full list-disc">
                  <li className="ms-[21px] font-['Pretendard'] text-sm font-medium leading-[1.6] text-[#727272]">
                    작성하신 내용에 외부 공유가 제한된 정보(기밀자료, 고객 정보 등)를 입력하지
                    않았는지 확인해 주세요.
                  </li>
                </ul>
                <ul className="w-full list-disc">
                  <li className="ms-[21px] font-['Pretendard'] text-sm font-medium leading-[1.6] text-[#727272]">
                    {`'동의 후 분석'을 클릭하시면 상기 내용에 동의하신 것으로 보아 성과 변환 서비스를 제공합니다.`}
                  </li>
                </ul>
                <ul className="w-full list-disc">
                  <li className="ms-[21px] font-['Pretendard'] text-sm font-medium leading-[1.6] text-[#727272]">
                    입력된 데이터는 성과 분석 결과 생성을 위해 일시적으로 처리되며, 사용자의 동의
                    없이 외부에 공개되거나 제3자에게 제공되지 않습니다.
                  </li>
                </ul>
              </div>
            </div>
            <button
              type="button"
              disabled
              className="flex h-[60px] w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#f0f0f0] px-4"
            >
              <img src={generateIcon} alt="" className="size-8 shrink-0" />
              <span className="font-['Pretendard'] text-xl font-medium leading-[1.6] text-[#a6a6a6]">
                동의하고 성과로 변환하기
              </span>
            </button>
          </section>
        </div>
      </main>

      {isPreviewOpen && <PerformancePreviewPanel />}
    </div>
  )
}
