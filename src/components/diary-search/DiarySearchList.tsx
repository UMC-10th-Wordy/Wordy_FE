import { DiarySearchItem } from './DiarySearchItem'
import { DiarySearchSort } from './DiarySearchSort'

import type { DiarySearchDiary, DiarySearchSort as DiarySearchSortType } from '@/types/diarySearch'

interface DiarySearchListProps {
  diaries: DiarySearchDiary[]
  keyword: string
  sort: DiarySearchSortType
  onSortChange: (sort: DiarySearchSortType) => void
  onDetailClick: (diaryId: string) => void
}

export const DiarySearchList = ({
  diaries,
  keyword,
  sort,
  onSortChange,
  onDetailClick,
}: DiarySearchListProps) => {
  return (
    <section className="mt-(--scale-12) w-[800px] pb-(--scale-40)">
      <DiarySearchSort value={sort} onChange={onSortChange} />

      <div className="mt-(--scale-12) flex flex-col gap-(--scale-32)">
        {diaries.map((diary) => (
          <DiarySearchItem
            key={diary.id}
            diary={diary}
            keyword={keyword}
            onDetailClick={onDetailClick}
          />
        ))}
      </div>
    </section>
  )
}
