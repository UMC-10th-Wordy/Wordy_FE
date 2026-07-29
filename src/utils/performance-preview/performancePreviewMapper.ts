import type {
  CompletePerformancePreviewResult,
  CreatePerformancePreviewPayload,
  PerformanceDetailResult,
  PerformancePreviewCompletedResult,
  PerformancePreviewProjectTagPayload,
  SavePerformancePayload,
} from '@/types/performance'
import type {
  PerformancePreviewResultData,
  PerformanceTaskResult,
} from '@/types/performancePreviewResult'
import { hexToTagColor } from '@/utils/tagMapper'
import type { Task } from '@/types/todo'
import type { TagDto } from '@/types/tag'

type CompletedPerformancePreviewResult =
  PerformancePreviewCompletedResult | CompletePerformancePreviewResult

const mapPerformanceTaskResult = (
  taskPerformance: CompletedPerformancePreviewResult['taskPerformances'][number],
  tasks: Task[],
): PerformanceTaskResult => {
  const task = tasks.find((item) => item.id === taskPerformance.taskId)

  return {
    id: taskPerformance.taskId,
    taskId: taskPerformance.taskId,
    title: task?.title ?? '',
    tag: task?.tag,
    output: taskPerformance.output,
    impact: taskPerformance.impact,
  }
}

export const mapPerformancePreviewResult = (
  result: CompletedPerformancePreviewResult,
  tasks: Task[],
): PerformancePreviewResultData => {
  const completedTasks = tasks.filter((task) => task.isCompleted)
  const incompleteTasks = tasks.filter((task) => !task.isCompleted)

  return {
    totalTaskCount: tasks.length,
    completedTaskCount: completedTasks.length,

    incompleteTasks: incompleteTasks.map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      tag: task.tag,
    })),

    summary: result.summary,
    insight: result.growthInsights.join('\n'),
    nextTasks: result.nextActions,

    taskResults: result.taskPerformances.map((taskPerformance) =>
      mapPerformanceTaskResult(taskPerformance, tasks),
    ),
  }
}

interface MapSavePerformancePayloadParams {
  reflectionSnapshotId: string
  summary: string
  insight: string
}

export const mapSavePerformancePayload = ({
  reflectionSnapshotId,
  summary,
  insight,
}: MapSavePerformancePayloadParams): SavePerformancePayload => {
  const growthInsights = insight
    .split('\n')
    .map((line) => line.trim().replace(/^-\s*/, ''))
    .filter((line) => line.length > 0)

  return {
    reflectionSnapshotId,
    summary: summary.trim(),
    growthInsights,
  }
}

interface MapPerformancePreviewRequestParams {
  tasks: Task[]
  projectTag?: PerformancePreviewProjectTagPayload
}

type PerformancePreviewRequest = Omit<
  CreatePerformancePreviewPayload,
  'dailyEntryId' | 'reflectionContent' | 'userJob' | 'yearsOfService'
>

export const mapPerformancePreviewRequest = ({
  tasks,
  projectTag,
}: MapPerformancePreviewRequestParams): PerformancePreviewRequest => {
  return {
    tasks: tasks.map((task) => ({
      taskId: task.id,
      priority:
        task.priority === 'must'
          ? 'MUST_DO'
          : task.priority === 'should'
            ? 'SHOULD_DO'
            : 'COULD_DO',
      status: task.isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: null,
      title: task.title,
      memo: task.memo ?? '',
      taskResult:
        task.taskResultId && task.result
          ? {
              taskResultId: task.taskResultId,
              content: task.result,
            }
          : null,
    })),
    ...(projectTag ? { projectTag } : {}),
  }
}

export const mapTagDtoToPerformanceProjectTag = (
  tag: TagDto,
): PerformancePreviewProjectTagPayload => {
  return {
    projectTagId: tag.tagId,
    tagName: tag.tagName,
    description: tag.projectName,
    kpis: tag.kpis.map((kpi) => `${kpi.name}: ${kpi.target}`),
    projectPurpose: tag.projectPurpose,
    expectedOutcome: tag.expectedOutcome,
    period: `${tag.expectedStartDate} ~ ${tag.expectedEndDate}`,
  }
}

export const mapPerformanceDetailResult = (
  result: PerformanceDetailResult,
  tasks: Task[],
): PerformancePreviewResultData => {
  const incompleteTasks = tasks.filter((task) => !task.isCompleted)

  return {
    totalTaskCount: result.totalTaskCount,
    completedTaskCount: result.completedTaskCount,

    incompleteTasks: incompleteTasks.map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      tag: task.tag,
    })),

    summary: result.summary,
    insight: result.growthInsights.join('\n'),
    nextTasks: result.nextActions,

    taskResults: result.taskPerformances.map((taskPerformance) => {
      const diaryTask = tasks.find((task) => task.id === taskPerformance.taskId)

      return {
        id: taskPerformance.taskId,
        taskId: taskPerformance.taskId,
        title: taskPerformance.title || diaryTask?.title || '',
        tag: taskPerformance.tag
          ? {
              label: taskPerformance.tag.tagName,
              color: hexToTagColor(taskPerformance.tag.color),
            }
          : diaryTask?.tag,
        output: taskPerformance.output,
        impact: taskPerformance.impact,
      }
    }),
  }
}
