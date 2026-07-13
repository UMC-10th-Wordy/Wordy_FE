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
          'bg-[var(--color-button-default)] text-[var(--color-text-inverse)]',
          'hover:bg-[var(--color-button-hover)]',
          'focus-visible:bg-[var(--color-button-focused)]',
          'active:bg-[var(--color-button-pressed)]',
          'disabled:bg-[var(--color-button-disabled)] disabled:text-[var(--color-text-disabled)]',
        ],
        stroke: [
          'bg-[var(--color-bg-default)] border border-[var(--color-button-default)] text-[var(--color-button-default)]',
          'hover:bg-[var(--color-bg-brand-subtle)] hover:border-[var(--color-button-hover)] hover:text-[var(--color-button-hover)]',
          'focus-visible:bg-[var(--color-bg-brand-light)] focus-visible:border-[var(--color-button-focused)] focus-visible:text-[var(--color-button-focused)]',
          'active:bg-[var(--color-bg-brand-light)] active:border-[var(--color-button-pressed)] active:text-[var(--color-button-pressed)]',
          'disabled:bg-[var(--color-bg-default)] disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-disabled)]',
        ],
        stroke_neutral: [
          'bg-[var(--color-bg-default)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]',
          'hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-subtle)]',
          'focus-visible:bg-[var(--color-bg-tertiary)] focus-visible:border-[var(--color-border-subtle)]',
          'active:bg-[var(--color-bg-tertiary)] active:border-[var(--color-border-light)]',
          'disabled:bg-[var(--color-bg-default)] disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-disabled)]',
        ],
        icon_only: [
          'text-[var(--color-button-default)]',
          'hover:bg-[var(--color-bg-brand-light)] hover:text-[var(--color-button-hover)]',
          'focus-visible:bg-[var(--color-bg-brand-light)] focus-visible:text-[var(--color-button-focused)]',
          'active:bg-[var(--color-bg-brand-light)] active:text-[var(--color-button-pressed)]',
          'disabled:text-[var(--color-text-disabled)]',
        ],
        text_neutral: [
          'text-[var(--color-text-secondary)]',
          'hover:bg-[var(--color-bg-tertiary)]',
          'focus-visible:bg-[var(--color-bg-tertiary)]',
          'active:bg-[var(--color-bg-tertiary)]',
          'disabled:text-[var(--color-text-disabled)]',
        ],
        icon_inverse: [
          'bg-[rgba(0,0,0,0.5)] text-[var(--color-text-inverse)]',
          'hover:bg-[var(--color-bg-default)] hover:text-[var(--color-text-default)]',
          'focus-visible:bg-[var(--color-bg-default)] focus-visible:text-[var(--color-text-default)]',
          'active:bg-[var(--color-bg-secondary)] active:text-[var(--color-text-default)]',
          'disabled:bg-[rgba(0,0,0,0.5)] disabled:text-[var(--color-text-disabled)]',
        ],
      },
      size: {
        small: 'size-8 rounded-md',
        medium: 'size-11 rounded-lg',
        large: 'size-15 rounded-lg',
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
