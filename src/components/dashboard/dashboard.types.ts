export type WeeklyDashboardStatus = 'insufficient' | 'ready' | 'generating' | 'complete'

export interface DiaryEntry {
  id: string
  label: string // 예: '2026년 6월 11일 월요일'
  converted: boolean
}
