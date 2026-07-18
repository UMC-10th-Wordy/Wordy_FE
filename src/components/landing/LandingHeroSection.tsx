export function LandingHeroSection({ onStart }: { onStart?: () => void }) {
  return (
    <section
      className="flex w-full flex-col items-center justify-center gap-15 py-15"
      style={{ minHeight: '820px' }}
    >
      <div className="flex flex-col items-center gap-5 whitespace-nowrap">
        <p className="[font-size:var(--font-size-body-1)] font-medium leading-(--line-height-body) text-(--color-text-tertiary)">
          나만의 업무 성과 관리 도우미, Wordy
        </p>
        <div className="flex flex-col items-center">
          <p className="[font-size:var(--font-size-heading-1)] font-semibold leading-(--line-height-body) text-(--color-text-default)">
            일상의 업무를 나만의 성과로
          </p>
          <p className="[font-size:var(--font-size-heading-4)] font-medium leading-(--line-height-body) text-(--color-text-tertiary)">
            워디와 함께 오늘의 업무를 기록하고 성과를 만들어 보세요!
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="flex h-15 w-80 items-center justify-center rounded-lg bg-(--color-button-default) [font-size:var(--font-size-body-1)] font-medium leading-(--line-height-body) text-(--color-text-inverse) transition-opacity hover:opacity-90"
      >
        무료로 시작하기
      </button>
    </section>
  )
}
