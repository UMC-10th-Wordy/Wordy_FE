import { Checkbox } from '@/components/common/Checkbox/Checkbox'
import { TextButton } from '@/components/common/Button/TextButton'
import PrioritySelect from './PrioritySelect'
import TagSelect from './TagSelect'
import { ResultAttachments } from './ResultAttachments'
import { MemoInput } from './MemoInput'
import type { Task, TaskPriority, TaskResultFile, TaskResultImage, TaskTag } from '@/types/todo'

interface TaskCardEditFormProps {
  task: Task
  draftPriority: TaskPriority | null
  onDraftPriorityChange: (value: TaskPriority | null) => void
  draftTag: TaskTag | null
  onDraftTagChange: (value: TaskTag | null) => void
  draftTitle: string
  onDraftTitleChange: (value: string) => void
  draftMemo: string
  onDraftMemoChange: (value: string) => void
  draftResult: string
  onDraftResultChange: (value: string) => void
  draftResultFiles: TaskResultFile[]
  draftResultImages: TaskResultImage[]
  onAddResultFiles: (files: File[]) => void
  onAddResultImages: (files: File[]) => void
  onRemoveResultFile: (id: string) => void
  onRemoveResultImage: (id: string) => void
  isDirty: boolean
  isDraftValid: boolean
  onCancel: () => void
  onConfirm: () => void
}

/* 업무 카드 수정 모드 - 업무명/메모/(완료된 경우) 업무 결과를 함께 수정 */
export function TaskCardEditForm({
  task,
  draftPriority,
  onDraftPriorityChange,
  draftTag,
  onDraftTagChange,
  draftTitle,
  onDraftTitleChange,
  draftMemo,
  onDraftMemoChange,
  draftResult,
  onDraftResultChange,
  draftResultFiles,
  draftResultImages,
  onAddResultFiles,
  onAddResultImages,
  onRemoveResultFile,
  onRemoveResultImage,
  isDirty,
  isDraftValid,
  onCancel,
  onConfirm,
}: TaskCardEditFormProps) {
  return (
    <>
      {/* 수정 중 -> 버튼 숨기기, 비활성화 */}
      <div className="flex w-full items-center gap-2">
        <Checkbox aria-label="업무 완료 여부" checked={task.isCompleted} disabled />
        <PrioritySelect value={draftPriority} onChange={onDraftPriorityChange} />
        <TagSelect value={draftTag} onChange={onDraftTagChange} />
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
          업무명 <span className="text-(--color-text-required)">*</span>
        </p>
        <MemoInput
          className="w-full"
          value={draftTitle}
          onChange={(e) => onDraftTitleChange(e.target.value)}
        />
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
          메모
        </p>
        <MemoInput
          className="w-full"
          value={draftMemo}
          onChange={(e) => onDraftMemoChange(e.target.value)}
        />
      </div>

      {task.isCompleted && (
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full flex-col items-start gap-2">
            <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
              업무 결과
            </p>
            <MemoInput
              className="w-full"
              minHeightClassName="min-h-[120px]"
              value={draftResult}
              onChange={(e) => onDraftResultChange(e.target.value)}
            />
          </div>
          <ResultAttachments
            files={draftResultFiles}
            images={draftResultImages}
            editable
            onAddFiles={onAddResultFiles}
            onAddImages={onAddResultImages}
            onRemoveFile={onRemoveResultFile}
            onRemoveImage={onRemoveResultImage}
          />
        </div>
      )}

      <div className="flex shrink-0 items-start gap-3">
        <TextButton type="button" variant="stroke_neutral" className="w-[140px]" onClick={onCancel}>
          취소하기
        </TextButton>
        <TextButton
          type="button"
          variant="fill"
          className="w-[140px]"
          disabled={!isDirty || !isDraftValid}
          onClick={onConfirm}
        >
          수정하기
        </TextButton>
      </div>
    </>
  )
}
