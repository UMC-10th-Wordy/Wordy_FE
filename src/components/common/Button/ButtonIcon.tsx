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
  /** 지정 시 size 프리셋 대신 이 크기로 아이콘을 렌더링해요 (예: 'size-10') */
  className?: string
}

export function ButtonIcon({ icon, size, className }: ButtonIconProps) {
  return (
    <span
      className={[
        'inline-flex shrink-0 items-center justify-center',
        '[&>*]:size-full [&_img]:size-full [&_svg]:size-full',
        className ?? iconSizeClass[size],
      ].join(' ')}
    >
      {icon}
    </span>
  )
}
