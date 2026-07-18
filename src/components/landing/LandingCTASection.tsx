import ctaLeftImg from '@/assets/images/landing-cta-left.svg?url'
import ctaRightImg from '@/assets/images/landing-cta-right.svg?url'

export function LandingCTASection({ onStart }: { onStart?: () => void }) {
  return (
    <section className="flex w-full items-center justify-center bg-(--color-bg-default) px-10 pb-30 pt-15">
      <div
        className="relative flex h-105 w-full flex-col items-center justify-center gap-12 rounded-(--scale-20) py-15"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(237,228,255,0.5), rgba(217,228,255,0.5) 45.673%, rgba(217,248,255,0.5))',
        }}
      >
        {/* 좌측 캐릭터 — 카드 좌상단, 위로 삐져나옴 */}
        <img
          src={ctaLeftImg}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-[4.84%] top-[-11%] w-68 object-contain hidden lg:block"
        />

        {/* 우측 캐릭터 — 카드 우하단, 아래로 삐져나옴 */}
        <img
          src={ctaRightImg}
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[4.84%] top-[69.3%] w-61 object-contain hidden lg:block"
        />

        {/* 텍스트 */}
        <div className="flex flex-col items-center whitespace-nowrap">
          <p className="[font-size:var(--font-size-heading-1)] font-semibold leading-(--line-height-body) text-(--color-text-brand)">
            매일의 업무가 나만의 성과로!
          </p>
          <p className="[font-size:var(--font-size-body-1)] font-medium leading-(--line-height-body) text-(--color-text-tertiary)">
            지금 바로 시작해 볼까요?
          </p>
        </div>

        {/* 버튼 */}
        <button
          type="button"
          onClick={onStart}
          className="flex h-15 w-80 items-center justify-center gap-2 rounded-lg bg-(--color-button-default) px-4 [font-size:var(--font-size-body-1)] font-medium leading-(--line-height-body) text-(--color-text-inverse) transition-opacity hover:opacity-90"
        >
          워디 시작하기
        </button>
      </div>
    </section>
  )
}
