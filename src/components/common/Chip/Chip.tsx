import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const chip = cva(
  [
    'inline-flex items-center justify-center',
    'leading-(--line-height-body) whitespace-nowrap',
    'transition-colors duration-100 ease-out',
    'cursor-pointer',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        round: [
          'rounded-(--scale-1000)',
          'h-14 px-5',
          '[font-size:var(--font-size-body-4)] font-normal',
          'bg-(--color-chip-default) text-(--color-text-default)',
          'hover:bg-(--color-chip-hover)',
          'active:bg-(--color-chip-pressed)',
          'focus-visible:bg-(--color-chip-focused) focus-visible:font-semibold focus-visible:text-(--color-text-brand)',
          'disabled:bg-(--color-chip-disabled) disabled:text-(--color-text-disabled)',
        ],
        rectangle: [
          'rounded-lg',
          'h-14 px-5',
          '[font-size:var(--font-size-body-4)] font-normal',
          'bg-(--color-chip-default) text-(--color-text-default)',
          'hover:bg-(--color-chip-hover)',
          'active:bg-(--color-chip-pressed)',
          'focus-visible:bg-(--color-chip-focused) focus-visible:font-semibold focus-visible:text-(--color-text-brand)',
          'disabled:bg-(--color-chip-disabled) disabled:text-(--color-text-disabled)',
        ],
        small_round: [
          'rounded-(--scale-1000)',
          'px-4 py-2',
          '[font-size:var(--font-size-body-3)] font-normal',
          'border',
          'bg-(--color-chip-default) border-(--color-border-subtle) text-(--color-text-default)',
          'hover:bg-(--color-chip-hover) hover:border-(--color-border-subtle)',
          'active:bg-(--color-chip-hover) active:border-(--color-border-light)',
          'focus-visible:bg-(--color-chip-focused) focus-visible:border-(--color-border-brand) focus-visible:font-semibold focus-visible:text-(--color-text-brand)',
          'disabled:bg-(--color-chip-disabled) disabled:border-(--color-border-disabled) disabled:font-medium disabled:text-(--color-text-disabled)',
        ],
      },
    },
    defaultVariants: {
      variant: 'round',
    },
  },
)

export type ChipVariant = NonNullable<VariantProps<typeof chip>['variant']>

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant
  children?: ReactNode
}

export function Chip({ variant, className, children, ...rest }: ChipProps) {
  return (
    <button className={chip({ variant, className })} {...rest}>
      {children}
    </button>
  )
}
