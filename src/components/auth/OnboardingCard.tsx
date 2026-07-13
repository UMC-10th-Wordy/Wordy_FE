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
          <LogoIcon className="mb-3 h-6 w-auto self-start" />
          <h1 className="text-[32px] font-bold text-(--color-text-default)">{title}</h1>
          <p className="text-[15px] leading-relaxed text-(--color-text-tertiary)">{description}</p>
        </div>

        <div className="mx-auto mt-12 w-full max-w-[600px] flex-1">{children}</div>

        <div className="mx-auto flex w-full max-w-[600px] items-center justify-between">
          <div className="w-[120px]">
            {onPrev && (
              <TextButton
                variant="text_only"
                size="small"
                iconLeft={<ArrowLeftIcon width={16} height={16} />}
                onClick={onPrev}
              >
                이전 단계
              </TextButton>
            )}
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={[
                  'size-2 rounded-full',
                  i === step ? 'bg-(--color-button-default)' : 'bg-(--color-border-subtle)',
                ].join(' ')}
              />
            ))}
          </div>

          <div className="flex w-[120px] justify-end">
            <TextButton
              variant="text_only"
              size="small"
              iconRight={<ArrowRightIcon width={16} height={16} />}
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
