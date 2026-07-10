import { cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const sidebarNavItem = cva(
  [
    'flex items-center gap-2 h-[52px] px-1 w-full',
    'transition-colors duration-100 ease-out cursor-pointer',
    '[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)',
    'hover:bg-(--color-sidebar-neutral-hover)',
  ],
  {
    variants: {
      selected: {
        true: 'bg-(--color-bg-brand-light)',
        false: 'bg-(--color-bg-default)',
      },
    },
    defaultVariants: { selected: false },
  },
)

export interface SidebarNavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  selected?: boolean
}

export function SidebarNavItem({
  icon,
  label,
  selected = false,
  className,
  ...rest
}: SidebarNavItemProps) {
  return (
    <button type="button" className={sidebarNavItem({ selected, className })} {...rest}>
      <span className="shrink-0 size-7">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}
