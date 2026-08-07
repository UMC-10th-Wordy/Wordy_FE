import { AnimatePresence, motion } from 'framer-motion'

import { AsyncBoundary } from '@/components/common/AsyncState/AsyncBoundary'
import { IconButton } from '@/components/common/Button/IconButton'
import ProjectTag from '@/components/todo/ProjectTag'

import { DiaryMonthlyEntriesContent } from './DiaryMonthlyEntriesContent'

import type { MonthlyDiaryRecord } from '@/types/diaryList'

import directionBottomIcon from '@/assets/icons/Direction=bottom.svg'
import directionTopIcon from '@/assets/icons/Direction=top.svg'
import GenerateIcon from '@/assets/icons/generate.svg?react'

interface DiaryMonthlyAccordionProps {
  record: MonthlyDiaryRecord
  isOpen: boolean
  onToggle: () => void
}

export const DiaryMonthlyAccordion = ({ record, isOpen, onToggle }: DiaryMonthlyAccordionProps) => {
  return (
    <article className="relative w-full rounded-(--scale-12) border-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) p-(--scale-20) shadow-[0_1px_5px_rgba(0,0,0,0.1)]">
      <div className="relative">
        <div className="flex items-center gap-[4px]">
          <IconButton
            variant="text_neutral"
            size="medium"
            icon={
              <img
                src={isOpen ? directionTopIcon : directionBottomIcon}
                alt=""
                aria-hidden="true"
                className="size-(--scale-32)"
              />
            }
            aria-label={
              isOpen
                ? `${record.year}년 ${record.month}월 기록 접기`
                : `${record.year}년 ${record.month}월 기록 펼치기`
            }
            aria-expanded={isOpen}
            onClick={onToggle}
          />

          <div className="flex items-baseline gap-(--scale-8)">
            <h3 className="[font-size:var(--font-size-heading-4)] leading-(--line-height-heading) font-(--font-weight-semibold) text-(--color-text-default)">
              {record.year}년 {record.month}월
            </h3>

            <span className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-(--font-weight-medium) text-(--color-text-tertiary)">
              총 {record.diaryDayCount}일 기록
            </span>
          </div>
        </div>

        {record.topProjectTags.length > 0 && (
          <div className="mt-[6px] ml-[48px] flex items-center gap-(--scale-8)">
            {record.topProjectTags.slice(0, 3).map((tag) => (
              <ProjectTag key={tag.id} label={tag.label} color={tag.color} />
            ))}
          </div>
        )}

        <div className="mt-[33px] ml-[48px] flex min-w-0 items-center gap-(--scale-8)">
          <GenerateIcon
            aria-hidden="true"
            className="size-(--scale-24) shrink-0 text-(--color-icon-brand)"
          />

          <p className="min-w-0 flex-1 truncate [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-(--font-weight-regular) text-(--color-text-default)">
            {record.monthlySummary}
          </p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="monthly-entries"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
            className="overflow-hidden"
          >
            <div className="mt-[33px] rounded-(--scale-16) bg-(--color-bg-brand-subtle) p-(--scale-20)">
              <AsyncBoundary
                loadingMessage="월별 기록을 불러오는 중입니다"
                errorMessage="월별 기록을 불러오지 못했어요"
              >
                <DiaryMonthlyEntriesContent yearMonth={record.id} />
              </AsyncBoundary>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
