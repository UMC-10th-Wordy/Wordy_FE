import { useRef, useState } from 'react'
import ChevronUpIcon from '@/assets/icons/Direction=top.svg?react'
import ChevronDownIcon from '@/assets/icons/Direction=bottom.svg?react'
import { Radio } from '@/components/common/Radio/Radio'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import type { TaskPriority } from '@/types/todo'

interface PriorityOption {
  value: TaskPriority
  label: string
  description: string
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'must', label: 'Must do', description: '반드시 오늘 끝낼 거예요' },
  { value: 'should', label: 'Should do', description: '가능하면 오늘 완료할 거예요' },
  { value: 'could', label: 'Could do', description: '여유가 있으면 진행할 거예요' },
]

interface PrioritySelectProps {
  value: TaskPriority | null
  onChange: (value: TaskPriority) => void
}

export default function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useOutsideClick(containerRef, () => setIsOpen(false), isOpen)

  const selected = PRIORITY_OPTIONS.find((option) => option.value === value)

  const handleSelect = (nextValue: TaskPriority) => {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative inline-flex shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        style={{
          backgroundColor: selected ? 'var(--color-button-default)' : 'var(--color-bg-tertiary)',
        }}
        className="flex shrink-0 items-center justify-center gap-1 rounded-lg px-2 py-1"
      >
        <span
          style={{ color: selected ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)' }}
          className={`[font-size:var(--font-size-body-3)] leading-(--line-height-body) ${
            selected ? 'font-semibold' : 'font-medium'
          }`}
        >
          {selected ? selected.label : '우선순위를 선택해 주세요'}
        </span>
        {isOpen ? (
          <ChevronUpIcon
            aria-hidden
            style={{
              color: selected ? 'var(--color-icon-inverse)' : 'var(--color-icon-secondary)',
            }}
            className="size-4 shrink-0"
          />
        ) : (
          <ChevronDownIcon
            aria-hidden
            style={{
              color: selected ? 'var(--color-icon-inverse)' : 'var(--color-icon-secondary)',
            }}
            className="size-4 shrink-0"
          />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-[calc(100%+14px)] left-[-14px] z-10 flex w-[250px] flex-col items-start gap-1 rounded-(--scale-12) bg-(--color-bg-default) p-4 shadow-[0px_1px_7.5px_0px_rgba(0,0,0,0.1)]"
          role="radiogroup"
          aria-label="우선순위 선택"
        >
          {PRIORITY_OPTIONS.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="flex w-full cursor-pointer flex-col items-start rounded-md p-1 hover:bg-(--color-bg-tertiary)"
            >
              <div className="flex w-full items-center gap-2">
                <Radio
                  name="task-priority"
                  checked={value === option.value}
                  onChange={() => handleSelect(option.value)}
                />
                <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
                  {option.label}
                </span>
              </div>
              <div className="flex items-center justify-center pl-8">
                <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                  {option.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
