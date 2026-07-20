import { motion, useReducedMotion } from 'framer-motion'

import wordyProfileImage from '@/assets/icons/wordy-profile.svg'

interface PerformanceTypingIndicatorProps {
  showProfile?: boolean
}

const ACTIVE_DOT_COLOR = 'var(--color-icon-default)'
const INACTIVE_DOT_COLOR = 'var(--color-icon-tertiary)'

const dotAnimations = [
  {
    backgroundColor: [
      ACTIVE_DOT_COLOR,
      ACTIVE_DOT_COLOR,
      INACTIVE_DOT_COLOR,
      INACTIVE_DOT_COLOR,
      ACTIVE_DOT_COLOR,
    ],
    times: [0, 0.125, 0.25, 0.625, 0.75],
  },
  {
    backgroundColor: [
      INACTIVE_DOT_COLOR,
      INACTIVE_DOT_COLOR,
      ACTIVE_DOT_COLOR,
      ACTIVE_DOT_COLOR,
      INACTIVE_DOT_COLOR,
    ],
    times: [0, 0.125, 0.25, 0.375, 0.5],
  },
  {
    backgroundColor: [
      INACTIVE_DOT_COLOR,
      INACTIVE_DOT_COLOR,
      ACTIVE_DOT_COLOR,
      ACTIVE_DOT_COLOR,
      INACTIVE_DOT_COLOR,
    ],
    times: [0, 0.375, 0.5, 0.625, 0.75],
  },
]

export const PerformanceTypingIndicator = ({
  showProfile = true,
}: PerformanceTypingIndicatorProps) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      className="flex w-full justify-start gap-(--scale-8)"
      role="status"
      aria-label="워디가 답변을 작성하고 있어요"
    >
      {showProfile ? (
        <img
          src={wordyProfileImage}
          alt="Wordy 프로필"
          className="size-(--scale-48) shrink-0 rounded-full"
        />
      ) : (
        <div className="size-(--scale-48) shrink-0" aria-hidden />
      )}

      <div
        className="flex h-[61px] min-w-[82px] items-center justify-center rounded-tl-(--scale-4) rounded-tr-(--scale-16) rounded-br-(--scale-16) rounded-bl-(--scale-16) bg-(--color-bg-brand-light) px-(--scale-16)"
        aria-hidden
      >
        <div className="flex items-center gap-(--scale-8) px-(--scale-8)">
          {dotAnimations.map((animation, index) => (
            <motion.span
              key={index}
              className="size-[6px] shrink-0 rounded-full"
              initial={{
                backgroundColor: index === 0 ? ACTIVE_DOT_COLOR : INACTIVE_DOT_COLOR,
              }}
              animate={
                shouldReduceMotion
                  ? {
                      backgroundColor: index === 0 ? ACTIVE_DOT_COLOR : INACTIVE_DOT_COLOR,
                    }
                  : {
                      backgroundColor: animation.backgroundColor,
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 2,
                      times: animation.times,
                      ease: [0.42, 0, 1, 1],
                      repeat: Infinity,
                      repeatType: 'loop',
                    }
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
