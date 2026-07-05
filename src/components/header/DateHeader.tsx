import arrowLeftIcon from '@/assets/icons/Direction=left.svg'
import arrowRightIcon from '@/assets/icons/Direction=right.svg'
import calendarIcon from '@/assets/icons/calendar.svg'

interface DateHeaderProps {
  date: Date
  subtitle: string
  isPreviewOpen: boolean
  onTogglePreview: () => void
  onPrevDay: () => void
  onNextDay: () => void
  onToday: () => void
}

export default function DateHeader({
  date,
  subtitle,
  isPreviewOpen,
  onTogglePreview,
  onPrevDay,
  onNextDay,
  onToday,
}: DateHeaderProps) {
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`

  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex flex-col items-start whitespace-nowrap">
        <h1 className="font-['Pretendard'] text-2xl font-bold leading-[1.6] text-black">
          {formattedDate}
        </h1>
        <p className="font-['Pretendard'] text-lg font-normal leading-[1.6] text-[#727272]">
          {subtitle}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {/* 공통 Button(텍스트) 컴포넌트로 교체 - 성과 미리보기 토글 */}
        <button
          type="button"
          onClick={onTogglePreview}
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
          onClick={onPrevDay}
          aria-label="이전 날짜"
          className="flex size-8 shrink-0 items-center justify-center rounded-md"
        >
          <img src={arrowLeftIcon} alt="" className="size-6 shrink-0" />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="flex h-11 shrink-0 items-center gap-1 rounded-lg px-3"
        >
          <span className="font-['Pretendard'] text-base font-medium leading-[1.6] text-[#4d4d4d]">
            오늘
          </span>
        </button>
        <button
          type="button"
          onClick={onNextDay}
          aria-label="다음 날짜"
          className="flex size-8 shrink-0 items-center justify-center rounded-md"
        >
          <img src={arrowRightIcon} alt="" className="size-6 shrink-0" />
        </button>
        {/* 캘린더 클릭 로직 구현 필요 */}
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-md"
        >
          <img src={calendarIcon} alt="" className="size-6 shrink-0" />
        </button>
      </div>
    </div>
  )
}
