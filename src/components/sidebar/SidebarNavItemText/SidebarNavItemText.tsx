import { cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

const sidebarNavItemText = cva(
  [
    'flex items-center h-[52px] px-2 py-1 w-full',
    'transition-colors duration-100 ease-out cursor-pointer',
    '[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)',
    'bg-(--color-bg-default)',
    'hover:bg-(--color-sidebar-neutral-hover)',
  ],
  {
    variants: {
      selected: {
        true: 'bg-(--color-sidebar-neutral-focused)',
        false: '',
      },
    },
    defaultVariants: { selected: false },
  },
)

export interface SidebarNavItemTextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  selected?: boolean
}

export function SidebarNavItemText({
  label,
  selected = false,
  className,
  ...rest
}: SidebarNavItemTextProps) {
  return (
    <button type="button" className={sidebarNavItemText({ selected, className })} {...rest}>
      <span className="whitespace-nowrap truncate">{label}</span>
    </button>
  )
}
