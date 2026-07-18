import { useState } from 'react'
import type { TextareaHTMLAttributes, ChangeEvent } from 'react'

export interface Input2Props extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  maxCharacter?: number
}

export function Input2({ maxCharacter, className, onChange, value, ...rest }: Input2Props) {
  const isControlled = value !== undefined
  const [uncontrolledLength, setUncontrolledLength] = useState(
    typeof rest.defaultValue === 'string' ? rest.defaultValue.length : 0,
  )

  const currentLength = isControlled
    ? typeof value === 'string'
      ? value.length
      : 0
    : uncontrolledLength

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setUncontrolledLength(e.target.value.length)
    onChange?.(e)
  }

  return (
    <div
      className={[
        'flex flex-col',
        'bg-(--color-bg-brand-subtle) rounded-lg border-[0.5px] px-5 py-3',
        maxCharacter !== undefined ? 'min-h-40' : 'min-h-30',
        'border-(--color-border-brand-subtle) focus-within:border-(--color-border-brand)',
        'transition-colors duration-100 ease-out',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <textarea
        value={value}
        onChange={handleChange}
        className="flex-1 w-full bg-transparent outline-none resize-none [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-normal text-(--color-text-default) placeholder:text-(--color-text-tertiary) disabled:text-(--color-text-disabled) disabled:cursor-not-allowed"
        {...rest}
      />
      {maxCharacter !== undefined && (
        <span className="self-end [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
          {currentLength}/{maxCharacter}
        </span>
      )}
    </div>
  )
}
