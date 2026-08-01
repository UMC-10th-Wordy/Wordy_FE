import type { DiarySearchDiary, DiarySearchTagResult } from '@/types/diarySearch'

export const MOCK_DIARY_SEARCH_RESULTS: DiarySearchDiary[] = [
  {
    id: '2026-06-21',
    entryDate: '2026-06-21',
    title: 'Product Strategy Alignment 회의 준비',
    tag: {
      name: '온보딩 리뉴얼',
      color: 'green',
    },
  },
  {
    id: '2026-06-20',
    entryDate: '2026-06-20',
    title:
      'Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비',
    tag: {
      name: '온보딩 리뉴얼',
      color: 'green',
    },
  },
  {
    id: '2026-06-19',
    entryDate: '2026-06-19',
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    id: '2026-06-03',
    entryDate: '2026-06-03',
    title: 'Product Strategy Alignment 회의 준비',
    tag: {
      name: '온보딩 리뉴얼',
      color: 'green',
    },
  },
  {
    id: '2026-02-21',
    entryDate: '2026-02-21',
    title: 'Product Strategy Alignment 회의 준비',
    tag: {
      name: '온보딩 리뉴얼',
      color: 'green',
    },
  },
  {
    id: '2026-01-21',
    entryDate: '2026-01-21',
    title: 'Product Strategy Alignment 회의 준비',
  },
  {
    id: '2026-01-20',
    entryDate: '2026-01-20',
    title: '주간 회의 내용 정리 및 다음 업무 계획 수립',
  },
]

export const MOCK_TAG_SEARCH_RESULTS: DiarySearchTagResult[] = [
  {
    name: '회의',
    color: 'red',
    diaries: [
      {
        id: '2026-06-21',
        entryDate: '2026-06-21',
        title: 'Product Strategy Alignment 회의 준비',
        tag: {
          name: '회의',
          color: 'red',
        },
      },
      {
        id: '2026-06-20',
        entryDate: '2026-06-20',
        title:
          'Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비 Product Strategy Alignment 회의 준비',
        tag: {
          name: '회의',
          color: 'red',
        },
      },
    ],
  },
  {
    name: '회의록 작성',
    color: 'yellow',
    diaries: [
      {
        id: '2026-06-18',
        entryDate: '2026-06-18',
        title: '프로젝트 정기 회의록 작성',
        tag: {
          name: '회의록 작성',
          color: 'yellow',
        },
      },
    ],
  },
  {
    name: '고객 회의',
    color: 'blue',
    diaries: [
      {
        id: '2026-06-15',
        entryDate: '2026-06-15',
        title: '고객 요청사항 확인을 위한 회의 진행',
        tag: {
          name: '고객 회의',
          color: 'blue',
        },
      },
    ],
  },
]
