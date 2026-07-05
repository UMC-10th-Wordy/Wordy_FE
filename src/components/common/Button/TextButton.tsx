import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const button = cva(
  [
    'inline-flex items-center justify-center',
    'font-medium leading-(--line-height-body) whitespace-nowrap',
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
        text_only: [
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
        small: 'h-8 px-2 gap-1 [font-size:var(--font-size-body-1)] rounded-md',
        medium: 'h-11 px-3 gap-1 [font-size:var(--font-size-body-2)] rounded-lg',
        large: 'h-[60px] px-4 gap-2 [font-size:var(--font-size-body-4)] rounded-lg',
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

export type TextButtonVariant = NonNullable<VariantProps<typeof button>['variant']>
export type TextButtonSize = NonNullable<VariantProps<typeof button>['size']>

export interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TextButtonVariant
  size?: TextButtonSize
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

export function TextButton({
  variant,
  size,
  fullWidth,
  className,
  iconLeft,
  iconRight,
  children,
  ...rest
}: TextButtonProps) {
  return (
    <button className={button({ variant, size, fullWidth, className })} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
