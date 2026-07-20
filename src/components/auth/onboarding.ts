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
