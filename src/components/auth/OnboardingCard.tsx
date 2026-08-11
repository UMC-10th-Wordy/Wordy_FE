import type { ReactNode } from 'react'
import LogoIcon from '@/assets/icons/logo.svg?react'
import ArrowLeftIcon from '@/assets/icons/Direction=left.svg?react'
import ArrowRightIcon from '@/assets/icons/Direction=right.svg?react'
import { TextButton } from '@/components/common/Button/TextButton'

interface OnboardingCardProps {
  title: string
  description: ReactNode
  children: ReactNode
  step: number // 0부터 시작
  totalSteps: number
  nextLabel?: string
  nextDisabled?: boolean
  onPrev?: () => void
  onNext: () => void
}

export const OnboardingCard = ({
  title,
  description,
  children,
  step,
  totalSteps,
  nextLabel = '다음 단계',
  nextDisabled = false,
  onPrev,
  onNext,
}: OnboardingCardProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(287.56deg,#D9F8FF_0%,#D9E4FF_61.06%,#EDE4FF_100%)] px-6 py-16">
      <div className="flex min-h-[880px] w-full max-w-[800px] flex-col rounded-[32px] bg-(--color-bg-default) px-[100px] py-[80px] shadow-xl shadow-black/5">
        <div className="mx-auto flex w-full max-w-[600px] flex-col gap-3">
          <LogoIcon className="h-7 w-auto self-start" />
          <div className="flex flex-col">
            <h1 className="[font-size:var(--font-size-heading-1)] font-semibold leading-(--line-height-heading) text-(--color-text-default)">
              {title}
            </h1>
            <p className="[font-size:var(--font-size-body-1)] font-normal leading-(--line-height-body) text-(--color-text-tertiary)">
              {description}
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[600px] flex-1 items-center pb-16 pt-6">
          <div className="w-full">{children}</div>
        </div>

        <div className="mx-auto flex w-full max-w-[600px] items-center">
          <div className="flex flex-1">
            {onPrev && (
              <TextButton
                variant="text_only"
                size="large"
                iconLeft={<ArrowLeftIcon width={32} height={32} />}
                onClick={onPrev}
              >
                이전 단계
              </TextButton>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={[
                  'h-2 rounded-full transition-all duration-100 ease-out',
                  i === step ? 'w-4 bg-(--color-icon-secondary)' : 'w-2 bg-(--color-border-subtle)',
                ].join(' ')}
              />
            ))}
          </div>

          <div className="flex flex-1 justify-end">
            <TextButton
              variant="text_only"
              size="large"
              iconRight={<ArrowRightIcon width={32} height={32} />}
              disabled={nextDisabled}
              onClick={onNext}
            >
              {nextLabel}
            </TextButton>
          </div>
        </div>
      </div>
    </div>
  )
}
