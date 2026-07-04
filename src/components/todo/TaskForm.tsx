import chevronDownIcon from '@/assets/icons/Direction=bottom.svg'

export default function TaskForm() {
  return (
    <form className="flex w-full flex-col items-end gap-4 rounded-lg border border-[#ddf] bg-white p-5 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
      {/* 우선순위 / 프로젝트 태그 */}
      <div className="flex w-full flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <p className="font-['Pretendard'] text-base font-medium leading-[1.6] text-[#727272]">
            우선순위 <span className="text-[#ff3f55]">*</span>
          </p>
          {/* 공통 우선순위 컴포넌트 추가 */}
          <div className="flex shrink-0 items-center justify-center gap-1 rounded-lg bg-[#f0f0f0] px-2 py-1">
            <span className="font-['Pretendard'] text-base font-medium leading-[1.6] text-[#4d4d4d]">
              우선순위를 선택해 주세요
            </span>
            <img src={chevronDownIcon} alt="" className="size-4 shrink-0" />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <p className="font-['Pretendard'] text-base font-medium leading-[1.6] text-[#727272]">
            프로젝트 태그
          </p>
          {/* 공통 프로젝트 태그 컴포넌트 추가 */}
          <div className="flex shrink-0 items-center justify-center gap-1 rounded-lg bg-[#f0f0f0] px-2 py-1">
            <span className="font-['Pretendard'] text-base font-medium leading-[1.6] text-[#4d4d4d]">
              프로젝트를 선택해 주세요
            </span>
            <img src={chevronDownIcon} alt="" className="size-4 shrink-0" />
          </div>
        </div>
      </div>

      {/* 업무명 */}
      <div className="flex w-full flex-col items-start gap-2">
        <p className="font-['Pretendard'] text-base font-medium leading-[1.6] text-[#727272]">
          업무명 <span className="text-[#ff3f55]">*</span>
        </p>
        {/* 공통 Input 컴포넌트로 교체 */}
        <div className="flex w-full shrink-0 flex-col items-center rounded-lg border-[0.5px] border-[#ddf] bg-[#fafafc] px-5 py-3">
          <p className="w-full font-['Pretendard'] text-lg font-medium leading-[1.6] text-[#727272]">
            업무명을 입력해 주세요
          </p>
        </div>
      </div>

      {/* 메모 */}
      <div className="flex w-full flex-col items-start gap-2">
        <p className="font-['Pretendard'] text-base font-medium leading-[1.6] text-[#727272]">
          메모
        </p>
        {/* 공통 Textarea 컴포넌트로 교체 */}
        <div className="flex w-full shrink-0 flex-col items-center rounded-lg border-[0.5px] border-[#ddf] bg-[#fafafc] px-5 py-3">
          <p className="w-full font-['Pretendard'] text-lg font-medium leading-[1.6] text-[#727272]">
            업무와 관련한 내용을 자유롭게 적어주세요
          </p>
        </div>
      </div>

      {/* 취소하기 / 업무 추가하기 */}
      <div className="flex shrink-0 items-start gap-3">
        {/* 공통 Button 컴포넌트로 교체 */}
        <button
          type="button"
          className="flex h-11 w-[140px] shrink-0 items-center justify-center gap-1 rounded-lg border border-[#ccc] bg-white px-3"
        >
          <span className="text-right font-['Pretendard'] text-base font-medium leading-[1.6] text-[#4d4d4d]">
            취소하기
          </span>
        </button>
        {/* 공통 Button(disabled) 컴포넌트로 교체 */}
        <button
          type="button"
          disabled
          className="flex h-11 w-[140px] shrink-0 items-center justify-center gap-1 rounded-lg bg-[#f0f0f0] px-3"
        >
          <span className="text-right font-['Pretendard'] text-base font-medium leading-[1.6] text-[#a6a6a6]">
            업무 추가하기
          </span>
        </button>
      </div>
    </form>
  )
}
