import { useState } from 'react'
import type { HTMLAttributes } from 'react'
import { WorkspaceItem } from '../WorkspaceItem/WorkspaceItem'
import { Input1 } from '@/components/common/Input/Input1'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import ErrorIcon from '@/assets/icons/error.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'

export interface WorkspaceModalProps extends HTMLAttributes<HTMLDivElement> {
  workspaces?: Array<{ id: string; name: string }>
  onAdd?: (name: string) => void
  onEdit?: (id: string, name: string) => void
  onDelete?: (id: string) => void
  onSelectWorkspace?: (id: string) => void
  onClose?: () => void
}

export function WorkspaceModal({
  workspaces = [],
  onAdd,
  onEdit,
  onDelete,
  onSelectWorkspace,
  onClose,
  className,
  ...rest
}: WorkspaceModalProps) {
  const [inputValue, setInputValue] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const currentUsage = workspaces.length
  const maxUsage = 2

  return (
    <div
      className={[
        'bg-(--color-bg-default) rounded-(--scale-12) shadow-[0px_1px_15px_rgba(0,0,0,0.1)]',
        'flex flex-col gap-5 items-start px-3 py-5 w-[453px] h-[520px]',
        className,
      ].join(' ')}
      {...rest}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between pl-2 shrink-0 w-full">
        <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-secondary) whitespace-nowrap">
          워크스페이스 관리
        </span>
        <IconButton
          variant="text_neutral"
          size="medium"
          icon={<XMarkIcon width={32} height={32} />}
          onClick={onClose}
          aria-label="닫기"
        />
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col items-start justify-between flex-1 min-h-0 w-full">
        <div className="flex flex-col gap-3 items-center shrink-0 w-full overflow-y-auto">
          {workspaces.map((workspace) => (
            <WorkspaceItem
              key={workspace.id}
              name={workspace.name}
              onEdit={() => onEdit?.(workspace.id, workspace.name)}
              onDelete={() => onDelete?.(workspace.id)}
              onClick={() => onSelectWorkspace?.(workspace.id)}
            />
          ))}

          {isAdding ? (
            <div className="bg-(--color-bg-brand-subtle) flex items-center p-3 w-full h-14 rounded-(--scale-12)">
              <Input1
                placeholder="워크스페이스 이름을 작성해 주세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim()) {
                    onAdd?.(inputValue.trim())
                    setInputValue('')
                    setIsAdding(false)
                  }
                }}
                className="flex-1"
              />
            </div>
          ) : currentUsage < maxUsage ? (
            <TextButton
              variant="text_neutral"
              size="medium"
              iconLeft={<PlusIcon width={28} height={28} />}
              onClick={() => setIsAdding(true)}
            >
              워크스페이스 추가하기
            </TextButton>
          ) : null}
        </div>

        {/* 사용량 안내 */}
        <div className="bg-(--color-bg-brand-subtle) flex flex-col gap-5 items-start justify-center p-3 rounded-(--scale-12) shrink-0 w-full">
          <div className="flex items-center gap-2 shrink-0 w-full">
            <div className="flex flex-1 gap-1 items-center min-w-0">
              <ErrorIcon width={24} height={24} className="shrink-0 text-(--color-status-error)" />
              <span className="flex-1 [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-secondary)">
                워크스페이스 사용량
              </span>
            </div>
            <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-brand) whitespace-nowrap">
              {currentUsage}/{maxUsage}
            </span>
          </div>
          <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary) w-full">
            워크스페이스를 최대 2개까지 사용할 수 있어요.{'\n'}
            Pro로 업그레이드하고 무제한으로 활용하세요!
          </span>
        </div>
      </div>
    </div>
  )
}
