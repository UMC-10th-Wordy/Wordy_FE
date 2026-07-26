import type {
  DailyEntriesSummaryResponse,
  DailyEntrySearchItem,
  MonthlyDailyEntriesDetailResponse,
  MonthlyDailyEntriesResponse,
} from '@/types/api/diaryList'

export const DAILY_ENTRIES_SUMMARY_RESPONSE_MOCK = {
  success: true,
  code: 'S200',
  message: '조회에 성공했습니다.',
  result: {
    monthlyCount: {
      count: 3,
      diffFromLastMonth: 1,
    },
    streak: {
      currentStreak: 12,
      maxStreak: 21,
    },
    topCategory: {
      tagName: '온보딩 리뉴얼',
      color: '#14c369',
      percentage: 38,
    },
  },
} satisfies DailyEntriesSummaryResponse

export const MONTHLY_DAILY_ENTRIES_RESPONSE_MOCK = {
  success: true,
  code: 'S200',
  message: '조회에 성공했습니다.',
  result: [
    {
      yearMonth: '2026-07',
      year: 2026,
      month: 7,
      totalDays: 3,
      tags: [
        {
          tagName: '온보딩',
          color: '#2d96ff',
        },
        {
          tagName: '리서치',
          color: '#5d5df1',
        },
        {
          tagName: 'QA',
          color: '#ff5fd7',
        },
      ],
      summary: '온보딩 리뉴얼 리서치와 QA 사이클이 중심이 된 달이에요.',
    },
    {
      yearMonth: '2026-06',
      year: 2026,
      month: 6,
      totalDays: 2,
      tags: [
        {
          tagName: '기획',
          color: '#14c369',
        },
        {
          tagName: '분석',
          color: '#ff6d38',
        },
        {
          tagName: '협업',
          color: '#ff5fd7',
        },
      ],
      summary: '분기 시작 기획과 데이터 분석 업무가 집중된 달이에요.',
    },
    {
      yearMonth: '2026-05',
      year: 2026,
      month: 5,
      totalDays: 2,
      tags: [
        {
          tagName: '문서화',
          color: '#2d96ff',
        },
        {
          tagName: '회의',
          color: '#14c369',
        },
      ],
      summary: '내부 정비 문서가 꾸준히 누적된 달이에요.',
    },
    {
      yearMonth: '2026-04',
      year: 2026,
      month: 4,
      totalDays: 2,
      tags: [
        {
          tagName: '기획',
          color: '#14c369',
        },
        {
          tagName: '디자인',
          color: '#ff5fd7',
        },
      ],
      summary: '신규 프로젝트의 방향과 주요 사용자 흐름을 구체화한 달이에요.',
    },
    {
      yearMonth: '2026-03',
      year: 2026,
      month: 3,
      totalDays: 1,
      tags: [
        {
          tagName: '리서치',
          color: '#5d5df1',
        },
        {
          tagName: '분석',
          color: '#ff6d38',
        },
      ],
      summary: '시장 조사와 데이터 분석을 바탕으로 서비스 방향을 정리한 달이에요.',
    },
    {
      yearMonth: '2026-02',
      year: 2026,
      month: 2,
      totalDays: 1,
      tags: [
        {
          tagName: '회의',
          color: '#14c369',
        },
      ],
      summary: '팀 협업 기준과 프로젝트 진행 방식을 맞춰간 달이에요.',
    },
    {
      yearMonth: '2026-01',
      year: 2026,
      month: 1,
      totalDays: 1,
      tags: [
        {
          tagName: '기획',
          color: '#14c369',
        },
      ],
      summary: '한 해의 목표를 세우고 주요 업무 계획을 구체화한 달이에요.',
    },
  ],
} satisfies MonthlyDailyEntriesResponse

export const MONTHLY_DAILY_ENTRY_RESPONSE_MOCK_MAP: Record<
  string,
  MonthlyDailyEntriesDetailResponse
