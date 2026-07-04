import { useState } from 'react'
import moveIcon from '@/assets/icons/move.svg'
import editIcon from '@/assets/icons/edit.svg'
import trashIcon from '@/assets/icons/trash.svg'
import chevronUpIcon from '@/assets/icons/Direction=top.svg'
import chevronDownIcon from '@/assets/icons/Direction=bottom.svg'
import ProjectTag from './ProjectTag'

export default function TaskCard() {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="flex w-full flex-col items-end gap-4 rounded-lg border border-[#ddf] bg-white p-5 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
      {/* 드래그 핸들 / 체크박스 / 프로젝트 태그 / 업무명 */}
      <div className="flex w-full items-center gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-[9px]">
          <div className="flex shrink-0 items-center gap-[9px]">
            <button type="button" className="flex size-6 shrink-0 items-center justify-center">
              <img src={moveIcon} alt="순서 변경" className="size-6 shrink-0" />
            </button>
            {/* 공통 Checkbox 컴포넌트로 교체 */}
            <span className="size-6 shrink-0 rounded border border-[#ccc]" /> {/* Checkbox */}
            <ProjectTag label="온보딩 리뉴얼" color="green" />
          </div>
          <p className="min-w-0 flex-1 font-['Pretendard'] text-lg font-semibold leading-[1.6] text-[#111111]">
            Product Strategy Alignment 회의 준비
          </p>
        </div>
        {/*아이콘 버튼*/}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-md"
          >
            <img src={editIcon} alt="수정" className="size-6 shrink-0" />
          </button>
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-md"
          >
            <img src={trashIcon} alt="삭제" className="size-6 shrink-0" />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="flex size-8 shrink-0 items-center justify-center rounded-md"
          >
            <img
              src={isExpanded ? chevronUpIcon : chevronDownIcon}
              alt={isExpanded ? '접기' : '펼치기'}
              className="size-6 shrink-0"
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* 메모 */}
          <div className="flex w-full flex-col items-start gap-1 pb-2">
            <p className="font-['Pretendard'] text-base font-medium leading-[1.6] text-[#727272]">
              메모
            </p>
            <p className="w-full font-['Pretendard'] text-lg font-normal leading-[1.6] text-[#4d4d4d]">
              지난 분기 OKR 정리 / 디자인 시스템 V_2 진행 현황 슬라이드 1장
            </p>
          </div>

          {/* 업무 결과 작성하기 */}
          {/* 공통 Button 컴포넌트로 교체 */}
          <button
            type="button"
            className="flex h-11 shrink-0 items-center justify-center gap-1 rounded-lg px-3"
          >
            <span className="size-7 shrink-0" /> {/* Icon/plus 추가 후 교체 */}
            <span className="text-right font-['Pretendard'] text-base font-medium leading-[1.6] text-[#5d5df1]">
              업무 결과 작성하기
            </span>
          </button>
        </>
      )}
    </div>
  )
}
