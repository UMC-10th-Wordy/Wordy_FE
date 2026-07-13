import { useState } from 'react'

import { IconButton } from '@/components/common/Button/IconButton'
import { Input2 } from '@/components/common/Input/Input2'

import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'

import SendIcon from '@/assets/icons/send.svg?react'

interface PerformanceChatInputProps {
  answer: string
  disabled?: boolean
  onChangeAnswer: (value: string) => void
  onSubmitAnswer: () => void
}

const CHAT_INPUT_LAYER_MIN_HEIGHT = 53
const CHAT_INPUT_LAYER_MAX_HEIGHT = 112

const CHAT_INPUT_DEFAULT_VERTICAL_PADDING = 24
const CHAT_INPUT_MAX_HEIGHT_VERTICAL_PADDING = 12

const CHAT_INPUT_TEXTAREA_MIN_HEIGHT =
  CHAT_INPUT_LAYER_MIN_HEIGHT - CHAT_INPUT_DEFAULT_VERTICAL_PADDING

const CHAT_INPUT_TEXTAREA_MAX_HEIGHT =
  CHAT_INPUT_LAYER_MAX_HEIGHT - CHAT_INPUT_MAX_HEIGHT_VERTICAL_PADDING

export const PerformanceChatInput = ({
  answer,
  disabled = false,
  onChangeAnswer,
  onSubmitAnswer,
}: PerformanceChatInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [inputHeight, setInputHeight] = useState(CHAT_INPUT_LAYER_MIN_HEIGHT)
  const [textareaHeight, setTextareaHeight] = useState(CHAT_INPUT_TEXTAREA_MIN_HEIGHT)

  const isSubmitDisabled = disabled || !answer.trim()
  const isMaxHeight = inputHeight >= CHAT_INPUT_LAYER_MAX_HEIGHT

  const handleChangeAnswer = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChangeAnswer(event.target.value)
  }

  const handleInputAnswer = (event: FormEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget

    textarea.style.height = `${CHAT_INPUT_TEXTAREA_MIN_HEIGHT}px`

    const textareaVerticalPadding = inputHeight === CHAT_INPUT_LAYER_MIN_HEIGHT ? 8 : 0

    const contentHeight = textarea.value
      ? textarea.scrollHeight - textareaVerticalPadding
      : CHAT_INPUT_TEXTAREA_MIN_HEIGHT

    const nextTextareaHeight = Math.min(
      Math.max(contentHeight, CHAT_INPUT_TEXTAREA_MIN_HEIGHT),
      CHAT_INPUT_TEXTAREA_MAX_HEIGHT,
    )

    const nextInputHeight = Math.min(
      nextTextareaHeight + CHAT_INPUT_DEFAULT_VERTICAL_PADDING,
      CHAT_INPUT_LAYER_MAX_HEIGHT,
    )

    textarea.style.height = `${nextTextareaHeight}px`

    setTextareaHeight(nextTextareaHeight)
    setInputHeight(nextInputHeight)
  }

  const handleSubmitAnswer = () => {
    if (isSubmitDisabled) {
      return
    }

    setInputHeight(CHAT_INPUT_LAYER_MIN_HEIGHT)
    setTextareaHeight(CHAT_INPUT_TEXTAREA_MIN_HEIGHT)
    onSubmitAnswer()
  }

  const handleKeyDownAnswer = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }

    event.preventDefault()
    handleSubmitAnswer()
  }

  return (
    <div className="flex shrink-0 items-end gap-(--scale-16) py-(--scale-12)">
      <div className="min-w-0 flex-1" style={{ height: inputHeight }}>
        <Input2
          value={answer}
          disabled={disabled}
          placeholder={isFocused ? '' : '답변을 작성해 주세요.'}
          rows={1}
          onChange={handleChangeAnswer}
          onInput={handleInputAnswer}
          onKeyDown={handleKeyDownAnswer}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={[
            '!h-full !min-h-[53px] !max-h-[112px] w-full overflow-hidden',
            isMaxHeight
              ? '![padding-top:0px] ![padding-bottom:12px]'
              : '![padding-top:12px] ![padding-bottom:12px]',
            'border-[0.5px] border-(--color-border-brand-subtle)',
            'bg-(--color-bg-brand-subtle)',
            'focus-within:border-(--color-border-brand)',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            height: textareaHeight,
            minHeight: CHAT_INPUT_TEXTAREA_MIN_HEIGHT,
            maxHeight: CHAT_INPUT_TEXTAREA_MAX_HEIGHT,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            lineHeight: '21px',
            caretColor: '#5D5DF1',
            paddingTop: inputHeight === CHAT_INPUT_LAYER_MIN_HEIGHT ? 4 : 0,
            paddingBottom: inputHeight === CHAT_INPUT_LAYER_MIN_HEIGHT ? 4 : 0,
            boxSizing: 'border-box',
            flex: 'none',
            cursor: disabled ? 'default' : undefined,
          }}
        />
      </div>

      <IconButton
        type="button"
        variant="fill"
        size="large"
        icon={
          <SendIcon
            aria-hidden
            className="size-(--scale-40) [&_*]:fill-current [&_*]:stroke-current"
          />
        }
        aria-label="답변 전송"
        disabled={isSubmitDisabled}
        onClick={handleSubmitAnswer}
        className={[
          'shrink-0',
          'disabled:!cursor-default',
          'disabled:!bg-(--color-button-disabled)',
          'disabled:!text-(--color-icon-disabled)',
          'disabled:!opacity-100',
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  )
}