> = {
  '2026-07': {
    success: true,
    code: 'S200',
    message: '조회에 성공했습니다.',
    result: [
      {
        dailyEntryId: 'diary-2026-07-28',
        entryDate: '2026-07-28',
        day: 28,
        tags: [
          {
            tagName: '온보딩',
            color: '#2d96ff',
          },
        ],
        mainTaskTitle: '온보딩 사용자 흐름 정리',
        extraTaskCount: 4,
        summary: '신규 사용자의 주요 이탈 구간을 기준으로 진입 흐름을 개선했어요.',
      },
      {
        dailyEntryId: 'diary-2026-07-24',
        entryDate: '2026-07-24',
        day: 24,
        tags: [
          {
            tagName: '리서치',
            color: '#5d5df1',
          },
        ],
        mainTaskTitle: '경쟁 서비스 리서치',
        extraTaskCount: 3,
        summary: '유사 서비스의 핵심 기능과 온보딩 구조를 비교했어요.',
      },
      {
        dailyEntryId: 'diary-2026-07-18',
        entryDate: '2026-07-18',
        day: 18,
        tags: [
          {
            tagName: 'QA',
            color: '#ff5fd7',
          },
        ],
        mainTaskTitle: '온보딩 QA 테스트 진행',
        extraTaskCount: 5,
        summary: '신규 사용자 흐름을 점검하고 주요 오류 항목을 정리했어요.',
      },
    ],
  },
  '2026-06': {
    success: true,
    code: 'S200',
    message: '조회에 성공했습니다.',
    result: [
      {
        dailyEntryId: 'diary-2026-06-21',
        entryDate: '2026-06-21',
        day: 21,
        tags: [
          {
            tagName: '기획',
            color: '#14c369',
          },
        ],
        mainTaskTitle: '분기 프로젝트 일정 기획',
        extraTaskCount: 4,
        summary: '분기 목표를 기준으로 프로젝트 일정과 주요 산출물을 정리했어요.',
      },
      {
        dailyEntryId: 'diary-2026-06-17',
        entryDate: '2026-06-17',
        day: 17,
        tags: [
          {
            tagName: '분석',
            color: '#ff6d38',
          },
        ],
        mainTaskTitle: '업무 데이터 분석',
        extraTaskCount: 3,
        summary: '기존 업무 데이터를 분석해 반복적으로 발생하는 작업을 분류했어요.',
      },
    ],
  },
  '2026-05': {
    success: true,
    code: 'S200',
    message: '조회에 성공했습니다.',
    result: [
      {
        dailyEntryId: 'diary-2026-05-23',
        entryDate: '2026-05-23',
        day: 23,
        tags: [
          {
            tagName: '문서화',
            color: '#2d96ff',
          },
        ],
        mainTaskTitle: '팀 업무 가이드 문서화',
        extraTaskCount: 2,
        summary: '팀에서 반복적으로 사용하는 업무 절차를 문서로 정리했어요.',
      },
      {
        dailyEntryId: 'diary-2026-05-12',
        entryDate: '2026-05-12',
        day: 12,
        tags: [
          {
            tagName: '회의',
            color: '#14c369',
          },
        ],
        mainTaskTitle: '주간 업무 공유 회의',
        extraTaskCount: 3,
        summary: '진행 중인 업무의 상태와 다음 주 우선순위를 공유했어요.',
      },
    ],
  },
  '2026-04': {
    success: true,
    code: 'S200',
    message: '조회에 성공했습니다.',
    result: [
      {
        dailyEntryId: 'diary-2026-04-26',
        entryDate: '2026-04-26',
        day: 26,
        tags: [
          {
            tagName: '기획',
            color: '#14c369',
          },
        ],
        mainTaskTitle: '신규 프로젝트 기능 정의',
        extraTaskCount: 4,
        summary: '사용자 문제를 기준으로 신규 프로젝트의 핵심 기능을 정의했어요.',
      },
      {
        dailyEntryId: 'diary-2026-04-15',
        entryDate: '2026-04-15',
        day: 15,
        tags: [
          {
            tagName: '디자인',
            color: '#ff5fd7',
          },
        ],
        mainTaskTitle: '주요 화면 와이어프레임 제작',
        extraTaskCount: 2,
        summary: '핵심 사용자 흐름을 기준으로 주요 화면 구조를 설계했어요.',
      },
    ],
  },
  '2026-03': {
    success: true,
    code: 'S200',
    message: '조회에 성공했습니다.',
    result: [
      {
        dailyEntryId: 'diary-2026-03-19',
        entryDate: '2026-03-19',
        day: 19,
        tags: [
          {
            tagName: '리서치',
            color: '#5d5df1',
          },
        ],
        mainTaskTitle: '경쟁 서비스 기능 조사',
        extraTaskCount: 3,
        summary: '경쟁 서비스의 주요 기능과 차별화 요소를 비교했어요.',
      },
    ],
  },
  '2026-02': {
    success: true,
    code: 'S200',
    message: '조회에 성공했습니다.',
    result: [
      {
        dailyEntryId: 'diary-2026-02-21',
        entryDate: '2026-02-21',
        day: 21,
        tags: [
          {
            tagName: '회의',
            color: '#14c369',
          },
        ],
        mainTaskTitle: '프로젝트 킥오프 회의',
        extraTaskCount: 3,
        summary: '프로젝트 목표와 팀원별 역할, 진행 일정을 공유했어요.',
      },
    ],
  },
  '2026-01': {
    success: true,
    code: 'S200',
    message: '조회에 성공했습니다.',
    result: [
      {
        dailyEntryId: 'diary-2026-01-15',
        entryDate: '2026-01-15',
        day: 15,
        tags: [
          {
            tagName: '기획',
            color: '#14c369',
          },
        ],
        mainTaskTitle: '연간 업무 목표 설정',
        extraTaskCount: 2,
        summary: '연간 목표를 기준으로 분기별 주요 업무 계획을 정리했어요.',
      },
    ],
  },
}

