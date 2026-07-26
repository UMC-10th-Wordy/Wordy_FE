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
}

export interface TagAnalysisDto {
  goal: string
  expectedOutcome: string
  taskCount: number
  periodStart: string
  periodEnd: string
  achievementStatus: string
}

export interface WeeklyReflectionDto {
  reflectionId: string
  workSummary: string
  resourcesUsed: string
  learning: string
}

export interface PerformanceItemDto {
  output: string
  impact: string
}

export interface PerformanceDto {
  achievementRate: number
  summary: string
  growthInsight: string
  nextAction: string
  items: PerformanceItemDto[]
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
