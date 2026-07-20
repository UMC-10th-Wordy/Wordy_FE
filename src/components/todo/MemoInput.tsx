import { useLayoutEffect, useRef } from 'react'
import type { ChangeEvent } from 'react'

interface MemoInputProps {
  value: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  minHeightClassName?: string
}

export function MemoInput({
  value,
  onChange,
  placeholder,
  className,
  minHeightClassName = 'min-h-[53px]',
}: MemoInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <div
      className={[
        'flex flex-col',
        'bg-(--color-bg-brand-subtle) rounded-lg border-[0.5px] px-5 py-3',
        minHeightClassName,
        'border-(--color-border-brand-subtle) focus-within:border-(--color-border-brand)',
        'transition-colors duration-100 ease-out',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={1}
        className="w-full min-w-0 resize-none overflow-hidden [overflow-wrap:break-word] whitespace-pre-wrap bg-transparent outline-none [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-normal text-(--color-text-default) placeholder:text-(--color-text-tertiary)"
      />
    </div>
  )
}
