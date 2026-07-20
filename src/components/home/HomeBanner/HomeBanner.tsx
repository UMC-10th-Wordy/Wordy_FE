import type { HTMLAttributes } from 'react'
import { TextButton } from '@/components/common/Button/TextButton'
import ArrowRightIcon from '@/assets/icons/Direction=right.svg?react'
import { BannerIllustration } from './BannerIllustration'

export interface HomeBannerProps extends HTMLAttributes<HTMLDivElement> {
  onNavigate?: () => void
}

export function HomeBanner({ onNavigate, className, ...rest }: HomeBannerProps) {
  return (
    <div
      className={[
        'relative flex flex-col p-16 rounded-(--scale-20) overflow-hidden',
        'border-[0.5px] border-(--color-border-brand-subtle)',
        'shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]',
        'bg-(--color-bg-brand-subtle)',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {/* 텍스트 + 버튼 */}
      <div className="flex flex-col gap-12 items-start relative z-10 shrink-0">
        <div className="flex flex-col items-start">
          <span className="[font-size:var(--font-size-heading-2)] leading-(--line-height-heading) font-semibold text-(--color-text-default)">
            오늘은 어떤 업무를 할까요?
          </span>
          <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
            오늘의 업무를 기록하고 성과를 쌓아보세요!
          </span>
        </div>
        <TextButton
          variant="fill"
          size="large"
          iconRight={<ArrowRightIcon className="size-8" />}
          onClick={onNavigate}
        >
          오늘의 업무 기록하기
        </TextButton>
      </div>

      {/* 일러스트 — 고정 크기, 우측 하단 앵커, 넘치면 카드에서 잘림 */}
      <BannerIllustration className="absolute right-0 bottom-0 pointer-events-none select-none" />
    </div>
  )
}
