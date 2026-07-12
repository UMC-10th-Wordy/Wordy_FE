import type { ProjectTagColor } from '@/components/todo/ProjectTag'

export type TaskPriority = 'must' | 'should' | 'could'

/* 업무 카드에 표시되는 프로젝트 태그 */
export interface TaskTag {
  label: string
  color: ProjectTagColor
}

/* 업무 결과에 첨부된 파일 (url은 미리보기/다운로드용 objectURL) */
export interface TaskResultFile {
  id: string
  name: string
  url: string
}

/* 업무 결과에 첨부된 이미지 */
export interface TaskResultImage {
  id: string
  name: string
  url: string
}

/* 업무 항목 (TaskCard가 다루는 데이터) */
export interface Task {
  id: string
  title: string
  memo?: string
  tag?: TaskTag
  priority: TaskPriority
  isCompleted: boolean
  /* 완료된 업무에 기록된 업무 결과 / 없으면 버튼 */
  result?: string
  resultFiles?: TaskResultFile[]
  resultImages?: TaskResultImage[]
}

/* 업무 결과 작성/수정 시 저장되는 값 */
export interface TaskResultValues {
  result: string
  resultFiles: TaskResultFile[]
  resultImages: TaskResultImage[]
}

/* 업무 추가/수정 시 실제로 저장되는 값 (TaskForm, TaskCard 수정 모드가 공통으로 사용) */
export interface TaskDraftValues {
  priority: TaskPriority
  tag?: TaskTag
  title: string
  memo?: string
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
