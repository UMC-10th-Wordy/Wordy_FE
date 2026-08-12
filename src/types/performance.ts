import type { ApiTaskPriority, ApiTaskStatus } from '@/types/task'
import type { JobRole, YearsOfService } from '@/types/user'

/* 공통 요청 객체 */

export interface PerformancePreviewTaskResultPayload {
  taskResultId: string
  content: string
}

export interface PerformancePreviewTaskPayload {
  taskId: string
  priority: ApiTaskPriority
  status: ApiTaskStatus
  completedAt?: string
  title: string
  memo?: string
  taskResult?: PerformancePreviewTaskResultPayload
}

export interface PerformancePreviewProjectTagPayload {
  projectTagId: string
  tagName: string
  description: string
  kpis: string[]
  projectPurpose: string
  expectedOutcome: string
  period?: string
}

export interface PerformanceTaskPerformance {
  taskId: string
  output: string[]
  impact: string[]
}

/* AI 성과 미리보기 생성 */
// POST /ai/performance-preview

export interface CreatePerformancePreviewPayload {
  dailyEntryId: string
  tasks: PerformancePreviewTaskPayload[]
  reflectionContent: string
  projectTag?: PerformancePreviewProjectTagPayload
  userJob: JobRole
  yearsOfService: YearsOfService
}

export interface PerformanceSupplementQuestion {
  aiQuestionId: string
  taskId: string
  question: string
  reason: string
}

export interface PerformancePreviewProcessingResult {
  status: 'PROCESSING'
  reflectionSnapshotId: string
}

export interface PerformancePreviewQuestionRequiredResult {
  status: 'QUESTION_REQUIRED'
  reflectionSnapshotId: string
  supplementQuestions: PerformanceSupplementQuestion[]
}

export interface PerformancePreviewCompletedResult {
  status: 'COMPLETED'
  summary: string
  growthInsights: string[]
  nextActions: string[]
  taskPerformances: PerformanceTaskPerformance[]
  reflectionSnapshotId: string
}

export type CreatePerformancePreviewResult =
  | PerformancePreviewQuestionRequiredResult
  | PerformancePreviewProcessingResult
  | PerformancePreviewCompletedResult

export type CreatePerformancePreviewResponse = CreatePerformancePreviewResult

/* 보충 질문 답변 후 성과 미리보기 생성 완료 */
// POST /ai/performance-preview/complete

export type PerformanceSupplementAnswerStatus = 'ANSWERED' | 'SKIPPED'

export interface PerformanceSupplementAnswer {
  aiQuestionId: string
  question: string
  answer: string
  status: PerformanceSupplementAnswerStatus
}

export interface CompletePerformancePreviewPayload {
  reflectionSnapshotId: string
  originalRequest: CreatePerformancePreviewPayload
  answers: PerformanceSupplementAnswer[]
}

export interface CompletePerformancePreviewProcessingResult {
  status: 'PROCESSING'
  reflectionSnapshotId: string
}

export interface CompletePerformancePreviewResult {
  status: 'COMPLETED'
  summary: string
  growthInsights: string[]
  nextActions: string[]
  taskPerformances: PerformanceTaskPerformance[]
  reflectionSnapshotId: string
}

export type CompletePerformancePreviewResponse =
  CompletePerformancePreviewProcessingResult | CompletePerformancePreviewResult

/* 업무 성과 최종 저장 */
// POST /performances

export interface SavePerformancePayload {
  reflectionSnapshotId: string
  summary: string
  growthInsights: string[]
}

export interface SavePerformanceResult {
  dailyPerformanceId: string
}

export type SavePerformanceResponse = SavePerformanceResult

/* 저장된 업무 성과 상세 조회 */
// GET /performances/{dailyPerformanceId}

export interface PerformanceDetailTag {
  tagName: string
  color: string
}

export interface PerformanceDetailIncompleteTask {
  taskId: string
  tag: PerformanceDetailTag
  title: string
}

export interface PerformanceDetailTaskPerformance {
  taskId: string
  tag: PerformanceDetailTag
  title: string
  output: string[]
  impact: string[]
  message?: string
}

export interface PerformanceDetailResult {
  dailyPerformanceId: string
  achievementRate: number
  totalTaskCount: number
  completedTaskCount: number
  incompleteTasks: PerformanceDetailIncompleteTask[]
  summary: string
  growthInsights: string[]
  nextActions: string[]
  taskPerformances: PerformanceDetailTaskPerformance[]
  createdAt: string
}

export type PerformanceDetailResponse = PerformanceDetailResult

/* 날짜별 저장된 업무 성과 조회 */
// GET /performances?date=YYYY-MM-DD

export interface PerformanceListResult {
  exists: boolean
  performance: PerformanceDetailResult | null
}

export type PerformanceListResponse = PerformanceListResult

/* 저장된 업무 성과 수정 */
// PATCH /performances/{dailyPerformanceId}

export interface UpdatePerformancePayload {
  summary: string
  growthInsights: string[]
}

export interface UpdatePerformanceResult {
  dailyPerformanceId: string
}

export type UpdatePerformanceResponse = UpdatePerformanceResult

/* 성과 미리보기 상태 조회 */
// GET /performances/preview/{reflectionSnapshotId}

export type PerformancePreviewPollingStatus = 'PROCESSING' | 'TEMP' | 'FAILED'

export interface PerformancePreviewPromptBResult {
  summary: string
  growthInsights: string[]
  nextActions: string[]
  taskPerformances: PerformanceTaskPerformance[]
}

export interface PerformancePreviewPollingResult {
  reflectionSnapshotId: string
  status: PerformancePreviewPollingStatus
  promptBResult: PerformancePreviewPromptBResult | null
  tasks: PerformancePreviewTaskPayload[]
}

export type PerformancePreviewPollingResponse = PerformancePreviewPollingResult
