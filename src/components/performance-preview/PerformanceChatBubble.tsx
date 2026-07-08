import { TextButton } from '@/components/common/Button/TextButton'

import type { PerformanceQuestionMessage } from '@/hooks/usePerformanceQuestionChat'

import wordyProfileImage from '@/assets/icons/wordy-profile.svg'

interface PerformanceChatBubbleProps {
  message: PerformanceQuestionMessage
  shouldShowSkipButton: boolean
  showProfile: boolean
  onSkipQuestion: () => void
}

export const PerformanceChatBubble = ({
  message,
  shouldShowSkipButton,
  showProfile,
  onSkipQuestion,
}: PerformanceChatBubbleProps) => {
  const isUserMessage = message.role === 'user'

  return (
    <div
      className={['flex w-full', isUserMessage ? 'justify-end' : 'justify-start gap-(--scale-8)']
        .filter(Boolean)
        .join(' ')}
    >
      {!isUserMessage &&
        (showProfile ? (
          <img
            src={wordyProfileImage}
            alt="Wordy 프로필"
            className="size-(--scale-48) shrink-0 rounded-full"
          />
        ) : (
          <div className="size-(--scale-48) shrink-0" aria-hidden />
        ))}

      <div
        className={['flex flex-col gap-(--scale-16)', isUserMessage ? 'items-end' : 'items-start']
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            'max-w-[500px] min-h-[61px] p-(--scale-16)',
            '[font-size:var(--font-size-body-2)] leading-(--line-height-body)',
            'font-[var(--font-weight-regular)] whitespace-pre-line break-words',
            isUserMessage
              ? 'rounded-tl-(--scale-16) rounded-tr-(--scale-4) rounded-br-(--scale-16) rounded-bl-(--scale-16) bg-(--color-bg-tertiary) text-(--color-text-default)'
              : 'rounded-tl-(--scale-4) rounded-tr-(--scale-16) rounded-br-(--scale-16) rounded-bl-(--scale-16) bg-(--color-bg-brand-light) text-(--color-text-default)',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {message.content}
        </div>

        {shouldShowSkipButton && (
          <TextButton
            variant="stroke"
            size="medium"
            className="w-[139px] [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-[var(--font-weight-medium)]"
            onClick={onSkipQuestion}
          >
            질문을 건너뛸래요
          </TextButton>
        )}
      </div>
    </div>
  )
}
