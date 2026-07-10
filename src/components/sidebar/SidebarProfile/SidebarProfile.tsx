import { cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

const sidebarProfile = cva([
  'flex items-center gap-[13px] px-5 py-3 w-full',
  'transition-colors duration-100 ease-out cursor-pointer',
  'hover:bg-(--color-sidebar-neutral-hover)',
  'focus-visible:bg-(--color-sidebar-neutral-focused)',
])

export interface SidebarProfileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  avatarSrc?: string
  name: string
  plan: string
}

export function SidebarProfile({ avatarSrc, name, plan, className, ...rest }: SidebarProfileProps) {
  return (
    <button type="button" className={sidebarProfile({ className })} {...rest}>
      <span className="relative shrink-0 size-12 rounded-(--scale-1000) border border-(--color-border-opacity) overflow-hidden">
        {avatarSrc ? (
          <img src={avatarSrc} alt={name} className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center bg-(--color-bg-secondary) [font-size:var(--font-size-body-3)] font-semibold text-(--color-text-secondary)">
            {name.charAt(0)}
          </span>
        )}
      </span>
      <span className="flex flex-col items-start leading-(--line-height-body) shrink-0">
        <span className="[font-size:var(--font-size-body-3)] font-semibold text-(--color-text-default) w-full">
          {name}
        </span>
        <span className="[font-size:var(--font-size-body-4)] font-normal text-(--color-text-tertiary) w-full">
          {plan}
        </span>
      </span>
    </button>
  )
}
