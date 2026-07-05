import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

const button = cva(
  [
    'inline-flex items-center justify-center',
    'font-medium whitespace-nowrap',
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
        text_only: [
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
      },
      size: {
        small: 'h-8 px-2 text-sm rounded-md',
        medium: 'h-11 px-3 text-base rounded-lg',
        large: 'h-[60px] px-4 text-xl rounded-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'fill',
      size: 'medium',
      fullWidth: false,
    },
  },
)

export type ButtonVariant = NonNullable<VariantProps<typeof button>['variant']>
export type ButtonSize = NonNullable<VariantProps<typeof button>['size']>

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export function Button({ variant, size, fullWidth, className, ...rest }: ButtonProps) {
  return <button className={button({ variant, size, fullWidth, className })} {...rest} />
}
