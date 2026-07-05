import type { ProjectTagColor } from '@/components/todo/ProjectTag'

export type TaskPriority = 'must' | 'should' | 'could'

/* 업무 카드에 표시되는 프로젝트 태그 */
export interface TaskTag {
  label: string
  color: ProjectTagColor
}

/* 업무 항목 (TaskCard가 다루는 데이터) */
export interface Task {
  id: string
  title: string
  memo?: string
  tag?: TaskTag
  priority: TaskPriority
  isCompleted: boolean
}

/* 업무 추가 폼 입력 값 (TaskForm이 다루는 데이터) */
export interface TaskFormValues {
  priority: TaskPriority | null
  projectTagId: string | null
  title: string
  memo: string
}

/* 오늘의 업무 완료/미완료 탭 상태 */
export type TodoFilter = 'completed' | 'incomplete'

/* 완료/미완료 탭에 표시되는 건수 */
export interface TodoFilterCounts {
  completed: number
  incomplete: number
}

/* 오늘의 회고 입력 값 */
export interface RetrospectiveValues {
  content: string
}
