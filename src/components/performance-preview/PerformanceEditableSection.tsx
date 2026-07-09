import { useRef, useState } from 'react'

import { IconButton } from '@/components/common/Button/IconButton'
import { Input2 } from '@/components/common/Input/Input2'

import type { ChangeEvent } from 'react'

import EditIcon from '@/assets/icons/edit.svg?react'

interface PerformanceEditableSectionProps {
  title: string
  value: string
  placeholder?: string
  onChangeValue: (value: string) => void
}

export const PerformanceEditableSection = ({
  title,
  value,
  placeholder,
  onChangeValue,
}: PerformanceEditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const handleChangeValue = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChangeValue(event.target.value)
  }

  const handleClickEdit = () => {
    if (isEditing) {
      return
    }

    setIsEditing(true)

    window.requestAnimationFrame(() => {
      const textarea = sectionRef.current?.querySelector('textarea')

      if (!textarea) {
        return
      }

      textarea.focus()
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    })
  }

  const handleBlurInput = () => {
    setIsEditing(false)
  }

  return (
    <section ref={sectionRef} className="flex w-full flex-col">
      <div className="flex h-(--scale-32) w-full items-start justify-between">
        <h3 className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
          {title}
        </h3>

        <IconButton
          type="button"
          variant="text_neutral"
          size="small"
          aria-label={`${title} 수정하기`}
          aria-pressed={isEditing}
          onMouseDown={(event) => {
            event.preventDefault()
          }}
          onClick={() => {
            if (isEditing) {
              return
            }

            handleClickEdit()
          }}
          className={
            isEditing
              ? '!cursor-default hover:!bg-transparent focus-visible:!bg-transparent active:!bg-transparent'
              : undefined
          }
          icon={
            <EditIcon
              aria-hidden
              className={[
                'h-[16.05px] w-[16.08px]',
                isEditing
                  ? 'text-[var(--color-button-default)]'
                  : 'text-[var(--color-icon-tertiary)]',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          }
        />
      </div>

      <Input2
        value={value}
        placeholder={placeholder}
        rows={1}
        readOnly={!isEditing}
        onChange={handleChangeValue}
        onBlur={handleBlurInput}
        className={[
          'mt-(--scale-4) w-full !min-h-0',
          'bg-(--color-bg-brand-subtle)',
          'px-(--scale-20) py-(--scale-12)',
          '[&>textarea]:[field-sizing:content]',
          '[&>textarea]:overflow-hidden',
          !isEditing && '!border-(--color-border-brand-subtle)',
          !isEditing && '[&>textarea]:pointer-events-none',
          isEditing && '!border-(--color-border-brand)',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          caretColor: 'var(--color-border-brand)',
        }}
      />
    </section>
  )
}
