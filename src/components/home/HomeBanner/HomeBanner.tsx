import type { HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { TextButton } from '@/components/common/Button/TextButton'
import ArrowRightIcon from '@/assets/icons/Direction=right.svg?react'
import imgVectorLeftCorner from '@/assets/images/banner/vector_left_corner.svg'
import { EASE_SPRING } from './constants'
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

      {/* 좌측 하단 코너 — SVG xMaxYMax 정렬 밖에 있어 별도 배치, 색상 #349F8F */}
      <motion.img
        src={imgVectorLeftCorner}
        alt=""
        className="absolute left-0 bottom-0 pointer-events-none select-none"
        style={{ width: '9.9%', height: '20.35%' }}
        initial={{ x: 0 }}
        animate={{ x: [0, '-1.877%', '-1.877%'] }}
        transition={{ duration: 2, times: [0, 0.3959, 1], ease: [EASE_SPRING, 'linear'] as never }}
      />

      {/* 일러스트 */}
      <BannerIllustration className="absolute right-0 bottom-0 h-full pointer-events-none select-none" />
    </div>
  )
}
