import type { HTMLAttributes } from 'react'
import { SidebarNavItemText } from '../SidebarNavItemText/SidebarNavItemText'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'

export interface CareerDropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: string[]
  value?: string
  onChange?: (value: string) => void
}

export function CareerDropdown({
  options,
  value,
  onChange,
  className,
  ...rest
}: CareerDropdownProps) {
  return (
    <div
      className={[
        'bg-(--color-bg-default) rounded-(--scale-12) shadow-[0px_1px_15px_rgba(0,0,0,0.1)]',
        'flex flex-col p-3 w-full max-h-90 overflow-hidden',
        className,
      ].join(' ')}
      {...rest}
    >
      <Scrollbar>
        {options.map((option) => (
          <SidebarNavItemText
            key={option}
            label={option}
            selected={value === option}
            onClick={() => onChange?.(option)}
          />
        ))}
      </Scrollbar>
    </div>
  )
}
