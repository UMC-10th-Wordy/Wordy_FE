import { cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

const sidebarWorkspace = cva([
  'flex items-center justify-between pl-5 pr-2 py-2 w-full',
  'transition-colors duration-100 ease-out cursor-pointer',
  'hover:bg-(--color-sidebar-neutral-hover)',
  'focus-visible:bg-(--color-sidebar-neutral-focused)',
])

export interface SidebarWorkspaceProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  workspaceName: string
  isOpen?: boolean
}

export function SidebarWorkspace({
  workspaceName,
  isOpen = false,
  className,
  ...rest
}: SidebarWorkspaceProps) {
  return (
    <button
      type="button"
      className={[
        sidebarWorkspace({ className }),
        isOpen ? 'bg-(--color-sidebar-neutral-focused)' : '',
      ].join(' ')}
      {...rest}
    >
      <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-secondary) whitespace-nowrap truncate">
        {workspaceName}
      </span>
      <span className="shrink-0 size-8 flex items-center justify-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={['transition-transform duration-100', isOpen ? 'rotate-180' : ''].join(' ')}
        >
          <path
            d="M8 12L16 20L24 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  )
}
