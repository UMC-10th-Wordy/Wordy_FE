import type { HTMLAttributes } from 'react'
import { SidebarNavItemText } from '../SidebarNavItemText/SidebarNavItemText'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'

export interface OptionDropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: string[]
  value?: string
  onChange?: (value: string) => void
  /** true: 높이 고정(h-90) + 인라인 스크롤바 / false(기본): 콘텐츠에 맞춰 줄어드는(max-h-90) 오버레이 스크롤바 */
  fixedHeight?: boolean
}

export function OptionDropdown({
  options,
  value,
  onChange,
  className,
  fixedHeight = false,
  ...rest
}: OptionDropdownProps) {
  return (
    <div
      className={[
        'bg-(--color-bg-default) rounded-(--scale-12) shadow-[0px_1px_15px_rgba(0,0,0,0.1)]',
        'flex flex-col p-3 w-full overflow-hidden',
        fixedHeight ? 'h-90' : 'max-h-90',
        className,
      ].join(' ')}
      {...rest}
    >
      <Scrollbar {...(fixedHeight ? { inline: true, scrollbarClassName: 'pl-2' } : {})}>
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
