import type { ReactNode } from 'react'

export type ButtonIconSize = 'small' | 'medium' | 'large'

const iconSizeClass: Record<ButtonIconSize, string> = {
  small: 'size-5',
  medium: 'size-7',
  large: 'size-8',
}

interface ButtonIconProps {
  icon: ReactNode
  size: ButtonIconSize
}

export function ButtonIcon({ icon, size }: ButtonIconProps) {
  return (
    <span
      className={[
        'inline-flex shrink-0 items-center justify-center',
        '[&>*]:size-full [&_img]:size-full [&_svg]:size-full',
        iconSizeClass[size],
      ].join(' ')}
    >
      {icon}
    </span>
  )
}
