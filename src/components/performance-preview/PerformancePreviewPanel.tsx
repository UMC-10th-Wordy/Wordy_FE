import { PerformancePreviewResult } from './PerformancePreviewResult'
import { PerformanceQuestionChat } from './PerformanceQuestionChat'
import { PerformanceStatusNotice } from './PerformanceStatusNotice'

import type { PerformanceQuestionChatProps } from './PerformanceQuestionChat'
import type { PerformancePreviewResultData } from '@/types/performancePreviewResult'

import GenerateIcon from '@/assets/icons/generate.svg?react'
import emptyImage from '@/assets/icons/Layer 2.svg'

export type PerformancePreviewStatus = 'empty' | 'converting' | 'questioning' | 'failed' | 'success'

type PerformanceNoticeStatus = Exclude<PerformancePreviewStatus, 'questioning' | 'success'>

interface PerformancePreviewPanelBaseProps {
  status?: PerformanceNoticeStatus
}

interface PerformancePreviewPanelQuestioningProps {
  status: 'questioning'
  questionChat: PerformanceQuestionChatProps
}

interface PerformancePreviewPanelSuccessProps {
  status: 'success'
  result: {
    data: PerformancePreviewResultData
    readOnly?: boolean
    onSave?: (values: { summary: string; insight: string }) => void
    onMoveTaskToTomorrow?: (taskId: string) => void
  }
}

type PerformancePreviewPanelProps =
  | PerformancePreviewPanelBaseProps
  | PerformancePreviewPanelQuestioningProps
  | PerformancePreviewPanelSuccessProps

const STATUS_CONTENT = {
  empty: {
    imageSrc: emptyImage,
    message: '아직 작성된 내용이 없어요\n업무 일지를 작성하고 성과로 변환해 주세요',
  },
  converting: {
    // TODO(#10): 성과 변환 중 상태 이미지 에셋 수령 후 교체
    imageSrc: emptyImage,
    message: '워디가 열심히 변환하고 있어요\n잠시만 기다려 주세요',
  },
  failed: {
    // TODO(#10): 성과 변환 실패 상태 이미지 에셋 수령 후 교체
    imageSrc: emptyImage,
    message: '성과 생성에 실패했어요\n업무 일지 내용을 보완해 다시 시도해 주세요',
  },
} satisfies Record<
  PerformanceNoticeStatus,
  {
    imageSrc: string
    message: string
  }
>

export const PerformancePreviewPanel = (props: PerformancePreviewPanelProps) => {
  const isSuccess = props.status === 'success'

  const renderContent = () => {
    if (props.status === 'questioning') {
      return <PerformanceQuestionChat {...props.questionChat} />
    }

    if (props.status === 'success') {
      return <PerformancePreviewResult {...props.result} />
    }

    const status = props.status ?? 'empty'
    const currentStatusContent = STATUS_CONTENT[status]

    return (
      <div className="flex h-full w-full items-center justify-center">
        <PerformanceStatusNotice {...currentStatusContent} />
      </div>
    )
  }

  return (
    <aside className="order-2 flex h-screen w-[clamp(830px,50%,924px)] shrink-0 grow-0 overflow-y-auto bg-(--color-bg-brand-subtle) p-(--scale-40)">
      <section
        className={[
          'flex w-full flex-col rounded-(--scale-16) border-[1.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) px-(--scale-24) py-(--scale-20) shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]',
          isSuccess ? 'min-h-full self-start' : 'h-full overflow-hidden',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex shrink-0 items-center gap-(--scale-4)">
          <h2 className="[font-size:var(--font-size-heading-4)] leading-(--line-height-body) font-[var(--font-weight-bold)] text-(--color-text-default)">
            오늘의 성과 미리보기
          </h2>

          <GenerateIcon
            aria-hidden
            className="size-(--scale-32) shrink-0 text-(--color-icon-brand)"
          />
        </div>

        <div
          className={isSuccess ? 'mt-(--scale-48) w-full' : 'mt-(--scale-48) min-h-0 w-full flex-1'}
        >
          {renderContent()}
        </div>
      </section>
    </aside>
  )
}
