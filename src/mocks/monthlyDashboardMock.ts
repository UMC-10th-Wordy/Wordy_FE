import type { WeeklyBoardStatus } from '@/components/dashboard/MonthlyWeekListPanel'
import type { TagWorkflow } from '@/components/dashboard/TagWorkflowSection'

// TODO: 월간 API 명세 확정 시 실제 연동으로 교체
export const DUMMY_WEEKS: WeeklyBoardStatus[] = [
  { id: 'w1', weekLabel: '6월 1주차', rangeLabel: '6월 1일 - 6월 6일', generated: true },
  { id: 'w2', weekLabel: '6월 2주차', rangeLabel: '6월 7일 - 6월 13일', generated: true },
  { id: 'w3', weekLabel: '6월 3주차', rangeLabel: '6월 14일 - 6월 20일', generated: true },
  { id: 'w4', weekLabel: '6월 4주차', rangeLabel: '6월 21일 - 6월 27일', generated: true },
  { id: 'w5', weekLabel: '6월 5주차', rangeLabel: '6월 28일 - 6월 30일', generated: true },
]

export const DUMMY_MONTHLY_STATS = [
  { label: '일지 기록', value: '26', unit: '일' },
  { label: '업무 완료율', value: '85', unit: '%' },
  { label: '사용된 프로젝트 태그', value: '16', unit: '개' },
]

export const DUMMY_MONTHLY_AI_SUMMARY =
  '이번 달은 제품 전략 정렬과 디자인 시스템 V2를 중심으로 움직였어요. 회의 준비와 회고 작성의 밀도가 높았고, 특히 월 중반 이후 의사결정 속도가 빨라졌어요. 반면 리서치 영역은 일정상 후순위로 밀려 다음 달 우선 보완이 필요해 보이네요.'

export const DUMMY_MONTHLY_HIGHLIGHT = 'OKR 회고 정리 · DS V2 70% 진척'

export const DUMMY_FOCUS_AREAS = [
  { label: '제품 기획', color: 'green' as const },
  { label: '디자인 시스템', color: 'pink' as const },
]

export const DUMMY_MONTHLY_TAGS: TagWorkflow[] = [
  // ⚠️ 여기엔 지금 MonthlyDashboard.tsx 안에 있는 DUMMY_MONTHLY_TAGS 배열 내용을
  //    그대로 복사해서 붙여넣어 (온보딩 리뉴얼 + 디자인 시스템 V2 두 항목)
]

export const DUMMY_MONTHLY_HIGHLIGHTS = [
  {
    text: '온보딩 와이어프레임 12종을 정리하고 PM·디자이너 합의안을 도출했어요',
    source: '2026년 6월 11일 업무 일지',
  },
  {
    text: '기존 온보딩 이탈 지점 3가지를 인터뷰·로그 데이터로 교차 검증했어요',
    source: '2026년 6월 13일 업무 일지',
  },
  {
    text: 'Phase 1 프로토타입을 70% 진척시켰고 7월 사용자 테스트 일정을 확정했어요',
    source: '2026년 6월 12일 업무 일지',
  },
]
