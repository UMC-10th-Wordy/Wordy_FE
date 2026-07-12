import { useState } from 'react'
import { Input2 } from '@/components/common/Input/Input2'
import { TextButton } from '@/components/common/Button/TextButton'
import PrioritySelect from './PrioritySelect'
import TagSelect from './TagSelect'
import type { TaskDraftValues, TaskPriority, TaskTag } from '@/types/todo'

interface TaskFormProps {
  onCancel?: () => void
  onSubmit?: (values: TaskDraftValues) => void
}

export default function TaskForm({ onCancel, onSubmit }: TaskFormProps) {
  const [priority, setPriority] = useState<TaskPriority | null>(null)
  const [tag, setTag] = useState<TaskTag | null>(null)
  const [title, setTitle] = useState('')
  const [memo, setMemo] = useState('')

  /* 필수 요소 모두 입력해야 업무 추가 활성화 */
  const isValid = priority !== null && title.trim() !== ''

  const handleSubmit = () => {
    if (!isValid || priority === null) return
    onSubmit?.({
      priority,
      tag: tag ?? undefined,
      title: title.trim(),
      memo: memo.trim() || undefined,
    })
  }

  return (
    <form className="flex w-full flex-col items-end gap-4 rounded-lg border border-(--color-border-brand-subtle) bg-(--color-bg-default) p-5 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
      {/* 우선순위 / 프로젝트 태그 */}
      <div className="flex w-full flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
            우선순위 <span className="text-(--color-text-required)">*</span>
          </p>
          <PrioritySelect value={priority} onChange={setPriority} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
          <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
            프로젝트 태그
          </p>
          <TagSelect value={tag} onChange={setTag} />
        </div>
      </div>

      {/* 업무명 */}
      <div className="flex w-full flex-col items-start gap-2">
        <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
          업무명 <span className="text-(--color-text-required)">*</span>
        </p>
        <Input2
          placeholder="업무명을 입력해 주세요"
          className="w-full !min-h-0 h-[53px]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 메모 */}
      <div className="flex w-full flex-col items-start gap-2">
        <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
          메모
        </p>
        <Input2
          placeholder="업무와 관련한 내용을 자유롭게 적어주세요"
          className="w-full !min-h-0 h-[53px]"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      {/* 취소하기 / 업무 추가하기 */}
      <div className="flex shrink-0 items-start gap-3">
        <TextButton type="button" variant="stroke_neutral" className="w-[140px]" onClick={onCancel}>
          취소하기
        </TextButton>
        <TextButton
          type="button"
          variant="fill"
          className="w-[140px]"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          업무 추가하기
        </TextButton>
      </div>
    </form>
  )
}
