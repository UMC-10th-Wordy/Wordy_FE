import { useState } from 'react'
import type { MouseEvent } from 'react'
import { TaskCardEditForm } from './TaskCardEditForm'
import { TaskResultWriteForm } from './TaskResultWriteForm'
import { TaskCardView } from './TaskCardView'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import type {
  Task,
  TaskDraftValues,
  TaskPriority,
  TaskResultFile,
  TaskResultImage,
  TaskResultValues,
  TaskTag,
} from '@/types/todo'

function createResultFiles(files: File[]): TaskResultFile[] {
  return files.map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    url: URL.createObjectURL(file),
  }))
}

function createResultImages(files: File[]): TaskResultImage[] {
  return files.map((file) => ({
    id: crypto.randomUUID(),
    name: file.name,
    url: URL.createObjectURL(file),
  }))
}

interface TaskCardProps {
  task: Task
  onDelete?: () => void
  onEdit?: (values: TaskDraftValues) => void
  onSaveResult?: (values: TaskResultValues) => void
  onHandleMouseDown?: (event: MouseEvent<HTMLButtonElement>) => void
  onToggleComplete?: () => void
}

export default function TaskCard({
  task,
  onDelete,
  onEdit,
  onSaveResult,
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
  const [draftResult, setDraftResult] = useState(task.result ?? '')
  const [draftResultFiles, setDraftResultFiles] = useState<TaskResultFile[]>(task.resultFiles ?? [])
  const [draftResultImages, setDraftResultImages] = useState<TaskResultImage[]>(
    task.resultImages ?? [],
  )
  const [isAttachmentsDirty, setIsAttachmentsDirty] = useState(false)

  /* 업무 결과 새로 작성하기 */
  const [isWritingResult, setIsWritingResult] = useState(false)
  const [writeResult, setWriteResult] = useState('')
  const [writeResultFiles, setWriteResultFiles] = useState<TaskResultFile[]>([])
  const [writeResultImages, setWriteResultImages] = useState<TaskResultImage[]>([])

  const isDirty =
    draftPriority !== task.priority ||
    (draftTag?.label ?? null) !== (task.tag?.label ?? null) ||
    draftTitle.trim() !== task.title ||
    draftMemo.trim() !== (task.memo ?? '') ||
    (task.isCompleted && draftResult.trim() !== (task.result ?? '')) ||
    (task.isCompleted && isAttachmentsDirty)
  const isDraftValid = draftPriority !== null && draftTitle.trim() !== ''

  const handleStartEdit = () => {
    setDraftPriority(task.priority)
    setDraftTag(task.tag ?? null)
    setDraftTitle(task.title)
    setDraftMemo(task.memo ?? '')
    setDraftResult(task.result ?? '')
    setDraftResultFiles(task.resultFiles ?? [])
    setDraftResultImages(task.resultImages ?? [])
    setIsAttachmentsDirty(false)
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
    if (task.isCompleted) {
      onSaveResult?.({
        result: draftResult.trim(),
        resultFiles: draftResultFiles,
        resultImages: draftResultImages,
      })
    }
    setIsEditing(false)
  }

  const handleStartWriteResult = () => {
    setWriteResult('')
    setWriteResultFiles([])
    setWriteResultImages([])
    setIsWritingResult(true)
  }

  const handleCancelWriteResult = () => {
    setIsWritingResult(false)
  }

  const handleConfirmWriteResult = () => {
    if (writeResult.trim() === '') return
    onSaveResult?.({
      result: writeResult.trim(),
      resultFiles: writeResultFiles,
      resultImages: writeResultImages,
    })
    setIsWritingResult(false)
  }

  return (
    <div className="relative flex w-full flex-col items-end gap-4 rounded-lg border border-(--color-border-brand-subtle) bg-(--color-bg-default) p-5 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
      {isEditing ? (
        <TaskCardEditForm
          task={task}
          draftPriority={draftPriority}
          onDraftPriorityChange={setDraftPriority}
          draftTag={draftTag}
          onDraftTagChange={setDraftTag}
          draftTitle={draftTitle}
          onDraftTitleChange={setDraftTitle}
          draftMemo={draftMemo}
          onDraftMemoChange={setDraftMemo}
          draftResult={draftResult}
          onDraftResultChange={setDraftResult}
          draftResultFiles={draftResultFiles}
          draftResultImages={draftResultImages}
          onAddResultFiles={(files) => {
            setDraftResultFiles((prev) => [...prev, ...createResultFiles(files)])
            setIsAttachmentsDirty(true)
          }}
          onAddResultImages={(files) => {
            setDraftResultImages((prev) => [...prev, ...createResultImages(files)])
            setIsAttachmentsDirty(true)
          }}
          onRemoveResultFile={(id) => {
            setDraftResultFiles((prev) => prev.filter((file) => file.id !== id))
            setIsAttachmentsDirty(true)
          }}
          onRemoveResultImage={(id) => {
            setDraftResultImages((prev) => prev.filter((image) => image.id !== id))
            setIsAttachmentsDirty(true)
          }}
          isDirty={isDirty}
          isDraftValid={isDraftValid}
          onCancel={handleCancelEdit}
          onConfirm={handleConfirmEdit}
        />
      ) : isWritingResult ? (
        <TaskResultWriteForm
          task={task}
          writeResult={writeResult}
          onWriteResultChange={setWriteResult}
          writeResultFiles={writeResultFiles}
          writeResultImages={writeResultImages}
          onAddResultFiles={(files) =>
            setWriteResultFiles((prev) => [...prev, ...createResultFiles(files)])
          }
          onAddResultImages={(files) =>
            setWriteResultImages((prev) => [...prev, ...createResultImages(files)])
          }
          onRemoveResultFile={(id) =>
            setWriteResultFiles((prev) => prev.filter((file) => file.id !== id))
          }
          onRemoveResultImage={(id) =>
            setWriteResultImages((prev) => prev.filter((image) => image.id !== id))
          }
          onCancel={handleCancelWriteResult}
          onConfirm={handleConfirmWriteResult}
        />
      ) : (
        <TaskCardView
          task={task}
          isExpanded={isExpanded}
          onToggleExpanded={() => setIsExpanded((prev) => !prev)}
          onHandleMouseDown={onHandleMouseDown}
          onToggleComplete={onToggleComplete}
          onStartEdit={handleStartEdit}
          onDeleteClick={() => setIsDeleteConfirmOpen(true)}
          onStartWriteResult={handleStartWriteResult}
        />
      )}

      {isDeleteConfirmOpen && (
        <DeleteConfirmDialog
          onCancel={() => setIsDeleteConfirmOpen(false)}
          onConfirm={() => {
            setIsDeleteConfirmOpen(false)
            onDelete?.()
          }}
        />
      )}
    </div>
  )
}
