import { AnimatePresence, motion } from 'framer-motion'

import { Toast } from '@/components/common/Toast/Toast'

import type { PerformanceToast } from '@/types/performancePreviewResult'

interface PerformanceToastViewportProps {
  toasts: PerformanceToast[]
}

export const PerformanceToastViewport = ({ toasts }: PerformanceToastViewportProps) => {
  return (
    <div className="pointer-events-none fixed right-(--scale-24) bottom-(--scale-32) z-50 flex flex-col items-end gap-(--scale-12)">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 0, opacity: 0 }}
            transition={{
              y: {
                duration: 0.3,
                ease: 'easeOut',
              },
              opacity: {
                duration: 0.3,
                ease: 'easeOut',
              },
              layout: {
                duration: 0.3,
                ease: 'easeOut',
              },
            }}
          >
            <Toast message={toast.message} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
