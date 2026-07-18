import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import EyeIcon from '@/assets/icons/eye.svg?react'
import EyeOffIcon from '@/assets/icons/eye-off.svg?react'
import ErrorIcon from '@/assets/icons/error.svg?react'
import SuccessIcon from '@/assets/icons/success.svg?react'

export interface Input1Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  success?: ReactNode
}

export function Input1({
  label,
  hint,
  error,
  success,
  className,
  type,
  disabled,
  ...rest
}: Input1Props) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const hasError = !!error
  const hasSuccess = !!success

  const borderClass = hasError
    ? 'border-(--color-border-error)'
    : hasSuccess
      ? 'border-(--color-border-success)'
      : 'border-(--color-border-subtle) focus-within:border-(--color-border-brand)'

  return (
    <div className={['flex flex-col gap-1 w-full', className].filter(Boolean).join(' ')}>
      {label && (
        <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
          {label}
        </span>
      )}
      <div
        className={[
          'flex items-center gap-2 h-15 px-5 rounded-lg border bg-(--color-bg-default) transition-colors duration-100 ease-out',
          disabled ? 'border-(--color-border-disabled)' : borderClass,
        ].join(' ')}
      >
        <input
          type={isPassword && showPassword ? 'text' : type}
          disabled={disabled}
          className="flex-1 min-w-0 bg-transparent outline-none [font-size:var(--font-size-body-1)] leading-(--line-height-body) font-normal text-(--color-text-default) placeholder:text-(--color-text-tertiary) disabled:text-(--color-text-disabled) disabled:cursor-not-allowed"
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            className="shrink-0 text-(--color-icon-tertiary) cursor-pointer"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <EyeIcon width={24} height={24} />
            ) : (
              <EyeOffIcon width={24} height={24} />
            )}
          </button>
        )}
      </div>
      {hasError && (
        <div className="flex items-center gap-1">
          <ErrorIcon width={24} height={24} className="shrink-0 text-(--color-status-error)" />
          <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) text-(--color-text-error)">
            {error}
          </span>
        </div>
      )}
      {hasSuccess && (
        <div className="flex items-center gap-1">
          <SuccessIcon width={24} height={24} className="shrink-0 text-(--color-status-success)" />
          <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) text-(--color-text-success)">
            {success}
          </span>
        </div>
      )}
      {!hasError && !hasSuccess && hint && (
        <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) text-(--color-text-tertiary)">
          {hint}
        </span>
      )}
    </div>
  )
}
