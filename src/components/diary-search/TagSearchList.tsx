import { TagSearchAccordion } from './TagSearchAccordion'

import type { DiarySearchTagResult } from '@/types/diarySearch'

interface TagSearchListProps {
  results: DiarySearchTagResult[]
  keyword: string
  onDetailClick: (diaryId: string) => void
}

export const TagSearchList = ({ results, keyword, onDetailClick }: TagSearchListProps) => {
  return (
    <section className="mt-(--scale-12) w-[800px] pt-(--scale-32) pb-(--scale-40)">
      <div className="flex flex-col gap-(--scale-20)">
        {results.map((result) => (
          <TagSearchAccordion
            key={result.id}
            result={result}
            keyword={keyword}
            onDetailClick={onDetailClick}
          />
        ))}
      </div>
    </section>
  )
}
