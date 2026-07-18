import DirectionRightIcon from '@/assets/icons/Direction=right.svg?react'
import { IconButton } from '@/components/common/Button/IconButton'
import ProjectTag from '@/components/todo/ProjectTag'
import { highlightSearchKeyword } from '@/utils/highlightSearchKeyword'

import type { DiarySearchDiary } from '@/types/diarySearch'

interface DiarySearchItemProps {
  diary: DiarySearchDiary
  keyword: string
  onDetailClick: (diaryId: string) => void
}

export const DiarySearchItem = ({ diary, keyword, onDetailClick }: DiarySearchItemProps) => {
  return (
    <article className="w-full py-(--scale-8)">
      <time className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-[var(--font-weight-medium)] text-(--color-text-tertiary)">
        {diary.displayDate}
      </time>

      <div className="mt-[7px] flex min-w-0 items-center">
        {diary.tag && (
          <div className="mr-[9px] shrink-0">
            <ProjectTag label={diary.tag.name} color={diary.tag.color} />
          </div>
        )}

        <p className="min-w-0 flex-1 truncate [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
          {highlightSearchKeyword(diary.title, keyword)}
        </p>

        <div className="ml-[9px] shrink-0">
          <IconButton
            variant="text_neutral"
            size="small"
            icon={
              <DirectionRightIcon
                aria-hidden
                className="size-(--scale-24) text-(--color-icon-secondary)"
              />
            }
            onClick={() => onDetailClick(diary.id)}
            aria-label={`${diary.displayDate} 업무 일지 자세히 보기`}
          />
        </div>
      </div>
    </article>
  )
}
