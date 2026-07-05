import type { InputHTMLAttributes, ReactNode } from 'react'
import CheckIcon from '@/assets/icons/check.svg?react'

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: ReactNode
}

export function Checkbox({ label, className, id, disabled, ...rest }: CheckboxProps) {
  return (
    <label
      className={[
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      htmlFor={id}
    >
      <span className="relative size-6 shrink-0 flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          disabled={disabled}
          className="peer appearance-none size-5 rounded-sm border border-(--color-border-subtle) bg-(--color-bg-default) transition-colors duration-100 ease-out cursor-pointer
            hover:bg-(--color-bg-tertiary)
            active:bg-(--color-bg-tertiary) active:border-(--color-border-pressed)
            checked:bg-(--color-button-default) checked:border-(--color-button-default)
            checked:hover:bg-(--color-button-hover) checked:hover:border-(--color-button-hover)
            checked:active:bg-(--color-button-pressed) checked:active:border-(--color-button-pressed)
            disabled:cursor-not-allowed
            disabled:bg-(--color-bg-default) disabled:border-(--color-border-disabled)
            checked:disabled:bg-(--color-border-disabled) checked:disabled:border-(--color-border-disabled)"
          {...rest}
        />
        <CheckIcon
          className="pointer-events-none absolute opacity-0 peer-checked:opacity-100 text-(--color-text-inverse)"
          width={20}
          height={20}
        />
      </span>
      {label && (
        <span
          className={[
            '[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-normal',
            disabled ? 'text-(--color-text-disabled)' : 'text-(--color-text-default)',
          ].join(' ')}
        >
          {label}
        </span>
      )}
    </label>
  )
}
