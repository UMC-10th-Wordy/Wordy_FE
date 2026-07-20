import { useNavigate } from 'react-router-dom'

import { IconButton } from '@/components/common/Button/IconButton'
import ProjectTag from '@/components/todo/ProjectTag'

import type { MonthlyDiaryEntry as MonthlyDiaryEntryType } from '@/types/diaryList'

import directionRightIcon from '@/assets/icons/Direction=right.svg'

interface DiaryMonthlyEntryProps {
  entry: MonthlyDiaryEntryType
}

export const DiaryMonthlyEntry = ({ entry }: DiaryMonthlyEntryProps) => {
  const navigate = useNavigate()
  const remainingTaskCount = Math.max(entry.totalTaskCount - 1, 0)

  const handleEntryClick = () => {
    // TODO(#65): 업무 일지 조회 API 연결 시 date 대신 diaryId 사용
    navigate(`/records/${entry.date}`)
  }

  return (
    <article className="relative min-w-0 py-(--scale-8) pr-(--scale-40)">
      <button
        type="button"
        className="block w-full min-w-0 cursor-pointer text-left"
        onClick={handleEntryClick}
      >
        <div className="flex min-w-0 items-center gap-[9px]">
          <span className="shrink-0 [font-size:var(--font-size-body-4)] leading-(--line-height-body) font-(--font-weight-medium) text-(--color-text-tertiary)">
            {entry.day}일
          </span>

          <div className="flex min-w-0 flex-1 items-center gap-[9px]">
            {entry.representativeTask.projectTag && (
              <ProjectTag
                label={entry.representativeTask.projectTag.label}
                color={entry.representativeTask.projectTag.color}
              />
            )}

            <p className="max-w-[520px] min-w-0 truncate [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-(--font-weight-semibold) text-(--color-text-default)">
              {entry.representativeTask.title}
            </p>

            {remainingTaskCount > 0 && (
              <span className="shrink-0 [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-(--font-weight-semibold) text-(--color-text-default)">
                외 {remainingTaskCount}건
              </span>
            )}
          </div>
        </div>

        <p className="mt-[7px] truncate pl-[45px] [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-(--font-weight-medium) text-(--color-text-tertiary)">
          {entry.performanceSummary}
        </p>
      </button>

      <IconButton
        variant="text_neutral"
        size="small"
        icon={<img src={directionRightIcon} alt="" aria-hidden="true" className="size-6" />}
        aria-label={`${entry.date} 업무 일지 자세히 보기`}
        className="absolute top-(--scale-8) right-0"
        onClick={handleEntryClick}
      />
    </article>
  )
}
