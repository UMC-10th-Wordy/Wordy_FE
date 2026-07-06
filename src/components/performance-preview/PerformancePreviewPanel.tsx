import GenerateIcon from '@/assets/icons/generate.svg?react'
import emptyStateIllustration from '@/assets/icons/Layer 2.svg'

export default function PerformancePreviewPanel() {
  return (
    <aside className="flex h-screen min-w-[830px] flex-1 items-center justify-center overflow-x-clip overflow-y-auto bg-(--color-bg-brand-subtle) p-10">
      <div className="flex h-full w-full flex-1 flex-col items-start gap-12 overflow-clip rounded-2xl border-[1.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) px-6 py-5 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
        <div className="flex shrink-0 items-center gap-1">
          <h2 className="[font-size:var(--font-size-heading-4)] leading-(--line-height-body) font-bold text-(--color-text-default)">
            오늘의 성과 미리보기
          </h2>
          <GenerateIcon aria-hidden className="size-8 shrink-0 text-(--color-icon-brand)" />
        </div>
        {/* 빈 상태 (성과 데이터가 없을 때) */}
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
          <img src={emptyStateIllustration} alt="" className="h-[129px] w-[253px] shrink-0" />
          <p className="text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-secondary)">
            아직 작성된 내용이 없어요
            <br />
            업무 일지를 작성하고 성과로 변환해 주세요
          </p>
        </div>
      </div>
    </aside>
  )
}
