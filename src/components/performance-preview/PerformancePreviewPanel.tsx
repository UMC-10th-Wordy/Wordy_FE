import generateBrandIcon from '@/assets/icons/generate-brand.svg'
import emptyStateIllustration from '@/assets/icons/Layer 2.svg'

export default function PerformancePreviewPanel() {
  return (
    <aside className="flex h-screen min-w-[830px] flex-1 items-center justify-center overflow-x-clip overflow-y-auto bg-[#fafafc] p-10">
      <div className="flex h-full w-full flex-1 flex-col items-start gap-12 overflow-clip rounded-2xl border-[1.5px] border-[#ddf] bg-white px-6 py-5 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
        <div className="flex shrink-0 items-center gap-1">
          <h2 className="font-['Pretendard'] text-2xl font-bold leading-[1.6] text-black">
            오늘의 성과 미리보기
          </h2>
          <img src={generateBrandIcon} alt="" className="size-8 shrink-0" />
        </div>
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
          <img src={emptyStateIllustration} alt="" className="h-[129px] w-[253px] shrink-0" />
          <p className="text-center font-['Pretendard'] text-lg font-medium leading-[1.6] text-[#4d4d4d]">
            아직 작성된 내용이 없어요
            <br />
            업무 일지를 작성하고 성과로 변환해 주세요
          </p>
        </div>
      </div>
    </aside>
  )
}
