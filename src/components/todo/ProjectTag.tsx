import type { ReactNode } from 'react'

export type ProjectTagColor =
  'black' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'navy' | 'pink' | 'brown'

interface ProjectTagProps {
  label: string
  color: ProjectTagColor
  trailingIcon?: ReactNode
}

const COLOR_CLASS_MAP: Record<ProjectTagColor, string> = {
  black: 'bg-(--color-tag-black-bg) text-(--color-tag-black-text)',
  red: 'bg-(--color-tag-red-bg) text-(--color-tag-red-text)',
  orange: 'bg-(--color-tag-orange-bg) text-(--color-tag-orange-text)',
  yellow: 'bg-(--color-tag-yellow-bg) text-(--color-tag-yellow-text)',
  green: 'bg-(--color-tag-green-bg) text-(--color-tag-green-text)',
  blue: 'bg-(--color-tag-blue-bg) text-(--color-tag-blue-text)',
  navy: 'bg-(--color-bg-brand-light) text-(--color-text-brand)',
  pink: 'bg-(--color-tag-pink-bg) text-(--color-tag-pink-text)',
  brown: 'bg-(--color-tag-brown-bg) text-(--color-tag-brown-text)',
}

export default function ProjectTag({ label, color, trailingIcon }: ProjectTagProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center gap-1 rounded-lg px-2 py-1 ${COLOR_CLASS_MAP[color]}`}
    >
      <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-semibold whitespace-nowrap">
        {label}
      </span>
      {trailingIcon}
    </div>
  )
}
