import type { TaskDto, TaskTagSummaryDto } from '@/types/taskApi'
import { INITIAL_TAG_MOCKS } from './tagApiMock'
import { toDateKey } from '@/utils/calendar'

const TODAY = toDateKey(new Date())
const MEMO_SAMPLE = '지난 분기 OKR 정리 / 디자인 시스템 V_2 진행 현황 슬라이드 1장'
const BASE_CREATED_AT = '2026-07-20T09:00:00.000Z'

function tagSummary(tagId: string): TaskTagSummaryDto {
  const tag = INITIAL_TAG_MOCKS.find((t) => t.tagId === tagId)
  if (!tag) throw new Error(`Unknown mock tagId: ${tagId}`)
  return {
    tagId: tag.tagId,
    tagName: tag.tagName,
    color: tag.color,
    projectName: tag.projectName,
  }
}

const TASK_SEEDS: {
  taskId: string
  priority: TaskDto['priority']
  memo: string
  tagId: string
}[] = [
  { taskId: 'mock-task-0', priority: 'SHOULD_DO', memo: '', tagId: 'mock-tag-0' },
  { taskId: 'mock-task-1', priority: 'COULD_DO', memo: MEMO_SAMPLE, tagId: 'mock-tag-12' },
  { taskId: 'mock-task-2', priority: 'COULD_DO', memo: MEMO_SAMPLE, tagId: 'mock-tag-13' },
  { taskId: 'mock-task-3', priority: 'COULD_DO', memo: MEMO_SAMPLE, tagId: 'mock-tag-14' },
]

export const INITIAL_TASK_MOCKS: TaskDto[] = TASK_SEEDS.map((seed) => ({
  taskId: seed.taskId,
  title: 'Product Strategy Alignment 회의 준비',
  priority: seed.priority,
  memo: seed.memo,
  status: 'IN_PROGRESS',
  taskDate: `${TODAY}T00:00:00.000Z`,
  completedAt: null,
  createdAt: BASE_CREATED_AT,
  updatedAt: BASE_CREATED_AT,
  deletedAt: null,
  userId: 'mock-user',
  tagId: seed.tagId,
  tag: tagSummary(seed.tagId),
}))
