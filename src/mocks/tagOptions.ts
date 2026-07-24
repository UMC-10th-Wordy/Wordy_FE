import type { TaskTag } from '@/types/todo'

/* 더미 데이터 */
export const INITIAL_TAG_OPTIONS: TaskTag[] = [
  {
    label: '온보딩 리뉴얼',
    color: 'green',
    meta: {
      projectName: '온보딩 리뉴얼',
      purpose: '신규 사용자 활성화 흐름 개선',
      expectedOutcome: '첫 주 핵심 기능 도달률 상승',
      startDate: '2026.06.01',
      endDate: '2026.07.31',
      kpis: ['온보딩 완료율', '첫 주 핵심 기능 도달률'],
    },
  },
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
