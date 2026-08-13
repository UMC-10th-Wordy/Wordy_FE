import type { HTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetHome } from '@/hooks/useHomeQueries'
import { getDailyEntryByDate } from '@/api/daily-entry/dailyEntry'
import { useToast } from '@/hooks/useToast'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'
import { LoadingState } from '@/components/common/AsyncState/AsyncState'
import { IconButton } from '@/components/common/Button/IconButton'
import { ToastContainer } from '@/components/common/Toast/ToastContainer'
import { HomeBanner } from '@/components/home/HomeBanner/HomeBanner'
import { TodayTaskCard } from '@/components/home/TodayTaskCard/TodayTaskCard'
import { StreakCard } from '@/components/home/StreakCard/StreakCard'
import { WEEK_DAYS } from '@/components/home/constants'
import { WeeklyTaskRecord } from '@/components/home/WeeklyTaskRecord/WeeklyTaskRecord'
import { RecentRecordCard } from '@/components/home/RecentRecordCard/RecentRecordCard'
import {
  mapHomeTaskToTodayTask,
  mapHomeTaskToRecentRecordTask,
  mapWeekTasksToWeeklyDays,
  mapWeekRecordsToDayRecords,
  formatRecordDate,
} from '@/utils/homeMapper'
import ArrowRightIcon from '@/assets/icons/Property 1=top_right.svg?react'

export type HomePageProps = HTMLAttributes<HTMLDivElement>

export function HomePage({ className, ...rest }: HomePageProps) {
  const activeWorkspaceId = useActiveWorkspaceId()

  if (!activeWorkspaceId) {
    return <LoadingState message="불러오는 중입니다" className="h-full w-full" />
  }

  return <HomePageContent className={className} {...rest} />
}

function HomePageContent({ className, ...rest }: HomePageProps) {
  const navigate = useNavigate()
  const activeWorkspaceId = useActiveWorkspaceId()
  const { data } = useGetHome()
  const { toasts, addToast } = useToast()

  // /landing은 로그인하지 않은 첫 방문자 전용 페이지라 인증된 유저는 리다이렉트하지 않고
  // 데이터가 비어있는 대시보드로 보여줌
  const { userName, todayTasks, streakDays, weekRecords, weekTasks, recentRecord } =
    data.screenType === 'dashboard'
      ? data
      : {
          userName: undefined,
          todayTasks: [],
          streakDays: 0,
          weekRecords: [],
          weekTasks: [],
          recentRecord: [],
        }
  const latestRecord = recentRecord[0]
  const today = new Date()
  const todayLabel = `${today.getMonth() + 1}월 ${today.getDate()}일 ${WEEK_DAYS[today.getDay()]}요일`

  const goToDailyEntryByDate = async (date: string) => {
    try {
      const entry = await getDailyEntryByDate(activeWorkspaceId, date)
      if (entry) {
        navigate(`/records/${entry.dailyEntryId}`)
      } else {
        addToast('해당 날짜의 기록을 찾을 수 없어요')
      }
    } catch {
      addToast('기록을 불러오지 못했어요. 다시 시도해 주세요')
    }
  }

  return (
    <div className={['p-10', className].filter(Boolean).join(' ')} {...rest}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <g transform="matrix(64.366 62 -56.089 43.527 960 763.5)">
          <foreignObject x="-216.09" y="-216.09" width="432.18" height="432.18">
            <div
              style={{
                backgroundImage:
                  'conic-gradient(from 90deg, rgb(217,228,255) -9.3274%, rgb(217,248,255) 21.842%, rgb(255,255,255) 33.523%, rgb(255,255,255) 70.649%, rgb(244,238,255) 84.074%, rgb(217,228,255) 90.673%, rgb(217,248,255) 121.84%)',
                height: '100%',
                width: '100%',
              }}
            />
          </foreignObject>
        </g>
      </svg>
      <div className="flex flex-col gap-12 pb-10">
        {/* 인사 영역 */}
        <div className="flex flex-col">
          <span className="[font-size:var(--font-size-heading-4)] leading-(--line-height-heading) font-bold text-(--color-text-default)">
            {userName ? `반가워요, ${userName} 님` : '반가워요!'}
          </span>
          <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
            오늘도 워디와 함께해 볼까요?
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {/* 배너 + 오늘의 업무 */}
          <div className="grid grid-cols-3 gap-5 h-81">
            <HomeBanner className="col-span-2" onNavigate={() => navigate('/today')} />
            <TodayTaskCard
              dateLabel={todayLabel}
              tasks={todayTasks.map(mapHomeTaskToTodayTask)}
              onNavigate={() => navigate('/today')}
            />
          </div>

          {/* 나의 기록 현황 + 이번 주 업무 기록 */}
          <div className="grid grid-cols-3 gap-5 h-81">
            <StreakCard streak={streakDays} weekRecord={mapWeekRecordsToDayRecords(weekRecords)} />
            <WeeklyTaskRecord
              className="col-span-2"
              days={mapWeekTasksToWeeklyDays(weekTasks, weekRecords)}
              onDayClick={goToDailyEntryByDate}
            />
          </div>

          {/* 최근 기록 */}
          <div className="h-81 bg-(--color-bg-default) rounded-(--scale-20) border-[0.5px] border-(--color-border-brand-subtle) shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)] p-5">
            <div className="flex items-center justify-between mb-5">
              <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
                최근 기록
              </span>
              <IconButton
                variant="icon_only"
                size="medium"
                iconClassName="size-8"
                icon={<ArrowRightIcon />}
                aria-label="최근 기록 더보기"
                onClick={() => navigate('/records')}
              />
            </div>
            {latestRecord ? (
              <RecentRecordCard
                date={formatRecordDate(latestRecord.date)}
                totalCount={latestRecord.tasks.length}
                tasks={latestRecord.tasks.map(mapHomeTaskToRecentRecordTask)}
                onClick={() => goToDailyEntryByDate(latestRecord.date)}
              />
            ) : (
              <div className="flex items-center justify-center py-16">
                <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                  첫 기록을 시작해 주세요!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  )
}
