import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import DirectionBottomIcon from '@/assets/icons/Direction=bottom.svg?react'
import DirectionRightIcon from '@/assets/icons/Direction=right.svg?react'
import DirectionTopIcon from '@/assets/icons/Direction=top.svg?react'
import { IconButton } from '@/components/common/Button/IconButton'
import ProjectTag from '@/components/todo/ProjectTag'
import { highlightSearchKeyword } from '@/utils/highlightSearchKeyword'

import { SearchResultProjectTag } from './SearchResultProjectTag'

import type { DiarySearchTagResult } from '@/types/diarySearch'

interface TagSearchAccordionProps {
  result: DiarySearchTagResult
  keyword: string
  onDetailClick: (diaryId: string) => void
}

export const TagSearchAccordion = ({ result, keyword, onDetailClick }: TagSearchAccordionProps) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="w-full rounded-(--scale-12) border-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) p-5 shadow-[0_1px_5px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="py-(--scale-12)">
          <SearchResultProjectTag label={result.name} color={result.color} />
        </div>

        <div className="flex items-center gap-(--scale-8) py-(--scale-16)">
          <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-[var(--font-weight-medium)] text-(--color-text-tertiary)">
            이 태그로 작성한 업무 일지 {result.diaries.length}건
          </span>

          <IconButton
            variant="text_neutral"
            size="small"
            icon={
              expanded ? (
                <DirectionTopIcon
                  aria-hidden
                  className="size-(--scale-24) text-(--color-icon-secondary)"
                />
              ) : (
                <DirectionBottomIcon
                  aria-hidden
                  className="size-(--scale-24) text-(--color-icon-secondary)"
                />
              )
            }
            onClick={() => setExpanded((previousExpanded) => !previousExpanded)}
            aria-label={`${result.name} 태그 업무 일지 ${expanded ? '접기' : '펼치기'}`}
            aria-expanded={expanded}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
            className="overflow-hidden"
          >
            <div className="mt-[33px] flex flex-col gap-[33px]">
              {result.diaries.map((diary) => (
                <article key={diary.id} className="w-full py-(--scale-8)">
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
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
