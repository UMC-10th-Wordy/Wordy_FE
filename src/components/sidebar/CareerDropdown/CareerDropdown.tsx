import type { HTMLAttributes } from 'react'
import { SidebarNavItemText } from '../SidebarNavItemText/SidebarNavItemText'

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
        'bg-(--color-bg-default) rounded-[var(--scale-12)] shadow-[0px_1px_15px_rgba(0,0,0,0.1)]',
        'flex items-start p-3 w-[432px] overflow-y-auto',
        className,
      ].join(' ')}
      {...rest}
    >
      <div className="flex flex-col items-start flex-1 min-w-0">
        {options.map((option) => (
          <SidebarNavItemText
            key={option}
            label={option}
            selected={value === option}
            onClick={() => onChange?.(option)}
          />
        ))}
      </div>
    </div>
  )
}
