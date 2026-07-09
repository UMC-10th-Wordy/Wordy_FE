// 성과 변환 완료 화면 더미 데이터
import type { PerformancePreviewResultData } from '@/types/performancePreviewResult'

export const PERFORMANCE_PREVIEW_RESULT_MOCK: PerformancePreviewResultData = {
  totalTaskCount: 5,
  completedTaskCount: 3,
  incompleteTasks: [
    {
      id: 'should-1',
      title: 'Product Strategy Alignment 회의 준비',
      priority: 'should',
      tag: { label: '온보딩 리뉴얼', color: 'green' },
    },
    {
      id: 'could-1',
      title: 'Product Strategy Alignment 회의 준비',
      priority: 'could',
      tag: { label: '디자인 시스템 V2', color: 'pink' },
    },
    {
      id: 'could-2',
      title: 'Product Strategy Alignment 회의 준비',
      priority: 'could',
      tag: { label: '리서치', color: 'navy' },
    },
    {
      id: 'could-3',
      title:
        '긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트',
      priority: 'could',
      tag: { label: '광고', color: 'blue' },
    },
  ],
  summary:
    '오늘은 온보딩 리뉴얼과 디자인 시스템 개선 업무를 중심으로 진행했어요.\n회의 준비와 진행 현황 정리를 통해 다음 논의에 필요한 기반을 마련했어요.',
  insight:
    '업무 진행 상황을 문서화하며 프로젝트 맥락을 더 명확히 정리했어요.\n회의 준비 과정에서 우선순위가 높은 논의 지점을 구체화했어요.',
  nextTasks: [
    '온보딩 리뉴얼 회의에서 나온 주요 액션 아이템을 정리해 보세요.',
    '디자인 시스템 V2 문서에서 누락된 컴포넌트 상태를 점검해 보세요.',
  ],
  taskResults: [
    {
      id: 'result-should-1',
      taskId: 'should-1',
      title: 'Product Strategy Alignment 회의 준비',
      tag: { label: '온보딩 리뉴얼', color: 'green' },
      output: ['회의 아젠다 및 논의 자료 초안', '회의 아젠다 및 논의 자료 초안2'],
      impact: '프로젝트 방향성 논의를 위한 기준 마련',
    },
    {
      id: 'result-could-1',
      taskId: 'could-1',
      title: 'Product Strategy Alignment 회의 준비',
      tag: { label: '디자인 시스템 V2', color: 'pink' },
      impact: '팀 내 디자인 시스템 개선 범위 공유',
    },
    {
      id: 'result-could-2',
      taskId: 'could-2',
      title: 'Product Strategy Alignment 회의 준비',
    },
  ],
}
