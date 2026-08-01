import type { Task } from '@/types/todo'
import { toDateKey } from '@/utils/calendar'

const MEMO_SAMPLE = '지난 분기 OKR 정리 / 디자인 시스템 V_2 진행 현황 슬라이드 1장'
const TODAY = toDateKey(new Date())

/* 더미 데이터 */
export const INITIAL_TASKS: Task[] = [
  {
    id: 'should-1',
    date: TODAY,
    title: 'Product Strategy Alignment 회의 준비',
    tag: { label: '온보딩 리뉴얼', color: 'green' },
    priority: 'should',
    isCompleted: false,
  },
  {
    id: 'could-1',
    date: TODAY,
    title: 'Product Strategy Alignment 회의 준비',
    memo: MEMO_SAMPLE,
    tag: { label: '디자인 시스템 V2', color: 'pink' },
    priority: 'could',
    isCompleted: false,
  },
  {
    id: 'could-2',
    date: TODAY,
    title: 'Product Strategy Alignment 회의 준비',
    memo: MEMO_SAMPLE,
    tag: { label: '리서치', color: 'navy' },
    priority: 'could',
    isCompleted: false,
  },
  {
    id: 'could-3',
    date: TODAY,
    title: 'Product Strategy Alignment 회의 준비',
    memo: MEMO_SAMPLE,
    tag: { label: '광고', color: 'blue' },
    priority: 'could',
    isCompleted: false,
  },
]
