import { useState } from 'react'
import type { HTMLAttributes } from 'react'
import { WorkspaceItem } from '../WorkspaceItem/WorkspaceItem'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import ErrorIcon from '@/assets/icons/error.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'

export interface WorkspaceModalProps extends HTMLAttributes<HTMLDivElement> {
  workspaces?: Array<{ id: string; name: string }>
  selectedId?: string
  maxWorkspaces?: number
  onAdd?: (name: string) => void
  onEdit?: (id: string, name: string) => void
  onDelete?: (id: string) => void
  onSelectWorkspace?: (id: string) => void
  onClose?: () => void
}

export function WorkspaceModal({
  workspaces = [],
  selectedId,
  maxWorkspaces = 2,
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const currentUsage = workspaces.length

  function startEdit(id: string, name: string) {
    setEditingId(id)
    setEditingValue(name)
  }

  function commitEdit() {
    if (editingId && editingValue.trim()) {
      onEdit?.(editingId, editingValue.trim())
    }
    setEditingId(null)
    setEditingValue('')
  }

  return (
    <>
      <div
        className={[
          'bg-(--color-bg-default) rounded-(--scale-12) shadow-[0px_1px_15px_rgba(0,0,0,0.1)] overflow-clip',
          'flex flex-col gap-5 items-start px-3 py-5 w-113.25 min-h-130',
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
        <div className="flex flex-col items-start justify-between flex-1 w-full">
          <div className="flex flex-col gap-3 items-center shrink-0 w-full">
            {workspaces.map((workspace) =>
              editingId === workspace.id ? (
                <div
                  key={workspace.id}
                  className="bg-(--color-bg-brand-subtle) flex items-center px-5 h-14 w-full rounded-lg border-[0.5px_solid_var(--color-border-brand)] shrink-0"
                >
                  <input
                    autoFocus
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit()
                      if (e.key === 'Escape') {
                        setEditingId(null)
                        setEditingValue('')
                      }
                    }}
                    onBlur={commitEdit}
                    className="flex-1 bg-transparent outline-none [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)"
                  />
                </div>
              ) : (
                <WorkspaceItem
                  key={workspace.id}
                  name={workspace.name}
                  selected={workspace.id === selectedId}
                  onEdit={() => startEdit(workspace.id, workspace.name)}
                  onDelete={workspaces.length > 1 ? () => setDeletingId(workspace.id) : undefined}
                  onClick={() => onSelectWorkspace?.(workspace.id)}
                />
              ),
            )}

            {isAdding ? (
              <div className="bg-(--color-bg-brand-subtle) flex items-center px-5 h-14 w-full rounded-lg border-[0.5px_solid_var(--color-border-brand-subtle)] focus-within:border-[0.5px_solid_var(--color-border-brand)] transition-colors duration-100 shrink-0">
                <input
                  autoFocus
                  placeholder="워크스페이스 이름을 작성해 주세요"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                      onAdd?.(inputValue.trim())
                      setInputValue('')
                      setIsAdding(false)
                    }
                    if (e.key === 'Escape') {
                      setInputValue('')
                      setIsAdding(false)
                    }
                  }}
                  className="flex-1 bg-transparent outline-none [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default) placeholder:text-(--color-text-tertiary)"
                />
              </div>
            ) : currentUsage < maxWorkspaces ? (
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
                <ErrorIcon width={24} height={24} className="shrink-0 text-(--color-icon-brand)" />
                <span className="flex-1 [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-secondary)">
                  워크스페이스 사용량
                </span>
              </div>
              <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-brand) whitespace-nowrap">
                {currentUsage}/{maxWorkspaces}
              </span>
            </div>
            <div className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary) w-full">
              <p>워크스페이스를 최대 {maxWorkspaces}개까지 사용할 수 있어요.</p>
              <p>Pro로 업그레이드하고 무제한으로 활용하세요!</p>
            </div>
          </div>
        </div>
      </div>

      {deletingId && (
        <ConfirmDialog
          message={
            <>
              <p>이 워크스페이스를 삭제할까요?</p>
              <p>삭제하면 되돌릴 수 없어요</p>
            </>
          }
          confirmLabel="삭제하기"
          cancelLabel="취소하기"
          onConfirm={() => {
            onDelete?.(deletingId)
            setDeletingId(null)
          }}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </>
  )
}
