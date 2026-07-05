import type { InputHTMLAttributes } from 'react'

export type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>

export function Toggle({ className, disabled, ...rest }: ToggleProps) {
  return (
    <label
      className={[
        'relative inline-flex cursor-pointer',
        disabled && 'cursor-not-allowed opacity-40',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input type="checkbox" className="sr-only peer" disabled={disabled} {...rest} />
      <div className="w-13 h-8 rounded-(--scale-1000) p-1 flex items-center transition-colors duration-200 ease-out bg-(--color-bg-tertiary) peer-checked:bg-(--color-icon-brand) shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.05)] peer-checked:[&>div]:translate-x-5">
        <div className="size-6 rounded-full bg-(--color-bg-default) shadow-[0px_1px_5px_rgba(0,0,0,0.1)] transition-transform duration-200 ease-out" />
      </div>
    </label>
  )
}
