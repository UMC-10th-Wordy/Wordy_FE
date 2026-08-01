import type { MonthlyDiaryRecord } from '@/types/diaryList'

export const DIARY_MONTHLY_RECORDS: MonthlyDiaryRecord[] = [
  {
    id: '2026-08',
    year: 2026,
    month: 8,
    diaryDayCount: 5,
    topProjectTags: [
      {
        id: 'advertisement',
        label: '광고',
        color: 'blue',
      },
      {
        id: 'meeting',
        label: '회의',
        color: 'green',
      },
      {
        id: 'design',
        label: '디자인',
        color: 'pink',
      },
    ],
    monthlySummary: '협업 및 기획 업무 비중이 늘며, 산출물 정리가 활발했던 달이에요.',
  },
  {
    id: '2026-07',
    year: 2026,
    month: 7,
    diaryDayCount: 3,
    topProjectTags: [
      {
        id: 'onboarding',
        label: '온보딩',
        color: 'blue',
      },
      {
        id: 'research',
        label: '리서치',
        color: 'blue',
      },
      {
        id: 'qa',
        label: 'QA',
        color: 'pink',
      },
    ],
    monthlySummary: '온보딩 리뉴얼 리서치와 QA 사이클이 중심이 된 달이에요.',
  },
  {
    id: '2026-06',
    year: 2026,
    month: 6,
    diaryDayCount: 2,
    topProjectTags: [
      {
        id: 'planning',
        label: '기획',
        color: 'green',
      },
      {
        id: 'analysis',
        label: '분석',
        color: 'orange',
      },
      {
        id: 'collaboration',
        label: '협업',
        color: 'pink',
      },
    ],
    monthlySummary: '분기 시작 기획과 데이터 분석 업무가 집중된 달이에요.',
  },
  {
    id: '2026-05',
    year: 2026,
    month: 5,
    diaryDayCount: 2,
    topProjectTags: [
      {
        id: 'documentation',
        label: '문서화',
        color: 'blue',
      },
      {
        id: 'meeting',
        label: '회의',
        color: 'green',
      },
    ],
    monthlySummary: '내부 정비 문서가 꾸준히 누적된 달이에요.',
  },
  {
    id: '2026-04',
    year: 2026,
    month: 4,
    diaryDayCount: 2,
    topProjectTags: [
      {
        id: 'planning',
        label: '기획',
        color: 'green',
      },
      {
        id: 'design',
        label: '디자인',
        color: 'pink',
      },
    ],
    monthlySummary: '신규 프로젝트의 방향과 주요 사용자 흐름을 구체화한 달이에요.',
  },
  {
    id: '2026-03',
    year: 2026,
    month: 3,
    diaryDayCount: 1,
    topProjectTags: [
      {
        id: 'research',
        label: '리서치',
        color: 'blue',
      },
      {
        id: 'analysis',
        label: '분석',
        color: 'orange',
      },
    ],
    monthlySummary: '시장 조사와 데이터 분석을 바탕으로 서비스 방향을 정리한 달이에요.',
  },
  {
    id: '2026-02',
    year: 2026,
    month: 2,
    diaryDayCount: 1,
    topProjectTags: [
      {
        id: 'meeting',
        label: '회의',
        color: 'green',
      },
    ],
    monthlySummary: '팀 협업 기준과 프로젝트 진행 방식을 맞춰간 달이에요.',
  },
  {
    id: '2026-01',
    year: 2026,
    month: 1,
    diaryDayCount: 1,
    topProjectTags: [
      {
        id: 'planning',
        label: '기획',
        color: 'green',
      },
    ],
    monthlySummary: '한 해의 목표를 세우고 주요 업무 계획을 구체화한 달이에요.',
  },
]

export const EMPTY_DIARY_MONTHLY_RECORDS: MonthlyDiaryRecord[] = []
