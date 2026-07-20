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
    entries: [
      {
        id: 'diary-2026-08-21',
        date: '2026-08-21',
        day: 21,
        totalTaskCount: 8,
        representativeTask: {
          id: 'task-2026-08-21-1',
          title:
            'Product Strategy Alignment 회의 준비Product Strategy Alignment 회의 준비Product Strategy Alignment 회의 준비Product Strategy Alignment 회의 준비Product Strategy Alignment 회의 준비',
          projectTag: {
            id: 'meeting',
            label: '회의',
            color: 'green',
          },
        },
        performanceSummary:
          '회의 준비와 디자인 시스템 V2 정리를 병행하며 다음 분기 실행 기반을 다졌어요.',
      },
      {
        id: 'diary-2026-08-20',
        date: '2026-08-20',
        day: 20,
        totalTaskCount: 7,
        representativeTask: {
          id: 'task-2026-08-20-1',
          title: '광고 캠페인 제안서 초안',
          projectTag: {
            id: 'advertisement',
            label: '광고',
            color: 'blue',
          },
        },
        performanceSummary: '타깃 세그먼트 3종을 정의하고 KPI 가설을 수립했어요.',
      },
      {
        id: 'diary-2026-08-14',
        date: '2026-08-14',
        day: 14,
        totalTaskCount: 8,
        representativeTask: {
          id: 'task-2026-08-14-1',
          title: '디자인 시스템 V2 컴포넌트 정리',
          projectTag: {
            id: 'design',
            label: '디자인',
            color: 'pink',
          },
        },
        performanceSummary: 'Button, Input, Dialog Variants를 일괄 점검했어요.',
      },
      {
        id: 'diary-2026-08-12',
        date: '2026-08-12',
        day: 12,
        totalTaskCount: 8,
        representativeTask: {
          id: 'task-2026-08-12-1',
          title: 'AI 일지 변환 프롬프트 A/B',
          projectTag: {
            id: 'development',
            label: '개발',
            color: 'orange',
          },
        },
        performanceSummary: '프롬프트 2종을 비교하고 요약 품질이 22% 향상된 것을 확인했어요.',
      },
      {
        id: 'diary-2026-08-10',
        date: '2026-08-10',
        day: 10,
        totalTaskCount: 8,
        representativeTask: {
          id: 'task-2026-08-10-1',
          title: '팀 핸드북 V1 정리',
          projectTag: {
            id: 'documentation',
            label: '문서화',
            color: 'green',
          },
        },
        performanceSummary: '온보딩, 협업 툴, 코드 리뷰 가이드를 통합했어요.',
      },
    ],
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
    entries: [
      {
        id: 'diary-2026-07-28',
        date: '2026-07-28',
        day: 28,
        totalTaskCount: 5,
        representativeTask: {
          id: 'task-2026-07-28-1',
          title: '온보딩 사용자 흐름 정리',
          projectTag: {
            id: 'onboarding',
            label: '온보딩',
            color: 'blue',
          },
        },
        performanceSummary: '신규 사용자의 주요 이탈 구간을 기준으로 진입 흐름을 개선했어요.',
      },
      {
        id: 'diary-2026-07-24',
        date: '2026-07-24',
        day: 24,
        totalTaskCount: 4,
        representativeTask: {
          id: 'task-2026-07-24-1',
          title: '경쟁 서비스 리서치',
          projectTag: {
            id: 'research',
            label: '리서치',
            color: 'blue',
          },
        },
        performanceSummary: '유사 서비스의 핵심 기능과 온보딩 구조를 비교했어요.',
      },
      {
        id: 'diary-2026-07-18',
        date: '2026-07-18',
        day: 18,
        totalTaskCount: 6,
        representativeTask: {
          id: 'task-2026-07-18-1',
          title: '온보딩 QA 테스트 진행',
          projectTag: {
            id: 'qa',
            label: 'QA',
            color: 'pink',
          },
        },
        performanceSummary: '신규 사용자 흐름을 점검하고 주요 오류 항목을 정리했어요.',
      },
    ],
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
    entries: [
      {
        id: 'diary-2026-06-21',
        date: '2026-06-21',
        day: 21,
        totalTaskCount: 5,
        representativeTask: {
          id: 'task-2026-06-21-1',
          title: '분기 프로젝트 일정 기획',
          projectTag: {
            id: 'planning',
            label: '기획',
            color: 'green',
          },
        },
        performanceSummary: '분기 목표를 기준으로 프로젝트 일정과 주요 산출물을 정리했어요.',
      },
      {
        id: 'diary-2026-06-17',
        date: '2026-06-17',
        day: 17,
        totalTaskCount: 4,
        representativeTask: {
          id: 'task-2026-06-17-1',
          title: '업무 데이터 분석',
          projectTag: {
            id: 'analysis',
            label: '분석',
            color: 'orange',
          },
        },
        performanceSummary: '기존 업무 데이터를 분석해 반복적으로 발생하는 작업을 분류했어요.',
      },
    ],
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
    entries: [
      {
        id: 'diary-2026-05-23',
        date: '2026-05-23',
        day: 23,
        totalTaskCount: 3,
        representativeTask: {
          id: 'task-2026-05-23-1',
          title: '팀 업무 가이드 문서화',
          projectTag: {
            id: 'documentation',
            label: '문서화',
            color: 'blue',
          },
        },
        performanceSummary: '팀에서 반복적으로 사용하는 업무 절차를 문서로 정리했어요.',
      },
      {
        id: 'diary-2026-05-12',
        date: '2026-05-12',
        day: 12,
        totalTaskCount: 4,
        representativeTask: {
          id: 'task-2026-05-12-1',
          title: '주간 업무 공유 회의',
          projectTag: {
            id: 'meeting',
            label: '회의',
            color: 'green',
          },
        },
        performanceSummary: '진행 중인 업무의 상태와 다음 주 우선순위를 공유했어요.',
      },
    ],
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
    entries: [
      {
        id: 'diary-2026-04-26',
        date: '2026-04-26',
        day: 26,
        totalTaskCount: 5,
        representativeTask: {
          id: 'task-2026-04-26-1',
          title: '신규 프로젝트 기능 정의',
          projectTag: {
            id: 'planning',
            label: '기획',
            color: 'green',
          },
        },
        performanceSummary: '사용자 문제를 기준으로 신규 프로젝트의 핵심 기능을 정의했어요.',
      },
      {
        id: 'diary-2026-04-15',
        date: '2026-04-15',
        day: 15,
        totalTaskCount: 3,
        representativeTask: {
          id: 'task-2026-04-15-1',
          title: '주요 화면 와이어프레임 제작',
          projectTag: {
            id: 'design',
            label: '디자인',
            color: 'pink',
          },
        },
        performanceSummary: '핵심 사용자 흐름을 기준으로 주요 화면 구조를 설계했어요.',
      },
    ],
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
    entries: [
      {
        id: 'diary-2026-03-19',
        date: '2026-03-19',
        day: 19,
        totalTaskCount: 4,
        representativeTask: {
          id: 'task-2026-03-19-1',
          title: '경쟁 서비스 기능 조사',
          projectTag: {
            id: 'research',
            label: '리서치',
            color: 'blue',
          },
        },
        performanceSummary: '경쟁 서비스의 주요 기능과 차별화 요소를 비교했어요.',
      },
    ],
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
    entries: [
      {
        id: 'diary-2026-02-21',
        date: '2026-02-21',
        day: 21,
        totalTaskCount: 4,
        representativeTask: {
          id: 'task-2026-02-21-1',
          title: '프로젝트 킥오프 회의',
          projectTag: {
            id: 'meeting',
            label: '회의',
            color: 'green',
          },
        },
        performanceSummary: '프로젝트 목표와 팀원별 역할, 진행 일정을 공유했어요.',
      },
    ],
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
    entries: [
      {
        id: 'diary-2026-01-15',
        date: '2026-01-15',
        day: 15,
        totalTaskCount: 3,
        representativeTask: {
          id: 'task-2026-01-15-1',
          title: '연간 업무 목표 설정',
          projectTag: {
            id: 'planning',
            label: '기획',
            color: 'green',
          },
        },
        performanceSummary: '연간 목표를 기준으로 분기별 주요 업무 계획을 정리했어요.',
      },
    ],
  },
]

export const EMPTY_DIARY_MONTHLY_RECORDS: MonthlyDiaryRecord[] = []
