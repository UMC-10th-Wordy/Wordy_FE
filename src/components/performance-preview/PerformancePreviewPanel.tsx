import { PerformanceConvertingNotice } from './PerformanceConvertingNotice'
import { PerformancePreviewResult } from './PerformancePreviewResult'
import { PerformanceQuestionChat } from './PerformanceQuestionChat'
import { PerformanceStatusNotice } from './PerformanceStatusNotice'

import type { PerformanceQuestionChatProps } from './PerformanceQuestionChat'
import type { PerformancePreviewResultData } from '@/types/performancePreviewResult'

import GenerateIcon from '@/assets/icons/generate.svg?react'
import emptyImage from '@/assets/icons/wordy-performance-empty.svg'
import failedImage from '@/assets/icons/wordy-performance-failed.svg'

export type PerformancePreviewStatus = 'empty' | 'converting' | 'questioning' | 'failed' | 'success'

type PerformanceNoticeStatus = Extract<PerformancePreviewStatus, 'empty' | 'failed'>

interface PerformancePreviewPanelBaseProps {
  status?: 'empty' | 'converting' | 'failed'
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
    imageClassName: 'h-[129px] w-[253px]',
    message: '아직 작성된 내용이 없어요\n업무 일지를 작성하고 성과로 변환해 주세요',
  },
  failed: {
    imageSrc: failedImage,
    imageClassName: 'h-[153.77px] w-[253px]',
    message: '성과 생성에 실패했어요\n업무 일지 내용을 보완해 다시 시도해 주세요',
    bottomSpacingClassName: 'pb-(--scale-32)',
  },
} satisfies Record<
  PerformanceNoticeStatus,
  {
    imageSrc: string
    imageClassName: string
    message: string
    bottomSpacingClassName?: string
  }
>

export const PerformancePreviewPanel = (props: PerformancePreviewPanelProps) => {
  const isSuccess = props.status === 'success'
  const isQuestioning = props.status === 'questioning'

  const renderContent = () => {
    if (props.status === 'questioning') {
      return <PerformanceQuestionChat {...props.questionChat} />
    }

    if (props.status === 'success') {
      return <PerformancePreviewResult {...props.result} />
    }

    if (props.status === 'converting') {
      return <PerformanceConvertingNotice />
    }

    const status = props.status ?? 'empty'
    const currentStatusContent = STATUS_CONTENT[status]

    return <PerformanceStatusNotice {...currentStatusContent} />
  }

  return (
    <aside className="order-2 flex h-screen min-w-0 w-full overflow-y-auto bg-(--color-bg-brand-subtle) p-(--scale-40)">
      <section
        className={[
          'flex min-w-0 w-full flex-col rounded-(--scale-16) border-[1.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) px-(--scale-24) py-(--scale-20) shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]',
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
          className={
            isSuccess
              ? 'mt-(--scale-48) w-full min-w-0'
              : isQuestioning
                ? 'mt-(--scale-48) flex min-h-0 w-full min-w-0 flex-1'
                : 'mt-(--scale-48) flex min-h-0 w-full min-w-0 flex-1 items-center justify-center'
          }
        >
          {renderContent()}
        </div>
      </section>
    </aside>
  )
}