export const DAILY_ENTRY_SEARCH_ITEMS_MOCK: DailyEntrySearchItem[] = [
  {
    dailyEntryId: 'daily-entry-2026-06-21',
    entryDate: '2026-06-21',
    tags: [
      {
        tagName: '온보딩 리뉴얼',
        color: '#14c369',
      },
    ],
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    dailyEntryId: 'daily-entry-2026-06-20',
    entryDate: '2026-06-20',
    tags: [
      {
        tagName: '회의',
        color: '#14c369',
      },
    ],
    title:
      'Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비',
  },
  {
    dailyEntryId: 'daily-entry-2026-06-19',
    entryDate: '2026-06-19',
    tags: [],
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    dailyEntryId: 'daily-entry-2026-06-18',
    entryDate: '2026-06-18',
    tags: [
      {
        tagName: '회의록 작성',
        color: '#14c369',
      },
    ],
    title: '프로젝트 정기 회의록 작성',
  },
  {
    dailyEntryId: 'daily-entry-2026-06-15',
    entryDate: '2026-06-15',
    tags: [
      {
        tagName: '고객 회의',
        color: '#14c369',
      },
    ],
    title: '고객 요청사항 확인 및 다음 작업 정리',
  },
  {
    dailyEntryId: 'daily-entry-2026-06-03',
    entryDate: '2026-06-03',
    tags: [
      {
        tagName: '온보딩 리뉴얼',
        color: '#14c369',
      },
    ],
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    dailyEntryId: 'daily-entry-2026-02-21',
    entryDate: '2026-02-21',
    tags: [
      {
        tagName: '온보딩 리뉴얼',
        color: '#14c369',
      },
    ],
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    dailyEntryId: 'daily-entry-2026-01-21',
    entryDate: '2026-01-21',
    tags: [],
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    dailyEntryId: 'daily-entry-2026-01-20',
    entryDate: '2026-01-20',
    tags: [],
    title: '주간 회의 내용 정리 및 다음 업무 계획 수립',
  },
]
