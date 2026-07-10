import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const sidebarIcon = cva(
  [
    'group relative flex h-12 w-18 items-center justify-center transition-colors duration-100 ease-out cursor-pointer',
  ],
  {
    variants: {
      state: {
        default: '',
        focused: 'bg-(--color-sidebar-primary-focused) border-r-2 border-(--color-border-brand)',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

export type SidebarIconState = NonNullable<VariantProps<typeof sidebarIcon>['state']>

export interface SidebarIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  tooltip: string
  state?: SidebarIconState
}

export function SidebarIcon({
  icon,
  tooltip,
  state = 'default',
  className,
  ...rest
}: SidebarIconProps) {
  return (
    <button type="button" className={sidebarIcon({ state, className })} {...rest}>
      <span className="shrink-0 size-6">{icon}</span>
      <span className="absolute left-full ml-1 hidden group-hover:flex items-center gap-0 z-10">
        {/* 말풍선 꼬리 */}
        <span className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[7px] border-r-(--color-bg-dark)" />
        <span className="bg-(--color-bg-dark) text-(--color-text-inverse) [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium px-2.5 py-1 rounded-lg whitespace-nowrap">
          {tooltip}
        </span>
      </span>
    </button>
  )
}
