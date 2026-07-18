import type { ProjectTagColor } from '@/components/todo/ProjectTag'

interface SearchResultProjectTagProps {
  label: string
  color: ProjectTagColor
}

const COLOR_CLASS_MAP: Record<ProjectTagColor, string> = {
  black: 'bg-(--color-tag-black-bg) text-(--color-tag-black-text)',
  red: 'bg-(--color-tag-red-bg) text-(--color-tag-red-text)',
  orange: 'bg-(--color-tag-orange-bg) text-(--color-tag-orange-text)',
  yellow: 'bg-(--color-tag-yellow-bg) text-(--color-tag-yellow-text)',
  green: 'bg-(--color-tag-green-bg) text-(--color-tag-green-text)',
  blue: 'bg-(--color-tag-blue-bg) text-(--color-tag-blue-text)',
  navy: 'bg-(--color-tag-navy-bg) text-(--color-tag-navy-text)',
  pink: 'bg-(--color-tag-pink-bg) text-(--color-tag-pink-text)',
  brown: 'bg-(--color-tag-brown-bg) text-(--color-tag-brown-text)',
}

export const SearchResultProjectTag = ({ label, color }: SearchResultProjectTagProps) => {
  return (
    <div
      className={[
        'flex shrink-0 items-center justify-center rounded-(--scale-8) px-(--scale-12) py-(--scale-4)',
        COLOR_CLASS_MAP[color],
      ].join(' ')}
    >
      <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-[var(--font-weight-semibold)] whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}
