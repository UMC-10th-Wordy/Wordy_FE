import { Checkbox } from '@/components/common/Checkbox/Checkbox'
import { TextButton } from '@/components/common/Button/TextButton'
import ProjectTag from './ProjectTag'
import { ResultAttachments } from './ResultAttachments'
import { MemoInput } from './MemoInput'
import type { Task, TaskResultFile, TaskResultImage } from '@/types/todo'

interface TaskResultWriteFormProps {
  task: Task
  writeResult: string
  onWriteResultChange: (value: string) => void
  writeResultFiles: TaskResultFile[]
  writeResultImages: TaskResultImage[]
  onAddResultFiles: (files: File[]) => void
  onAddResultImages: (files: File[]) => void
  onRemoveResultFile: (id: string) => void
  onRemoveResultImage: (id: string) => void
  onCancel: () => void
  onConfirm: () => void
}

/* 업무 결과 새로 작성하기 모드 - 완료 처리 직후, 결과가 아직 없는 업무에서 노출 */
export function TaskResultWriteForm({
  task,
  writeResult,
  onWriteResultChange,
  writeResultFiles,
  writeResultImages,
  onAddResultFiles,
  onAddResultImages,
  onRemoveResultFile,
  onRemoveResultImage,
  onCancel,
  onConfirm,
}: TaskResultWriteFormProps) {
  return (
    <>
      {/* 업무 결과 작성 중 -> 핸들/아이콘 버튼 숨기기 */}
      <div className="flex w-full items-start gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-[9px]">
          <div className="flex shrink-0 items-center gap-[9px]">
            <Checkbox aria-label="업무 완료 여부" checked={task.isCompleted} disabled />
            {task.tag && <ProjectTag label={task.tag.label} color={task.tag.color} />}
          </div>
          <p className="min-w-0 flex-1 [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
            {task.title}
          </p>
        </div>
      </div>

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

      <div className="flex w-full flex-col items-start gap-2">
        <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
          업무 결과
        </p>
        <MemoInput
          className="w-full"
          minHeightClassName="min-h-[120px]"
          placeholder="이 업무가 어떻게 진행되었나요? 결과를 작성해 주세요"
          value={writeResult}
          onChange={(e) => onWriteResultChange(e.target.value)}
        />
      </div>

      <ResultAttachments
        files={writeResultFiles}
        images={writeResultImages}
        editable
        onAddFiles={onAddResultFiles}
        onAddImages={onAddResultImages}
        onRemoveFile={onRemoveResultFile}
        onRemoveImage={onRemoveResultImage}
      />

      <div className="flex shrink-0 items-start gap-3">
        <TextButton type="button" variant="stroke_neutral" className="w-[140px]" onClick={onCancel}>
          취소하기
        </TextButton>
        <TextButton
          type="button"
          variant="fill"
          className="w-[140px]"
          disabled={writeResult.trim() === ''}
          onClick={onConfirm}
        >
          저장하기
        </TextButton>
      </div>
    </>
  )
}
