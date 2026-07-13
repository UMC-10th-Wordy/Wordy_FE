import type { DragOverInfo } from '@/hooks/useDragReorder'
import type { Task, TaskPriority } from '@/types/todo'

export function splitIntoColumns<T>(items: T[]): [T[], T[]] {
  const left: T[] = []
  const right: T[] = []
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      left.push(item)
    } else {
      right.push(item)
    }
  })
  return [left, right]
}

export type PreviewEntry = { kind: 'task'; task: Task } | { kind: 'placeholder' }

/* 드래그 중인 항목을 반영한 섹션 미리보기 배열 계산 (드롭 위치에 placeholder 삽입) */
export function buildSectionPreview(
  sectionTasks: Task[],
  sectionKey: TaskPriority,
  draggingTask: Task | null,
  overInfo: DragOverInfo,
): PreviewEntry[] {
  if (!draggingTask) {
    return sectionTasks.map((task) => ({ kind: 'task', task }))
  }

  const entries: PreviewEntry[] = sectionTasks
    .filter((task) => task.id !== draggingTask.id)
    .map((task) => ({ kind: 'task', task }))

  if (overInfo.sectionKey !== sectionKey) {
    return entries
  }

  if (overInfo.itemId) {
    const targetIndex = entries.findIndex(
      (entry) => entry.kind === 'task' && entry.task.id === overInfo.itemId,
    )
    if (targetIndex === -1) {
      entries.push({ kind: 'placeholder' })
    } else {
      entries.splice(overInfo.insertAfter ? targetIndex + 1 : targetIndex, 0, {
        kind: 'placeholder',
      })
    }
  } else {
    entries.push({ kind: 'placeholder' })
  }

  return entries
}
