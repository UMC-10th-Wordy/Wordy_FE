import CheckIcon from '@/assets/icons/check.svg?react'

const FREE_FEATURES = [
  { text: 'AI 기반 성과 변환 기능 ', sub: '(일일 사용 횟수 제한)' },
  { text: '주간 성과 대시보드 생성' },
  { text: '프로젝트 및 업무 기록 기능' },
  { text: '제한된 워크 스페이스 갯수' },
]

const PRO_FEATURES: { text: string; medium?: boolean }[] = [
  { text: 'Free 플랜의 모든 기능', medium: true },
  { text: '무제한 AI 기반 성과 변환 기능' },
  { text: '무제한 워크 스페이스 관리' },
  { text: '고도화된 주간·월간 성과 대시보드 생성' },
  { text: '업무 내용 기반 포트폴리오 자동 생성' },
  { text: 'PDF로 데이터 내보내기' },
]

export function LandingPricingSection({ onStart }: { onStart?: () => void }) {
  return (
    <section className="flex w-full flex-col items-center bg-(--color-bg-default) px-10 py-15">
      <div className="flex w-full max-w-330 flex-col gap-12">
        {/* 타이틀 */}
        <div className="flex w-full flex-col items-center gap-1 whitespace-nowrap">
          <p className="[font-size:var(--font-size-heading-2)] font-semibold leading-(--line-height-body) text-(--color-text-default)">
            요금제를 선택해 볼까요?
          </p>
          <p className="[font-size:var(--font-size-body-1)] font-medium leading-(--line-height-body) text-(--color-text-tertiary)">
            기본 업무 일지 관리부터 성과 도출까지, 필요에 맞는 플랜을 선택하세요!
          </p>
        </div>

        {/* 카드 컨테이너 — Figma: gap-[32px], h-[580px], items-start */}
        <div className="flex h-145 w-full items-start gap-8">
          {/* ── Free 플랜 ── */}
          <div className="isolate flex h-full flex-1 min-w-px flex-col items-start justify-between overflow-hidden rounded-(--scale-16) border border-(--color-border-brand-subtle) bg-(--color-bg-default) p-8 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
            {/* 상단 콘텐츠 z-2 */}
            <div className="relative z-2 flex w-full shrink-0 flex-col items-start gap-4">
              <div className="flex w-full shrink-0 flex-col items-start gap-8">
                {/* 플랜명 + 설명 */}
                <div className="flex shrink-0 flex-col items-start">
                  <p className="[font-size:var(--font-size-heading-3)] font-semibold leading-(--line-height-body) text-(--color-text-brand) whitespace-nowrap">
                    Free
                  </p>
                  <p className="[font-size:var(--font-size-body-2)] font-medium leading-(--line-height-body) text-(--color-text-tertiary) whitespace-nowrap">
                    누구나 부담없이 시작해요!
                  </p>
                </div>
                {/* 가격 */}
                <p className="[font-size:var(--font-size-heading-2)] font-semibold leading-(--line-height-body) text-(--color-text-default) whitespace-nowrap">
                  0원
                </p>
              </div>
              {/* 기능 목록 */}
              <div className="flex shrink-0 flex-col items-start gap-3">
                {FREE_FEATURES.map((f) => (
                  <div key={f.text} className="flex shrink-0 items-center gap-1">
                    <CheckIcon className="size-8 shrink-0" />
                    <p className="[font-size:var(--font-size-body-2)] font-normal leading-(--line-height-body) text-(--color-text-default) whitespace-nowrap">
                      {f.text}
                      {f.sub && <span className="text-(--color-text-tertiary)">{f.sub}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* 버튼 z-1 */}
            <button
              type="button"
              onClick={onStart}
              className="relative z-1 flex h-15 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-(--color-button-default) bg-(--color-bg-default) px-4 [font-size:var(--font-size-body-1)] font-medium leading-(--line-height-body) text-(--color-button-default) transition-colors hover:bg-(--color-bg-tertiary)"
            >
              무료로 사용하기
            </button>
          </div>

          {/* ── Pro 플랜 ── */}
          <div
            className="relative isolate flex h-full flex-1 min-w-px flex-col items-start justify-between overflow-hidden rounded-(--scale-16) border-[1.5px] border-(--color-border-brand) p-8 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]"
            style={{
              backgroundImage:
                'linear-gradient(137.46deg, rgba(221,221,255,0.3) 0%, rgba(250,250,252,0.3) 100%)',
            }}
          >
            {/* COMING SOON 배너 — 우측 상단 코너 고정 */}
            <div className="pointer-events-none absolute right-0 top-0 z-5 flex size-[319.612px] translate-x-20 -translate-y-20 items-center justify-center">
              <div className="flex-none rotate-45">
                <div className="flex w-101.75 items-center justify-center bg-(--color-icon-brand) px-3 py-2">
                  <span className="[font-size:var(--font-size-body-2)] font-semibold leading-(--line-height-body) text-(--color-text-inverse) whitespace-nowrap">
                    COMING SOON
                  </span>
                </div>
              </div>
            </div>

            {/* 상단 콘텐츠 z-2 */}
            <div className="relative z-2 flex w-full shrink-0 flex-col items-start gap-4">
              <div className="flex w-full shrink-0 flex-col items-start gap-8">
                {/* 플랜명 + 설명 */}
                <div className="flex w-full shrink-0 items-start">
                  <div className="relative flex min-w-px flex-1 items-start">
                    <div className="flex shrink-0 flex-col items-start">
                      <p className="[font-size:var(--font-size-heading-3)] font-semibold leading-(--line-height-body) text-(--color-text-brand) whitespace-nowrap">
                        Pro
                      </p>
                      <p className="[font-size:var(--font-size-body-2)] font-medium leading-(--line-height-body) text-(--color-text-tertiary) whitespace-nowrap">
                        압도적인 생산성 향상을 경험해 보세요
                      </p>
                    </div>
                  </div>
                </div>
                {/* 가격 */}
                <div className="flex shrink-0 items-end">
                  <p className="[font-size:var(--font-size-heading-2)] font-semibold leading-(--line-height-body) text-(--color-text-default) whitespace-nowrap">
                    오픈 예정이에요
                  </p>
                </div>
              </div>
              {/* 기능 목록 */}
              <div className="flex shrink-0 flex-col items-start gap-3">
                {PRO_FEATURES.map((f) => (
                  <div key={f.text} className="flex shrink-0 items-center gap-1">
                    <CheckIcon className="size-8 shrink-0" />
                    <p
                      className={`[font-size:var(--font-size-body-2)] leading-(--line-height-body) text-(--color-text-default) whitespace-nowrap ${f.medium ? 'font-medium' : 'font-normal'}`}
                    >
                      {f.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 버튼 z-1 */}
            <div className="relative z-1 flex h-15 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-(--color-button-disabled) px-4 [font-size:var(--font-size-body-1)] font-medium leading-(--line-height-body) text-(--color-text-disabled)">
              아직 사용할 수 없어요
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
