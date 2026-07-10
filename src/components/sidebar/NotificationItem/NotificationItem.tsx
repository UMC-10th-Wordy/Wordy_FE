import { cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

const notificationItem = cva([
  'flex flex-col items-start p-2 w-full',
  'transition-colors duration-100 ease-out cursor-pointer',
  'bg-(--color-bg-default)',
  'hover:bg-(--color-bg-secondary)',
])

export interface NotificationItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  body: string
}

export function NotificationItem({ title, body, className, ...rest }: NotificationItemProps) {
  return (
    <button type="button" className={notificationItem({ className })} {...rest}>
      <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default) text-left w-full">
        {title}
      </span>
      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary) text-left w-full whitespace-pre-line">
        {body}
      </span>
    </button>
  )
}
