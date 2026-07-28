import type { JobRole, YearsOfService } from '@/types/api/user'

export const CAREER_OPTIONS = ['1년 미만', '1-3년', '3-5년', '5-10년', '10년 초과'] as const
export type CareerOption = (typeof CAREER_OPTIONS)[number]

export const JOB_OPTIONS = [
  '서비스·제품 기획',
  '프론트엔드·백엔드 개발',
  '디자인',
  '마케팅·세일즈',
  '데이터 분석',
  '고객 지원·CS',
  '인사·HR',
  '재무·회계',
  '교육·연구',
  '개인·프리랜서',
  '학생',
  '기타',
] as const
export type JobOption = (typeof JOB_OPTIONS)[number]

export const CAREER_TO_YEARS_OF_SERVICE: Record<CareerOption, YearsOfService> = {
  '1년 미만': 'UNDER_1',
  '1-3년': 'ONE_TO_3',
  '3-5년': 'THREE_TO_5',
  '5-10년': 'FIVE_TO_10',
  '10년 초과': 'OVER_10',
}

export const JOB_TO_JOB_ROLE: Record<JobOption, JobRole> = {
  '서비스·제품 기획': 'PRODUCT_PLANNING',
  '프론트엔드·백엔드 개발': 'DEVELOPMENT',
  디자인: 'DESIGN',
  '마케팅·세일즈': 'MARKETING_SALES',
  '데이터 분석': 'DATA_ANALYSIS',
  '고객 지원·CS': 'CUSTOMER_SUPPORT',
  '인사·HR': 'HR',
  '재무·회계': 'FINANCE_ACCOUNTING',
  '교육·연구': 'EDUCATION_RESEARCH',
  '개인·프리랜서': 'FREELANCER',
  학생: 'STUDENT',
  기타: 'ETC',
}

export const YEARS_OF_SERVICE_TO_CAREER = Object.fromEntries(
  Object.entries(CAREER_TO_YEARS_OF_SERVICE).map(([career, years]) => [years, career]),
) as Record<YearsOfService, CareerOption>

export const JOB_ROLE_TO_JOB = Object.fromEntries(
  Object.entries(JOB_TO_JOB_ROLE).map(([job, role]) => [role, job]),
) as Record<JobRole, JobOption>
