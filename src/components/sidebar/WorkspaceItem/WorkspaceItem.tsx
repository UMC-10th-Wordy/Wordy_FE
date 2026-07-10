import { cva } from 'class-variance-authority'
import type { HTMLAttributes, KeyboardEvent, MouseEvent } from 'react'
import { IconButton } from '@/components/common/Button/IconButton'
import EditIcon from '@/assets/icons/edit.svg?react'
import TrashIcon from '@/assets/icons/trash.svg?react'

const workspaceItem = cva(
  [
    'flex items-center gap-2 p-3 w-full',
    'border border-solid rounded-(--scale-12)',
    'transition-colors duration-100 ease-out cursor-pointer',
    'bg-(--color-bg-default) border-(--color-border-subtle)',
    'hover:bg-(--color-sidebar-neutral-hover)',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-brand)',
  ],
  {
    variants: {
      selected: {
        true: 'bg-(--color-bg-brand-light) border-(--color-border-brand)',
        false: '',
      },
    },
    defaultVariants: { selected: false },
  },
)

export interface WorkspaceItemProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  selected?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function WorkspaceItem({
  name,
  selected = false,
  onEdit,
  onDelete,
  onClick,
  className,
  ...rest
}: WorkspaceItemProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.(e as unknown as MouseEvent<HTMLDivElement>)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={workspaceItem({ selected, className })}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <span className="flex-1 min-w-0 [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-default) truncate">
        {name}
      </span>
      <span className="flex items-center gap-2 shrink-0">
        <IconButton
          variant="text_neutral"
          size="small"
          icon={<EditIcon width={24} height={24} />}
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.()
          }}
          aria-label="워크스페이스 편집"
        />
        <IconButton
          variant="text_neutral"
          size="small"
          icon={<TrashIcon width={24} height={24} />}
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.()
          }}
          aria-label="워크스페이스 삭제"
        />
      </span>
    </div>
  )
}
