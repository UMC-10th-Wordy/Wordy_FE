import { PerformanceConvertingMotion } from './PerformanceConvertingMotion'
import { PerformanceLoadingDots } from './PerformanceLoadingDots'

export const PerformanceConvertingNotice = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="워디가 성과를 변환하고 있습니다. 잠시만 기다려 주세요."
      className="flex flex-col items-center justify-center pb-[22px]"
    >
      <PerformanceConvertingMotion />

      <div
        aria-hidden
        className="mt-(--scale-16) text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-medium)] text-(--color-text-secondary)"
      >
        <p>워디가 열심히 변환하고 있어요</p>

        <p className="flex justify-center">
          <span className="inline-flex">
            <span>잠시만 기다려 주세요</span>
            <PerformanceLoadingDots />
          </span>
        </p>
      </div>
    </div>
  )
}
