import { useState } from 'react'
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
import type { Task } from '@/types/todo'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="flex w-full flex-col items-end gap-4 rounded-lg border border-(--color-border-brand-subtle) bg-(--color-bg-default) p-5 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
      {/* 드래그 핸들 / 체크박스 / 프로젝트 태그 / 업무명 */}
      <div className="flex w-full items-center gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-[9px]">
          <div className="flex shrink-0 items-center gap-[9px]">
            <button
              type="button"
              aria-label="순서 변경"
              className="flex size-6 shrink-0 items-center justify-center text-(--color-icon-secondary)"
            >
              <MoveIcon aria-hidden className="size-6 shrink-0" />
            </button>
            <Checkbox aria-label="업무 완료 여부" />
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
            icon={<EditIcon aria-hidden className="size-6" />}
          />
          <IconButton
            type="button"
            variant="text_neutral"
            size="small"
            aria-label="삭제"
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

          {/* 업무 결과 작성하기 */}
          <TextButton
            type="button"
            variant="text_only"
            size="medium"
            iconLeft={<PlusIcon aria-hidden className="size-7" />}
          >
            업무 결과 작성하기
          </TextButton>
        </>
      )}
    </div>
  )
}
