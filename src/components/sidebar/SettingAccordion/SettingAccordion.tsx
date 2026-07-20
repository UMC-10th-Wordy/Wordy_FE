import type { ButtonHTMLAttributes, ReactNode } from 'react'
import DirectionBottomIcon from '@/assets/icons/Direction=bottom.svg?react'

export interface SettingAccordionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: ReactNode
}

export function SettingAccordion({ label, className, ...rest }: SettingAccordionProps) {
  return (
    <button
      type="button"
      className={[
        'flex w-full items-center justify-between bg-(--color-bg-default) border border-(--color-border-subtle)',
        'rounded-lg pl-5 pr-4 py-2.5 cursor-pointer',
        'transition-colors duration-100 ease-out',
        'hover:bg-(--color-bg-secondary)',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-brand)',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)">
        {label}
      </span>
      <DirectionBottomIcon
        width={24}
        height={24}
        className="shrink-0 text-(--color-icon-secondary)"
      />
    </button>
  )
}
