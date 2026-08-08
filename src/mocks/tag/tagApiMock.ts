import type { ProjectTagColor } from '@/components/todo/ProjectTag'
import type { TagDto } from '@/types/tag'
import { TAG_COLOR_HEX } from '@/utils/tagMapper'

const TAG_SEEDS: { label: string; color: ProjectTagColor }[] = [
  { label: '온보딩 리뉴얼', color: 'green' },
  { label: '온보딩 A/B 테스트', color: 'blue' },
  { label: '온보딩 튜토리얼 개선', color: 'navy' },
  { label: '온보딩 이메일 캠페인', color: 'orange' },
  { label: '온보딩 인앱 가이드', color: 'yellow' },
  { label: '온보딩 분석 대시보드', color: 'brown' },
  { label: '온보딩 체크리스트 UI', color: 'red' },
  { label: '온보딩 영상 제작', color: 'pink' },
  { label: '온보딩 설문 자동화', color: 'green' },
  { label: '온보딩 FAQ 페이지', color: 'navy' },
  { label: '온보딩 성과 리포트', color: 'blue' },
  { label: '온보딩 모바일 최적화', color: 'orange' },
  { label: '디자인 시스템 V2', color: 'pink' },
  { label: '리서치', color: 'navy' },
  { label: '광고', color: 'blue' },
]

const BASE_CREATED_AT = '2026-06-01T09:00:00.000Z'
const BASE_UPDATED_AT = '2026-07-01T09:00:00.000Z'

export const INITIAL_TAG_MOCKS: TagDto[] = TAG_SEEDS.map((seed, index) => ({
  tagId: `mock-tag-${index}`,
  tagName: seed.label,
  color: TAG_COLOR_HEX[seed.color],
  projectName: seed.label,
  projectPurpose: `${seed.label} 관련 업무 진행`,
  expectedOutcome: `${seed.label} 목표 달성`,
  expectedStartDate: '2026-06-01T00:00:00.000Z',
  expectedEndDate: '2026-07-31T00:00:00.000Z',
  kpis: [{ name: '진행률', target: '100%' }],
  createdAt: BASE_CREATED_AT,
  updatedAt: BASE_UPDATED_AT,
  deletedAt: null,
  userId: 'mock-user',
}))
