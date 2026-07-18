import { useEffect, useState } from 'react'

const DOTS = ['.', '..', '...'] as const

export const PerformanceLoadingDots = () => {
  const [dotIndex, setDotIndex] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setDotIndex((previousIndex) => (previousIndex + 1) % DOTS.length)
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <span aria-hidden className="relative inline-block text-left">
      <span className="invisible">...</span>

      <span className="absolute inset-0">{DOTS[dotIndex]}</span>
    </span>
  )
}
