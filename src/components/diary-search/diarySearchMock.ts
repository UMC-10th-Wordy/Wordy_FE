import type { DiarySearchDiary, DiarySearchTagResult } from '@/types/diarySearch'

export const MOCK_DIARY_SEARCH_RESULTS: DiarySearchDiary[] = [
  {
    id: '2026-06-21',
    createdAt: '2026-06-21',
    displayDate: '2026년 6월 21일',
    title: 'Product Strategy Alignment 회의 준비',
    tag: {
      id: 'tag-onboarding',
      name: '온보딩 리뉴얼',
      color: 'green',
    },
  },
  {
    id: '2026-06-20',
    createdAt: '2026-06-20',
    displayDate: '2026년 6월 20일',
    title:
      'Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비',
    tag: {
      id: 'tag-onboarding',
      name: '온보딩 리뉴얼',
      color: 'green',
    },
  },
  {
    id: '2026-06-19',
    createdAt: '2026-06-19',
    displayDate: '2026년 6월 19일',
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    id: '2026-06-03',
    createdAt: '2026-06-03',
    displayDate: '2026년 6월 3일',
    title: 'Product Strategy Alignment 회의 준비',
    tag: {
      id: 'tag-onboarding',
      name: '온보딩 리뉴얼',
      color: 'green',
    },
  },
  {
    id: '2026-02-21',
    createdAt: '2026-02-21',
    displayDate: '2026년 2월 21일',
    title: 'Product Strategy Alignment 회의 준비',
    tag: {
      id: 'tag-onboarding',
      name: '온보딩 리뉴얼',
      color: 'green',
    },
  },
  {
    id: '2026-01-21',
    createdAt: '2026-01-21',
    displayDate: '2026년 1월 21일',
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    id: '2026-01-20',
    createdAt: '2026-01-20',
    displayDate: '2026년 1월 20일',
    title: '주간 회의 내용 정리 및 다음 업무 계획 수립',
  },
]

export const MOCK_TAG_SEARCH_RESULTS: DiarySearchTagResult[] = [
  {
    id: 'tag-meeting',
    name: '회의',
    color: 'red',
    latestDiaryCreatedAt: '2026-06-21',
    diaries: [
      {
        id: '2026-06-21',
        createdAt: '2026-06-21',
        displayDate: '2026년 6월 21일',
        title: 'Product Strategy Alignment 회의 준비',
        tag: {
          id: 'tag-meeting',
          name: '회의',
          color: 'red',
        },
      },
      {
        id: '2026-06-20',
        createdAt: '2026-06-20',
        displayDate: '2026년 6월 20일',
        title:
          'Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비Product Strategy Alignment 회의 준비Product Strategy Alignment 회의 준비',
        tag: {
          id: 'tag-meeting',
          name: '회의',
          color: 'red',
        },
      },
    ],
  },
  {
    id: 'tag-meeting-note',
    name: '회의록 작성',
    color: 'yellow',
    latestDiaryCreatedAt: '2026-06-18',
    diaries: [
      {
        id: '2026-06-18',
        createdAt: '2026-06-18',
        displayDate: '2026년 6월 18일',
        title: '프로젝트 정기 회의록 작성',
        tag: {
          id: 'tag-meeting-note',
          name: '회의록 작성',
          color: 'yellow',
        },
      },
    ],
  },
  {
    id: 'tag-client-meeting',
    name: '고객 회의',
    color: 'blue',
    latestDiaryCreatedAt: '2026-06-15',
    diaries: [
      {
        id: '2026-06-15',
        createdAt: '2026-06-15',
        displayDate: '2026년 6월 15일',
        title: '고객 요청사항 확인을 위한 회의 진행',
        tag: {
          id: 'tag-client-meeting',
          name: '고객 회의',
          color: 'blue',
        },
      },
    ],
  },
]
