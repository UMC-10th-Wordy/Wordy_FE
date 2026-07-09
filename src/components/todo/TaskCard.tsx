import { useState } from 'react'
import type { MouseEvent } from 'react'
import MoveIcon from '@/assets/icons/move.svg?react'
import EditIcon from '@/assets/icons/edit.svg?react'
import TrashIcon from '@/assets/icons/trash.svg?react'
import ChevronUpIcon from '@/assets/icons/Direction=top.svg?react'
import ChevronDownIcon from '@/assets/icons/Direction=bottom.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import ErrorIcon from '@/assets/icons/error.svg?react'
import { Checkbox } from '@/components/common/Checkbox/Checkbox'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import { Input2 } from '@/components/common/Input/Input2'
import PrioritySelect from './PrioritySelect'
import TagSelect from './TagSelect'
import ProjectTag from './ProjectTag'
import type { Task, TaskDraftValues, TaskPriority, TaskTag } from '@/types/todo'

interface TaskCardProps {
  task: Task
  onDelete?: () => void
  onEdit?: (values: TaskDraftValues) => void
  onHandleMouseDown?: (event: MouseEvent<HTMLButtonElement>) => void
  onToggleComplete?: () => void
}

export default function TaskCard({
  task,
  onDelete,
  onEdit,
  onHandleMouseDown,
  onToggleComplete,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draftPriority, setDraftPriority] = useState<TaskPriority | null>(task.priority)
  const [draftTag, setDraftTag] = useState<TaskTag | null>(task.tag ?? null)
  const [draftTitle, setDraftTitle] = useState(task.title)
  const [draftMemo, setDraftMemo] = useState(task.memo ?? '')

  const isDirty =
    draftPriority !== task.priority ||
    (draftTag?.label ?? null) !== (task.tag?.label ?? null) ||
    draftTitle.trim() !== task.title ||
    draftMemo.trim() !== (task.memo ?? '')
  const isDraftValid = draftPriority !== null && draftTitle.trim() !== ''

  const handleStartEdit = () => {
    setDraftPriority(task.priority)
    setDraftTag(task.tag ?? null)
    setDraftTitle(task.title)
    setDraftMemo(task.memo ?? '')
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleConfirmEdit = () => {
    if (!isDirty || !isDraftValid || draftPriority === null) return
    onEdit?.({
      priority: draftPriority,
      tag: draftTag ?? undefined,
      title: draftTitle.trim(),
      memo: draftMemo.trim() || undefined,
    })
    setIsEditing(false)
  }

  return (
    <div className="relative flex w-full flex-col items-end gap-4 rounded-lg border border-(--color-border-brand-subtle) bg-(--color-bg-default) p-5 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
      {isEditing ? (
        <>
          {/* 수정 중 -> 버튼 숨기기, 비활성화 */}
          <div className="flex w-full items-center gap-2">
            <Checkbox aria-label="업무 완료 여부" checked={task.isCompleted} disabled />
            <PrioritySelect value={draftPriority} onChange={setDraftPriority} />
            <TagSelect value={draftTag} onChange={setDraftTag} />
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
              업무명 <span className="text-(--color-text-required)">*</span>
            </p>
            <Input2
              className="w-full"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
            />
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
              메모
            </p>
            <Input2
              className="w-full"
              value={draftMemo}
              onChange={(e) => setDraftMemo(e.target.value)}
            />
          </div>

          <div className="flex shrink-0 items-start gap-3">
            <TextButton
              type="button"
              variant="stroke_neutral"
              className="w-[140px]"
              onClick={handleCancelEdit}
            >
              취소하기
            </TextButton>
            <TextButton
              type="button"
              variant="fill"
              className="w-[140px]"
              disabled={!isDirty || !isDraftValid}
              onClick={handleConfirmEdit}
            >
              수정하기
            </TextButton>
          </div>
        </>
      ) : (
        <>
          {/* 드래그 핸들 / 체크박스 / 프로젝트 태그 / 업무명 */}
          <div className="flex w-full items-start gap-2">
            <div className="flex min-w-0 flex-1 items-start gap-[9px]">
              <div className="flex shrink-0 items-center gap-[9px]">
                <button
                  type="button"
                  aria-label="순서 변경"
                  onMouseDown={onHandleMouseDown}
                  className="flex size-6 shrink-0 cursor-grab items-center justify-center text-(--color-icon-secondary) active:cursor-grabbing"
                >
                  <MoveIcon aria-hidden className="size-6 shrink-0" />
                </button>
                <Checkbox
                  aria-label="업무 완료 여부"
                  checked={task.isCompleted}
                  onChange={onToggleComplete}
                />
                {task.tag && <ProjectTag label={task.tag.label} color={task.tag.color} />}
              </div>
              <p className="min-w-0 flex-1 [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
                {task.title}
              </p>
            </div>
            {/* 아이콘 버튼 */}
            <div className="flex shrink-0 items-center gap-2">
              <IconButton
                type="button"
                variant="text_neutral"
                size="small"
                aria-label="수정"
                onClick={handleStartEdit}
                icon={<EditIcon aria-hidden className="size-6" />}
              />
              <IconButton
                type="button"
                variant="text_neutral"
                size="small"
                aria-label="삭제"
                onClick={() => setIsDeleteConfirmOpen(true)}
                icon={<TrashIcon aria-hidden className="size-6" />}
              />
              <IconButton
                type="button"
                variant="text_neutral"
                size="small"
                aria-label={isExpanded ? '접기' : '펼치기'}
                aria-expanded={isExpanded}
                onClick={() => setIsExpanded((prev) => !prev)}
                icon={
                  isExpanded ? (
                    <ChevronUpIcon aria-hidden className="size-6" />
                  ) : (
                    <ChevronDownIcon aria-hidden className="size-6" />
                  )
                }
              />
            </div>
          </div>

          {isExpanded && (
            <>
              {/* 메모 */}
              {task.memo && (
                <div className="flex w-full flex-col items-start gap-1 pb-2">
                  <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                    메모
                  </p>
                  <p className="w-full [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary)">
                    {task.memo}
                  </p>
                </div>
              )}

              {/* 업무 결과 - 완료된 업무에서만 노출 */}
              {task.isCompleted &&
                (task.result ? (
                  <div className="flex w-full flex-col items-start gap-1">
                    <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                      업무 결과
                    </p>
                    <p className="w-full [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)">
                      {task.result}
                    </p>
                  </div>
                ) : (
                  <TextButton
                    type="button"
                    variant="text_only"
                    size="medium"
                    iconLeft={<PlusIcon aria-hidden className="size-7" />}
                  >
                    업무 결과 작성하기
                  </TextButton>
                ))}
            </>
          )}
        </>
      )}

      {isDeleteConfirmOpen && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-(--color-bg-overlay)">
          <div className="flex flex-col items-center gap-5 rounded-(--scale-12) bg-(--color-bg-default) px-8 py-5 shadow-[0px_1px_7.5px_0px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col items-center gap-3">
              <ErrorIcon aria-hidden className="size-7 text-(--color-icon-brand)" />
              <p className="text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary)">
                이 업무를 삭제할까요?
                <br />
                삭제하면 되돌릴 수 없어요
              </p>
            </div>
            <div className="flex items-center gap-[10px]">
              <TextButton
                type="button"
                variant="stroke_neutral"
                className="w-32"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                취소하기
              </TextButton>
              <TextButton
                type="button"
                variant="fill"
                className="w-32"
                onClick={() => {
                  setIsDeleteConfirmOpen(false)
                  onDelete?.()
                }}
              >
                삭제하기
              </TextButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
