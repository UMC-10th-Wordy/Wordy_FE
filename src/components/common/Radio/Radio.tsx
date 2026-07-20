import type { InputHTMLAttributes, ReactNode } from 'react'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode
}

export function Radio({ label, className, id, disabled, ...rest }: RadioProps) {
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
          type="radio"
          id={id}
          disabled={disabled}
          className="peer appearance-none size-5 rounded-full border border-(--color-border-subtle) bg-(--color-bg-default) transition-colors duration-100 ease-out cursor-pointer
            hover:bg-(--color-bg-tertiary)
            active:bg-(--color-bg-tertiary) active:border-(--color-border-pressed)
            checked:border checked:border-(--color-button-default) checked:bg-(--color-bg-default)
            checked:hover:border-(--color-button-hover)
            checked:active:border-(--color-button-pressed)
            disabled:cursor-not-allowed disabled:bg-(--color-bg-default) disabled:border-(--color-border-disabled)
            checked:disabled:border-(--color-border-disabled)"
          {...rest}
        />
        <span
          className="pointer-events-none absolute size-3.5 rounded-full transition-colors duration-100 ease-out
            opacity-0 peer-checked:opacity-100
            bg-(--color-button-default)
            peer-checked:peer-hover:bg-(--color-button-hover)
            peer-checked:peer-active:bg-(--color-button-pressed)
            peer-checked:peer-disabled:bg-(--color-border-disabled)"
        />
      </span>
      {label && (
        <span
          className={[
            '[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal',
            disabled ? 'text-(--color-text-disabled)' : 'text-(--color-text-default)',
          ].join(' ')}
        >
          {label}
        </span>
      )}
    </label>
  )
}
