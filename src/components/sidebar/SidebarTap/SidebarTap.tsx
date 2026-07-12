import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const sidebarTap = cva(
  [
    'flex items-center gap-2 h-12 pl-4 pr-2 py-2 w-full',
    'transition-colors duration-100 ease-out cursor-pointer',
    'hover:bg-(--color-sidebar-primary-hover)',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-brand)',
  ],
  {
    variants: {
      state: {
        default: '',
        focused: [
          'bg-(--color-sidebar-primary-focused)',
          'border-r-2 border-(--color-border-brand)',
        ],
      },
    },
    defaultVariants: { state: 'default' },
  },
)

export type SidebarTapState = NonNullable<VariantProps<typeof sidebarTap>['state']>

export interface SidebarTapProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  label: string
  badge?: number
  state?: SidebarTapState
}

export function SidebarTap({
  icon,
  label,
  badge,
  state = 'default',
  className,
  ...rest
}: SidebarTapProps) {
  return (
    <button type="button" className={sidebarTap({ state, className })} {...rest}>
      <span className="flex flex-1 items-center gap-2 min-w-0">
        {icon && <span className="shrink-0 size-6 text-(--color-icon-secondary)">{icon}</span>}
        <span
          className={[
            '[font-size:var(--font-size-body-2)] leading-(--line-height-body) truncate',
            'text-(--color-text-default)',
            state === 'focused' ? 'font-semibold' : 'font-normal',
          ].join(' ')}
        >
          {label}
        </span>
      </span>
      {badge != null && badge > 0 && (
        <span className="flex flex-col items-start pr-2 shrink-0">
          <span className="flex items-center justify-center px-2 py-0.5 rounded-(--scale-1000) bg-(--color-icon-brand) w-full">
            <span className="[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-semibold text-(--color-text-inverse) text-center whitespace-nowrap">
              {badge >= 99 ? '99+' : badge}
            </span>
          </span>
        </span>
      )}
    </button>
  )
}
