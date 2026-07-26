import type {
  DailyEntryDetailResponse,
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
          tagName: '온보딩 리뉴얼',
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
      summary: '회의 준비와 업무 데이터 분석이 중심이 된 달이에요.',
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
        dailyEntryId: 'daily-entry-2026-07-28',
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
        dailyEntryId: 'daily-entry-2026-07-24',
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
        dailyEntryId: 'daily-entry-2026-07-18',
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
        dailyEntryId: 'daily-entry-2026-06-21',
        entryDate: '2026-06-21',
        day: 21,
        tags: [
          {
            tagName: '온보딩 리뉴얼',
            color: '#14c369',
          },
        ],
        mainTaskTitle: 'Product Strategy Alignment 회의 준비',
        extraTaskCount: 2,
        summary: '회의 자료와 주요 논의 내용을 정리하고 프로젝트 문서를 마무리했어요.',
      },
      {
        dailyEntryId: 'daily-entry-2026-06-17',
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
        dailyEntryId: 'daily-entry-2026-05-23',
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
        dailyEntryId: 'daily-entry-2026-05-12',
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
        dailyEntryId: 'daily-entry-2026-04-26',
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
        dailyEntryId: 'daily-entry-2026-04-15',
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
        dailyEntryId: 'daily-entry-2026-03-19',
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
        dailyEntryId: 'daily-entry-2026-02-21',
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
        dailyEntryId: 'daily-entry-2026-01-15',
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
    dailyEntryId: 'daily-entry-long-title-2026-06-20',
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
        tagName: '회의',
        color: '#14c369',
      },
    ],
    title: '프로젝트 킥오프 회의',
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

interface CreateDailyEntryDetailResponseMockParams {
  dailyEntryId: string
  entryDate: string
  title: string
  summary: string
  tagName?: string
  tagColor?: string
}

const createDailyEntryDetailResponseMock = ({
  dailyEntryId,
  entryDate,
  title,
  summary,
  tagName,
  tagColor,
}: CreateDailyEntryDetailResponseMockParams): DailyEntryDetailResponse => {
  const tag =
    tagName && tagColor
      ? {
          tagName,
          color: tagColor,
        }
      : undefined

  return {
    success: true,
    code: 'S200',
    message: '조회에 성공했습니다.',
    result: {
      dailyEntryId,
      entryDate,
      reflectionContent: summary,
      completedCount: 1,
      incompleteCount: 1,
      tasks: [
        {
          taskId: `${dailyEntryId}-completed-task`,
          tag,
          title,
          memo: '업무 진행에 필요한 내용을 확인하고 계획에 따라 작업했어요.',
          priority: 'MUST_DO',
          status: 'COMPLETED',
          results: [
            {
              taskResultId: `${dailyEntryId}-task-result`,
              content: '계획한 업무를 완료하고 주요 결과를 정리했어요.',
              attachments: [],
            },
          ],
        },
        {
          taskId: `${dailyEntryId}-incomplete-task`,
          tag,
          title: `${title} 후속 업무`,
          memo: '남은 내용을 확인한 뒤 다음 업무에서 이어서 진행할 예정이에요.',
          priority: 'SHOULD_DO',
          status: 'INCOMPLETE',
          results: [],
        },
      ],
    },
  }
}

const MONTHLY_DAILY_ENTRY_DETAIL_RESPONSE_MOCK_MAP = Object.fromEntries(
  Object.values(MONTHLY_DAILY_ENTRY_RESPONSE_MOCK_MAP)
    .flatMap((response) => response.result)
    .map((entry) => {
      const firstTag = entry.tags[0]

      return [
        entry.dailyEntryId,
        createDailyEntryDetailResponseMock({
          dailyEntryId: entry.dailyEntryId,
          entryDate: entry.entryDate,
          title: entry.mainTaskTitle,
          summary: entry.summary,
          tagName: firstTag?.tagName,
          tagColor: firstTag?.color,
        }),
      ]
    }),
) as Record<string, DailyEntryDetailResponse>

const SEARCH_DAILY_ENTRY_DETAIL_RESPONSE_MOCK_MAP = Object.fromEntries(
  DAILY_ENTRY_SEARCH_ITEMS_MOCK.map((entry) => {
    const firstTag = entry.tags[0]

    return [
      entry.dailyEntryId,
      createDailyEntryDetailResponseMock({
        dailyEntryId: entry.dailyEntryId,
        entryDate: entry.entryDate,
        title: entry.title,
        summary: `${entry.title} 업무를 중심으로 오늘의 진행 내용과 결과를 정리했어요.`,
        tagName: firstTag?.tagName,
        tagColor: firstTag?.color,
      }),
    ]
  }),
) as Record<string, DailyEntryDetailResponse>

export const DAILY_ENTRY_DETAIL_RESPONSE_MOCK_MAP: Record<string, DailyEntryDetailResponse> = {
  ...MONTHLY_DAILY_ENTRY_DETAIL_RESPONSE_MOCK_MAP,
  ...SEARCH_DAILY_ENTRY_DETAIL_RESPONSE_MOCK_MAP,

  'daily-entry-2026-06-21': {
    success: true,
    code: 'S200',
    message: '조회에 성공했습니다.',
    result: {
      dailyEntryId: 'daily-entry-2026-06-21',
      entryDate: '2026-06-21',
      reflectionContent:
        '오늘은 회의 준비와 프로젝트 문서 정리를 마무리했다. 다음에는 업무 우선순위를 조금 더 명확하게 정리해야겠다.',
      completedCount: 2,
      incompleteCount: 1,
      tasks: [
        {
          taskId: 'task-1',
          tag: {
            tagName: '온보딩 리뉴얼',
            color: '#14c369',
          },
          title: 'Product Strategy Alignment 회의 준비',
          memo: '회의 자료와 주요 논의 내용을 미리 정리한다.',
          priority: 'MUST_DO',
          status: 'COMPLETED',
          results: [
            {
              taskResultId: 'task-result-1',
              content: '회의 자료 초안을 작성하고 팀원들에게 공유했다.',
              attachments: [
                {
                  fileType: 'img',
                  fileUrl: 'https://picsum.photos/seed/wordy-diary/800/600',
                  fileName: '회의자료_미리보기.png',
                },
                {
                  fileType: 'file',
                  fileUrl:
                    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  fileName: 'Product_Strategy_Alignment_회의자료.pdf',
                },
              ],
            },
          ],
        },
        {
          taskId: 'task-2',
          tag: {
            tagName: '온보딩 리뉴얼',
            color: '#14c369',
          },
          title: '온보딩 개선안 문서 정리',
          memo: '기존 사용자 피드백을 반영해 개선안을 작성한다.',
          priority: 'SHOULD_DO',
          status: 'COMPLETED',
          results: [
            {
              taskResultId: 'task-result-2',
              content: '개선안 문서를 정리하고 주요 수정사항을 표시했다.',
              attachments: [],
            },
          ],
        },
        {
          taskId: 'task-3',
          title: '다음 회의 일정 정리',
          memo: '참석 가능 시간을 확인한 뒤 일정을 확정한다.',
          priority: 'COULD_DO',
          status: 'INCOMPLETE',
          results: [],
        },
      ],
    },
  },
}
