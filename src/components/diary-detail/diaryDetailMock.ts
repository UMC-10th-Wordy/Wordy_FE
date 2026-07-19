import { PERFORMANCE_PREVIEW_RESULT_MOCK } from '@/components/performance-preview/performancePreviewResultMock'

import type { DiaryDetailData } from '@/types/diaryDetail'

// TODO(#65): 업무 일지 상세 조회 API 연결 후 목업 데이터 제거
export const DIARY_DETAIL_MOCK: DiaryDetailData = {
  id: '2026-08-21',
  date: '2026-08-21',
  tasks: [
    {
      id: 'completed-1',
      date: '2026-08-21',
      title: 'Product Strategy Alignment 회의 준비',
      memo: '지난 분기 OKR 회고와 다음 분기 핵심 안건을 정리했어요.',
      tag: {
        label: '온보딩 리뉴얼',
        color: 'green',
      },
      priority: 'must',
      isCompleted: true,
      result: '회의 아젠다와 주요 논의 자료 초안을 작성했어요.',
      resultFiles: [
        {
          id: 'file-1',
          name: 'Product_Strategy_Alignment_회의자료.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
      ],
      resultImages: [
        {
          id: 'image-1',
          name: '회의자료_미리보기.png',
          url: 'https://picsum.photos/seed/wordy-diary/800/600',
        },
      ],
    },
    {
      id: 'completed-2',
      date: '2026-08-21',
      title: '디자인 시스템 V2 컴포넌트 상태 점검',
      tag: {
        label: '디자인 시스템 V2',
        color: 'pink',
      },
      priority: 'should',
      isCompleted: true,
      result: '누락된 컴포넌트 상태를 확인하고 개선 범위를 정리했어요.',
    },
    {
      id: 'completed-3',
      date: '2026-08-21',
      title: '사용자 리서치 결과 정리',
      memo: '인터뷰 내용을 주요 사용성 문제별로 분류했어요.',
      tag: {
        label: '리서치',
        color: 'navy',
      },
      priority: 'could',
      isCompleted: true,
    },
    {
      id: 'incomplete-1',
      date: '2026-08-21',
      title: '온보딩 리뉴얼 회의 액션 아이템 정리',
      memo: '회의 참석자별 담당 업무를 추가로 확인해야 해요.',
      tag: {
        label: '온보딩 리뉴얼',
        color: 'green',
      },
      priority: 'should',
      isCompleted: false,
    },
    {
      id: 'incomplete-2',
      date: '2026-08-21',
      title: '다음 분기 프로젝트 일정 초안 작성',
      tag: {
        label: '광고',
        color: 'blue',
      },
      priority: 'could',
      isCompleted: false,
    },
  ],
  retrospective: '오늘은 회의 준비와 프로젝트 진행 현황 정리를 중심으로 업무를 진행했다.',
  performance: PERFORMANCE_PREVIEW_RESULT_MOCK,
}
