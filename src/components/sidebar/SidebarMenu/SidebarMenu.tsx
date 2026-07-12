import type { HTMLAttributes, ReactNode } from 'react'
import { SidebarNavItem } from '../SidebarNavItem/SidebarNavItem'

export interface SidebarMenuItem {
  icon?: ReactNode
  label: string
  onClick?: () => void
}

export interface SidebarMenuProps extends HTMLAttributes<HTMLDivElement> {
  email: string
  items: SidebarMenuItem[]
}

export function SidebarMenu({ email, items, className, ...rest }: SidebarMenuProps) {
  return (
    <div
      className={[
        'bg-(--color-bg-default) rounded-(--scale-12) shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)]',
        'flex flex-col gap-2.5 items-start justify-center px-4 py-5 w-70',
        className,
      ].join(' ')}
      {...rest}
    >
      <span className="flex items-center justify-center pl-1 shrink-0 w-full">
        <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-semibold text-(--color-text-tertiary) whitespace-nowrap">
          {email}
        </span>
      </span>
      <div className="flex flex-col items-start shrink-0 w-full">
        {items.map((item, index) => (
          <SidebarNavItem key={index} icon={item.icon} label={item.label} onClick={item.onClick} />
        ))}
      </div>
    </div>
  )
}
