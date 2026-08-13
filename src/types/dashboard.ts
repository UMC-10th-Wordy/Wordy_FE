export type WeeklyDashboardStatus = 'insufficient' | 'ready' | 'generating' | 'complete'

export interface DiaryEntry {
  id: string
  label: string
  converted?: boolean
  date?: string
}
export interface EligibilityEntryDto {
  dailyEntryId: string
  entryDate: string
}

export interface EligibilityDto {
  eligible: boolean
  journalDays: number
  requiredDays: number
  weekStart: string
  weekEnd: string
  entries: EligibilityEntryDto[]
}

export interface DashboardListItemDto {
  dashboardId: string
  startDate: string
  endDate: string
  summary: string
  createdAt: string
}

export interface DashboardKpiDto {
  kpiName: string
  progress: string
  tagId?: string
  relatedAchievement?: string
}

export interface TagAnalysisDto {
  goal: string
  expectedOutcome: string
  taskCount: number
  periodStart: string
  periodEnd: string
  achievementStatus: string
  tagId?: string
  tagName?: string
  color?: string
}

export interface WeeklyReflectionDto {
  weeklyReflectionId: string
  workSummary: string
  resourcesUsed: string
  learning: string
  createdAt: string
  dashboardId: string
}

export interface PerformanceItemDto {
  output: string
  impact: string
  dailyEntryId?: string
}

export interface PerformanceDto {
  achievementRate: number
  summary: string
  growthInsight: string
  nextAction: string
  items: PerformanceItemDto[]
  dailyEntryId?: string
}

export interface DashboardDetailDto {
  dashboardId: string
  startDate: string
  endDate: string
  summary: string
  journalDays: number
  performanceCount: number
  tagCount: number
  insights: { journalDays: number; performanceCount: number; tagCount: number }[]
  kpis: DashboardKpiDto[]
  tagAnalyses: TagAnalysisDto[]
  weeklyReflections: WeeklyReflectionDto[]
  performances: PerformanceDto[]
}

export interface CreateDashboardPayload {
  startDate: string
  endDate: string
}

export interface CreateReflectionPayload {
  workSummary: string
  resourcesUsed: string
  learning: string
}

export interface UpdateReflectionPayload {
  workSummary?: string
  resourcesUsed?: string
  learning?: string
}

export interface MonthlyWeeklyDashboardDto {
  dashboardId: string
  startDate: string
  endDate: string
  summary: string
}

export interface MonthlyEligibilityDto {
  eligible: boolean
  weeklyDashboardCount: number
  requiredCount: number
  monthStart: string
  monthEnd: string
  weeklyDashboards: MonthlyWeeklyDashboardDto[]
}

export interface MonthlyReflectionResultDto {
  weeklyReflectionId: string
  workSummary: string
  resourcesUsed: string
  learning: string
  createdAt: string
}
export interface MonthlyWeeklyDashboardDto {
  dashboardId: string
  startDate: string
  endDate: string
  summary: string
}

export interface MonthlyEligibilityDto {
  eligible: boolean
  weeklyDashboardCount: number
  requiredCount: number
  monthStart: string
  monthEnd: string
  weeklyDashboards: MonthlyWeeklyDashboardDto[]
}

export interface MonthlyReflectionResultDto {
  weeklyReflectionId: string
  workSummary: string
  resourcesUsed: string
  learning: string
  createdAt: string
}

export interface AiTagAnalysisDto {
  tagName: string
  objective: string
  expectedOutcome: string
  achievementStatus: string
  insight: string
}

export interface AiDashboardResultDto {
  dashboardId: string
  startDate: string
  endDate: string
  summary: string
  journalDays: number
  performanceCount: number
  tagCount: number
  kpis: { kpiName: string; progress: string }[]
  tagAnalyses: AiTagAnalysisDto[]
}

export interface DraftDto {
  reflectionDraftId: string
  type: 'WEEKLY' | 'MONTHLY'
  workSummary: string
  resourcesUsed: string
  learning: string
  taskPlans: { content: string; expectedTime: string }[]
  updatedAt: string
}
