export const MOCK_TODAY_TASKS = [
  {
    id: '1',
    project: '온보딩 리뉴얼',
    priority: 'must' as const,
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    id: '2',
    project: '온보딩 리뉴얼',
    priority: 'should' as const,
    title: 'Product Strategy Alignment 회의 준비',
  },
  { id: '3', priority: 'could' as const, title: 'Product Strategy Alignment 회의 준비' },
]

export const MOCK_WEEK_RECORD = [
  'success-dim',
  'fail',
  'success',
  'success',
  'success',
  'success',
  'none',
] as const

export const MOCK_WEEKLY_DAYS = [
  {
    date: 16,
    day: '일',
    tasks: [
      { id: '1', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
      { id: '2', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
      { id: '3', title: 'Product Strategy Alignment 회의 준비', priority: 'could' as const },
    ],
  },
  { date: 17, day: '월', tasks: [] },
  {
    date: 18,
    day: '화',
    tasks: [
      { id: '4', title: 'Product Strategy Alignment 회의 준비', priority: 'must' as const },
      { id: '5', title: 'Product Strategy Alignment 회의 준비', priority: 'could' as const },
    ],
  },
  {
    date: 19,
    day: '수',
    tasks: [
      { id: '6', title: 'Product Strategy Alignment 회의 준비', priority: 'must' as const },
      { id: '7', title: 'Product Strategy Alignment 회의 준비', priority: 'must' as const },
      { id: '8', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
      { id: '9', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
      { id: '10', title: 'Product Strategy Alignment 회의 준비', priority: 'could' as const },
    ],
  },
  {
    date: 20,
    day: '목',
    tasks: [
      { id: '11', title: 'Product Strategy Alignment 회의 준비', priority: 'must' as const },
      { id: '12', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
    ],
  },
  {
    date: 21,
    day: '금',
    tasks: [
      { id: '13', title: 'Product Strategy Alignment 회의 준비', priority: 'should' as const },
    ],
  },
  { date: 22, day: '토', tasks: [] },
]

export const MOCK_RECENT_RECORDS = [
  {
    id: '2026-07-21',
    date: '2026년 7월 21일 화요일',
    totalCount: 6,
    tasks: [
      {
        id: '1',
        project: '온보딩 리뉴얼',
        projectColor: 'green' as const,
        title: 'Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비',
      },
      {
        id: '2',
        project: 'AI 변환 일지 개선',
        projectColor: 'orange' as const,
        title: 'Product Strategy Alignment 회의 준비',
      },
      {
        id: '3',
        project: '디자인 시스템 V2',
        projectColor: 'pink' as const,
        title: 'Product Strategy Alignment 회의 준비',
      },
    ],
  },
  {
    id: '2026-07-20',
    date: '2026년 7월 20일 월요일',
    totalCount: 4,
    tasks: [
      {
        id: '4',
        project: '온보딩 리뉴얼',
        projectColor: 'green' as const,
        title: 'Product Strategy Alignment 회의 준비',
      },
      {
        id: '5',
        project: 'AI 변환 일지 개선',
        projectColor: 'orange' as const,
        title: 'Product Strategy Alignment 회의 준비',
      },
      {
        id: '6',
        project: '디자인 시스템 V2',
        projectColor: 'pink' as const,
        title: 'Product Strategy Alignment 회의 준비',
      },
    ],
  },
]
