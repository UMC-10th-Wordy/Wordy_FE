import type { MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MoveIcon from '@/assets/icons/move.svg?react'
import EditIcon from '@/assets/icons/edit.svg?react'
import TrashIcon from '@/assets/icons/trash.svg?react'
import ChevronUpIcon from '@/assets/icons/Direction=top.svg?react'
import ChevronDownIcon from '@/assets/icons/Direction=bottom.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import { Checkbox } from '@/components/common/Checkbox/Checkbox'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import ProjectTag from './ProjectTag'
import { ResultAttachments } from './ResultAttachments'
import type { Task } from '@/types/todo'

interface TaskCardViewProps {
  task: Task
  isExpanded: boolean
  onToggleExpanded: () => void
  onHandleMouseDown?: (event: MouseEvent<HTMLButtonElement>) => void
  onToggleComplete?: () => void
  onStartEdit: () => void
  onDeleteClick: () => void
  onStartWriteResult: () => void
}

/* 업무 카드 기본(보기) 모드 - 드래그 핸들/체크박스/태그/업무명 + 펼치면 메모/업무 결과 노출 */
export function TaskCardView({
  task,
  isExpanded,
  onToggleExpanded,
  onHandleMouseDown,
  onToggleComplete,
  onStartEdit,
  onDeleteClick,
  onStartWriteResult,
}: TaskCardViewProps) {
  const hasExpandableContent = Boolean(task.memo) || task.isCompleted

  return (
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
              onChange={() => onToggleComplete?.()}
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
            onClick={onStartEdit}
            icon={<EditIcon aria-hidden className="size-6" />}
          />
          <IconButton
            type="button"
            variant="text_neutral"
            size="small"
            aria-label="삭제"
            onClick={onDeleteClick}
            icon={<TrashIcon aria-hidden className="size-6" />}
          />
          <IconButton
            type="button"
            variant="text_neutral"
            size="small"
            aria-label={isExpanded ? '접기' : '펼치기'}
            aria-expanded={isExpanded}
            onClick={onToggleExpanded}
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

      <AnimatePresence initial={false}>
        {isExpanded && hasExpandableContent && (
          <motion.div
            key="task-card-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex w-full flex-col items-end gap-4 overflow-hidden"
          >
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
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex w-full flex-col items-start gap-1">
                    <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                      업무 결과
                    </p>
                    <p className="w-full [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)">
                      {task.result}
                    </p>
                  </div>
                  <ResultAttachments
                    files={task.resultFiles ?? []}
                    images={task.resultImages ?? []}
                  />
                </div>
              ) : (
                <TextButton
                  type="button"
                  variant="text_only"
                  size="medium"
                  iconLeft={<PlusIcon aria-hidden className="size-7" />}
                  onClick={onStartWriteResult}
                >
                  업무 결과 작성하기
                </TextButton>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
