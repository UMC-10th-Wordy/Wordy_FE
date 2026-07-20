import { useState } from 'react'

import { TextButton } from '@/components/common/Button/TextButton'

import { DiaryListEmptyState } from './DiaryListEmptyState'
import { DiaryMonthlyAccordion } from './DiaryMonthlyAccordion'

import type { MonthlyDiaryRecord } from '@/types/diaryList'

interface DiaryMonthlySectionProps {
  records: MonthlyDiaryRecord[]
}

const MONTHS_PER_PAGE = 4

export const DiaryMonthlySection = ({ records }: DiaryMonthlySectionProps) => {
  const [visibleMonthCount, setVisibleMonthCount] = useState(MONTHS_PER_PAGE)
  const [openRecordIds, setOpenRecordIds] = useState<string[]>([])

  const sortedRecords = [...records].sort((firstRecord, secondRecord) => {
    if (firstRecord.year !== secondRecord.year) {
      return secondRecord.year - firstRecord.year
    }

    return secondRecord.month - firstRecord.month
  })

  const visibleRecords = sortedRecords.slice(0, visibleMonthCount)
  const hasRecords = sortedRecords.length > 0
  const hasMoreRecords = visibleMonthCount < sortedRecords.length

  const handleToggleRecord = (recordId: string) => {
    setOpenRecordIds((currentOpenRecordIds) => {
      const isOpen = currentOpenRecordIds.includes(recordId)

      if (isOpen) {
        return currentOpenRecordIds.filter((openRecordId) => openRecordId !== recordId)
      }

      return [...currentOpenRecordIds, recordId]
    })
  }

  const handleLoadMore = () => {
    setVisibleMonthCount((currentCount) =>
      Math.min(currentCount + MONTHS_PER_PAGE, sortedRecords.length),
    )
  }

  return (
    <section className="mt-(--scale-48) flex min-h-0 flex-1 flex-col">
      <h2 className="h-(--scale-32) shrink-0 [font-size:var(--font-size-body-1)] leading-(--line-height-body) font-(--font-weight-semibold) text-(--color-text-default)">
        월별 기록
      </h2>

      {hasRecords ? (
        <>
          <div className="mt-(--scale-12) flex flex-col gap-(--scale-20)">
            {visibleRecords.map((record) => (
              <DiaryMonthlyAccordion
                key={record.id}
                record={record}
                isOpen={openRecordIds.includes(record.id)}
                onToggle={() => handleToggleRecord(record.id)}
              />
            ))}
          </div>

          {hasMoreRecords && (
            <TextButton
              variant="stroke"
              size="large"
              fullWidth
              className="mt-(--scale-20)"
              onClick={handleLoadMore}
            >
              이전 기록 더 보기
            </TextButton>
          )}
        </>
      ) : (
        <DiaryListEmptyState />
      )}
    </section>
  )
}
