import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const iconButton = cva(
  [
    'inline-flex items-center justify-center',
    'transition-colors duration-100 ease-out',
    'cursor-pointer',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        fill: [
          'bg-(--color-button-default) text-(--color-text-inverse)',
          'hover:bg-(--color-button-hover)',
          'focus-visible:bg-(--color-button-focused)',
          'active:bg-(--color-button-pressed)',
          'disabled:bg-(--color-button-disabled) disabled:text-(--color-text-disabled)',
        ],
        stroke: [
          'bg-(--color-bg-default) border border-(--color-button-default) text-(--color-button-default)',
          'hover:bg-(--color-bg-brand-subtle) hover:border-(--color-button-hover) hover:text-(--color-button-hover)',
          'focus-visible:bg-(--color-bg-brand-light) focus-visible:border-(--color-button-focused) focus-visible:text-(--color-button-focused)',
          'active:bg-(--color-bg-brand-light) active:border-(--color-button-pressed) active:text-(--color-button-pressed)',
          'disabled:bg-(--color-bg-default) disabled:border-(--color-border-disabled) disabled:text-(--color-text-disabled)',
        ],
        stroke_neutral: [
          'bg-(--color-bg-default) border border-(--color-border-subtle) text-(--color-text-secondary)',
          'hover:bg-(--color-bg-secondary) hover:border-(--color-border-subtle)',
          'focus-visible:bg-(--color-bg-tertiary) focus-visible:border-(--color-border-subtle)',
          'active:bg-(--color-bg-tertiary) active:border-(--color-border-light)',
          'disabled:bg-(--color-bg-default) disabled:border-(--color-border-disabled) disabled:text-(--color-text-disabled)',
        ],
        icon_only: [
          'text-(--color-button-default)',
          'hover:bg-(--color-bg-brand-light) hover:text-(--color-button-hover)',
          'focus-visible:bg-(--color-bg-brand-light) focus-visible:text-(--color-button-focused)',
          'active:bg-(--color-bg-brand-light) active:text-(--color-button-pressed)',
          'disabled:text-(--color-text-disabled)',
        ],
        text_neutral: [
          'text-(--color-text-secondary)',
          'hover:bg-(--color-bg-tertiary)',
          'focus-visible:bg-(--color-bg-tertiary)',
          'active:bg-(--color-bg-tertiary)',
          'disabled:text-(--color-text-disabled)',
        ],
      },
      size: {
        small: 'size-8 rounded-md',
        medium: 'size-11 rounded-lg',
        large: 'size-[60px] rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'fill',
      size: 'medium',
    },
  },
)

export type IconButtonVariant = NonNullable<VariantProps<typeof iconButton>['variant']>
export type IconButtonSize = NonNullable<VariantProps<typeof iconButton>['size']>

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  icon: ReactNode
}

export function IconButton({ variant, size, icon, className, ...rest }: IconButtonProps) {
  return (
    <button type="button" className={iconButton({ variant, size, className })} {...rest}>
      {icon}
    </button>
  )
}
