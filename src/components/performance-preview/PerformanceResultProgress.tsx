import { motion } from 'framer-motion'

interface PerformanceResultProgressProps {
  totalTaskCount: number
  completedTaskCount: number
  shouldAnimate?: boolean
}

export const PerformanceResultProgress = ({
  totalTaskCount,
  completedTaskCount,
  shouldAnimate = false,
}: PerformanceResultProgressProps) => {
  const progressRate =
    totalTaskCount === 0 ? 0 : Math.round((completedTaskCount / totalTaskCount) * 100)

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center gap-(--scale-8)">
        <h3 className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
          오늘의 업무 달성률
        </h3>

        <p className="[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-tertiary)">
          전체 {totalTaskCount} · 완료 {completedTaskCount}
        </p>
      </div>

      <div className="relative h-[85px]">
        <div className="flex h-[77px] items-center">
          <strong className="[font-size:var(--font-size-heading-1)] leading-none font-[var(--font-weight-semibold)] text-(--color-text-brand)">
            {progressRate}
            <span className="[font-size:var(--font-size-body-1)] font-[var(--font-weight-semibold)] text-(--color-text-brand)">
              %
            </span>
          </strong>
        </div>

        <div className="absolute bottom-0 left-0 h-[12px] w-full overflow-hidden rounded-(--scale-1000) bg-(--color-bg-tertiary)">
          <motion.div
            className="h-full rounded-(--scale-1000) bg-[linear-gradient(90deg,var(--primitive-primary-700)_0%,var(--primitive-primary-500)_100%)]"
            initial={{
              width: shouldAnimate ? '0%' : `${progressRate}%`,
            }}
            animate={{
              width: `${progressRate}%`,
            }}
            transition={{
              duration: shouldAnimate ? 0.6 : 0,
              ease: [0, 0, 0.2, 1],
            }}
          />
        </div>
      </div>
    </section>
  )
}
