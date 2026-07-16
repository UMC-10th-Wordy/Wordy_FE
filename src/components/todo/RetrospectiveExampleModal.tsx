import { useId } from 'react'
import { createPortal } from 'react-dom'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import LightbulbIcon from '@/assets/icons/lightbulb.svg?react'
import { IconButton } from '@/components/common/Button/IconButton'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useModalFocus } from '@/hooks/useModalFocus'

const EXAMPLE_PARAGRAPHS = [
  '오늘은 온보딩 리뉴얼 회의 준비를 위해 지난 분기 OKR 회고와 디자인 시스템 진행 현황을 정리했다.',
  '자료를 미리 구조화해둔 덕분에 회의에서 다음 분기 우선순위를 빠르게 맞출 수 있었다.',
  '다만 검토 범위를 넓게 잡아 준비 시간이 예상보다 오래 걸렸다. 다음에는 먼저 핵심 안건을 나누고, 필요한 자료만 우선 정리하는 방식으로 준비해보려고 한다.',
]

const TIP_ITEMS = [
  '오늘 한 일, 그 결과, 배운 점, 다음에 바꿔볼 점까지 적어주면 AI가 더 정확한 성과와 인사이트를 정리할 수 있어요.',
  '오늘 한 일의 나열보다, 업무를 하고 달라진 점을 함께 적어주세요.',
  '배운 점이나 아쉬운 점이 있으면 성장 인사이트가 더 좋아져요.',
  '다음에 어떻게 바꿔볼지 한 줄만 적어도 추천 업무 품질이 높아져요.',
]

interface RetrospectiveExampleModalProps {
  onClose: () => void
}

/* 오늘의 회고 작성 예시 안내 모달 */
export function RetrospectiveExampleModal({ onClose }: RetrospectiveExampleModalProps) {
  useEscapeKey(onClose)
  const containerRef = useModalFocus<HTMLDivElement>()
  const titleId = useId()

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-(--color-bg-overlay) backdrop-blur-[8px]"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex w-[900px] flex-col gap-7 rounded-(--scale-12) bg-(--color-bg-default) px-5 pt-5 pb-7 shadow-[0px_1px_15px_0px_rgba(0,0,0,0.1)]"
      >
        <div className="flex w-full items-center justify-between">
          <p
            id={titleId}
            className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)"
          >
            오늘의 회고는 이렇게 작성해 보세요
          </p>
          <IconButton
            type="button"
            variant="text_neutral"
            size="small"
            aria-label="닫기"
            onClick={onClose}
            icon={<XMarkIcon aria-hidden className="size-6" />}
          />
        </div>

        <div className="flex w-full flex-col gap-[35px]">
          <div className="flex w-full flex-col gap-2">
            <p className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-semibold text-(--color-text-tertiary)">
              작성 예시
            </p>
            <div className="flex min-h-[200px] w-full flex-col rounded-lg border border-(--color-border-brand-subtle) px-5 py-3">
              {EXAMPLE_PARAGRAPHS.map((paragraph) => (
                <p
                  key={paragraph}
                  className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-1">
              <LightbulbIcon aria-hidden className="size-6 text-(--color-icon-brand)" />
              <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
                작성 TIP!
              </p>
            </div>
            <div className="flex w-full flex-col gap-1">
              {TIP_ITEMS.map((tip) => (
                <div key={tip} className="flex items-center gap-2 pl-2">
                  <span className="size-[3px] shrink-0 rounded-full bg-(--color-icon-tertiary)" />
                  <p className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
