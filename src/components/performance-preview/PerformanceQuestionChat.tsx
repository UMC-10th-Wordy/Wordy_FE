import { useEffect, useRef } from 'react'

import { PerformanceChatBubble } from './PerformanceChatBubble'
import { PerformanceChatInput } from './PerformanceChatInput'
import { PerformanceTypingIndicator } from './PerformanceTypingIndicator'

import type { PerformanceQuestionMessage } from '@/hooks/usePerformanceQuestionChat'

export interface PerformanceQuestionChatProps {
  messages: PerformanceQuestionMessage[]
  answer: string
  isWordyTyping: boolean
  isFinished: boolean
  latestQuestionMessageId: number | null
  onChangeAnswer: (value: string) => void
  onSubmitAnswer: () => void
  onSkipQuestion: () => void
}

export const PerformanceQuestionChat = ({
  messages,
  answer,
  isWordyTyping,
  isFinished,
  latestQuestionMessageId,
  onChangeAnswer,
  onSubmitAnswer,
  onSkipQuestion,
}: PerformanceQuestionChatProps) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const lastMessage = messages[messages.length - 1]
  const showTypingProfile = lastMessage?.role !== 'wordy'

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isWordyTyping])

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="min-h-0 w-full flex-1 overflow-y-auto pb-(--scale-48) [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-full flex-col">
          {messages.map((message, index) => {
            const previousMessage = messages[index - 1]

            const showProfile = message.role === 'wordy' && previousMessage?.role !== 'wordy'

            const messageGapClass =
              index === 0
                ? ''
                : previousMessage?.role !== message.role
                  ? 'mt-[28px]'
                  : 'mt-(--scale-16)'

            const shouldShowSkipButton =
              message.role === 'wordy' &&
              message.isQuestion === true &&
              message.id === latestQuestionMessageId &&
              !isWordyTyping

            return (
              <div key={message.id} className={messageGapClass}>
                <PerformanceChatBubble
                  message={message}
                  shouldShowSkipButton={shouldShowSkipButton}
                  showProfile={showProfile}
                  onSkipQuestion={onSkipQuestion}
                />
              </div>
            )
          })}

          {isWordyTyping && (
            <div className={lastMessage?.role === 'user' ? 'mt-[28px]' : 'mt-(--scale-16)'}>
              <PerformanceTypingIndicator showProfile={showTypingProfile} />
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      <PerformanceChatInput
        answer={answer}
        disabled={isWordyTyping || isFinished}
        onChangeAnswer={onChangeAnswer}
        onSubmitAnswer={onSubmitAnswer}
      />
    </div>
  )
}
