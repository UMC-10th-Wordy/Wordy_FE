const SKELETON_ITEM_COUNT = 7

export const DiarySearchSkeleton = () => {
  return (
    <section
      aria-label="검색 결과 불러오는 중"
      className="mt-(--scale-48) flex w-[800px] flex-col gap-(--scale-32) pb-(--scale-48)"
    >
      {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
        <div key={index} className="py-(--scale-8)">
          <div className="h-(--scale-24) w-[202px] rounded-(--scale-4) bg-(--color-bg-tertiary)" />
          <div className="mt-(--scale-8) h-[36px] w-full rounded-(--scale-4) bg-(--color-bg-tertiary)" />
        </div>
      ))}
    </section>
  )
}
