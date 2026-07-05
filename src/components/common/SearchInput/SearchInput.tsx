import { useState, useRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import MagnifierIcon from '@/assets/icons/magnifier.svg?react'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  recentKeywords?: string[]
  onSearch?: (value: string) => void
  onRemoveKeyword?: (keyword: string) => void
  onClearAll?: () => void
}

export function SearchInput({
  recentKeywords = [],
  onSearch,
  onRemoveKeyword,
  onClearAll,
  className,
  ...rest
}: SearchInputProps) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const showDropdown = focused && recentKeywords.length > 0

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(e.currentTarget.value)
    }
  }

  return (
    <div className={['relative', className].filter(Boolean).join(' ')}>
      <div
        className={[
          'flex items-center gap-[10px] px-5 py-3 rounded-(--scale-12) border bg-(--color-bg-default) transition-colors duration-100',
          focused ? 'border-(--color-border-brand)' : 'border-(--color-border-light)',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          className="flex-1 min-w-0 bg-transparent outline-none [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-normal text-(--color-text-default) placeholder:text-(--color-text-tertiary) caret-(--color-border-brand)"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        <MagnifierIcon width={32} height={32} className="shrink-0 text-(--color-icon-secondary)" />
      </div>

      {showDropdown && (
        <div className="absolute -left-px top-[calc(100%+8px)] w-[calc(100%+2px)] bg-(--color-bg-default) rounded-(--scale-12) shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)] px-4 py-5 flex flex-col gap-[10px] z-10">
          <div className="flex items-center justify-between pl-1">
            <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-tertiary)">
              최근 검색어
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="h-8 px-2 rounded-md [font-size:var(--font-size-body-1)] leading-(--line-height-body) font-medium text-(--color-button-default) hover:bg-(--color-bg-brand-subtle) transition-colors duration-100"
            >
              모두 지우기
            </button>
          </div>
          <ul>
            {recentKeywords.slice(0, 5).map((keyword) => (
              <li
                key={keyword}
                className="flex items-center justify-between h-[52px] px-1 hover:bg-(--color-sidebar-neutral-hover) rounded-md transition-colors duration-100"
              >
                <button
                  type="button"
                  className="flex-1 text-left [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-normal text-(--color-text-default)"
                  onClick={() => {
                    if (inputRef.current) inputRef.current.value = keyword
                    onSearch?.(keyword)
                    setFocused(false)
                  }}
                >
                  {keyword}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveKeyword?.(keyword)}
                  className="flex items-center justify-center size-8 rounded-md text-(--color-icon-secondary) hover:bg-(--color-bg-tertiary) transition-colors duration-100"
                >
                  <XMarkIcon width={24} height={24} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
