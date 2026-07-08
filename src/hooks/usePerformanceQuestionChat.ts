import { useCallback, useEffect, useRef, useState } from 'react'

export type PerformanceQuestionMessageRole = 'wordy' | 'user'

export interface PerformanceQuestionMessage {
  id: number
  role: PerformanceQuestionMessageRole
  content: string
  isQuestion?: boolean
}

interface UsePerformanceQuestionChatParams {
  isActive: boolean
  onFinish: () => void
}

const MAX_QUESTION_COUNT = 2
const QUESTION_TYPING_DELAY_MS = 1200
const RETURN_TO_CONVERTING_DELAY_MS = 3000

const INITIAL_WORDY_MESSAGE =
  '반가워요!\n더 의미있는 성과를 도출하기 위해 몇 가지 질문을 드리려고 해요.\n다음 질문에 대한 내용을 입력해 주세요!'

// TODO(#20): AI 추가 질문 API 연동 시 응답 데이터로 교체
// 더미데이터
const MOCK_PERFORMANCE_QUESTIONS = [
  '유선 연락 20건’이라고 적어주셨는데, 요청에 응한 파트너사는 몇 곳이었나요?',
  '이번 업무를 통해 배운 점은 무엇인가요?',
] as const

export const usePerformanceQuestionChat = ({
  isActive,
  onFinish,
}: UsePerformanceQuestionChatParams) => {
  const [messages, setMessages] = useState<PerformanceQuestionMessage[]>([])
  const [answer, setAnswer] = useState('')
  const [isWordyTyping, setIsWordyTyping] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [latestQuestionMessageId, setLatestQuestionMessageId] = useState<number | null>(null)
  const [isFinished, setIsFinished] = useState(false)

  const messageIdRef = useRef(0)
  const hasStartedRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer))
    timersRef.current = []
  }, [])

  const appendMessage = useCallback((message: Omit<PerformanceQuestionMessage, 'id'>) => {
    const nextMessage = {
      ...message,
      id: messageIdRef.current + 1,
    }

    messageIdRef.current += 1
    setMessages((prevMessages) => [...prevMessages, nextMessage])

    return nextMessage.id
  }, [])

  const finishQuestioning = useCallback(() => {
    setIsFinished(true)
    setLatestQuestionMessageId(null)

    const finishTimer = setTimeout(() => {
      onFinish()
    }, RETURN_TO_CONVERTING_DELAY_MS)

    timersRef.current.push(finishTimer)
  }, [onFinish])

  const showQuestion = useCallback(
    (questionIndex: number) => {
      if (questionIndex >= MAX_QUESTION_COUNT) {
        finishQuestioning()
        return
      }

      setIsWordyTyping(true)

      const typingTimer = setTimeout(() => {
        setIsWordyTyping(false)
        setCurrentQuestionIndex(questionIndex)

        const questionMessageId = appendMessage({
          role: 'wordy',
          content: MOCK_PERFORMANCE_QUESTIONS[questionIndex],
          isQuestion: true,
        })

        setLatestQuestionMessageId(questionMessageId)
      }, QUESTION_TYPING_DELAY_MS)

      timersRef.current.push(typingTimer)
    },
    [appendMessage, finishQuestioning],
  )
  const startQuestioning = useCallback(() => {
    clearTimers()
    setMessages([])
    setAnswer('')
    setIsWordyTyping(false)
    setCurrentQuestionIndex(0)
    setLatestQuestionMessageId(null)
    setIsFinished(false)
    messageIdRef.current = 0

    appendMessage({
      role: 'wordy',
      content: INITIAL_WORDY_MESSAGE,
    })

    showQuestion(0)
  }, [appendMessage, clearTimers, showQuestion])

  const handleChangeAnswer = useCallback((value: string) => {
    setAnswer(value)
  }, [])

  const handleSubmitAnswer = useCallback(() => {
    const trimmedAnswer = answer.trim()

    if (!trimmedAnswer || isWordyTyping || isFinished) {
      return
    }

    appendMessage({
      role: 'user',
      content: trimmedAnswer,
    })

    setAnswer('')
    setLatestQuestionMessageId(null)

    const nextQuestionIndex = currentQuestionIndex + 1
    showQuestion(nextQuestionIndex)
  }, [answer, appendMessage, currentQuestionIndex, isFinished, isWordyTyping, showQuestion])

  const handleSkipQuestion = useCallback(() => {
    if (isWordyTyping || isFinished) {
      return
    }
    setAnswer('')
    setLatestQuestionMessageId(null)

    const nextQuestionIndex = currentQuestionIndex + 1
    showQuestion(nextQuestionIndex)
  }, [currentQuestionIndex, isFinished, isWordyTyping, showQuestion])

  const resetQuestionChat = useCallback(() => {
    clearTimers()
    setMessages([])
    setAnswer('')
    setIsWordyTyping(false)
    setCurrentQuestionIndex(0)
    setLatestQuestionMessageId(null)
    setIsFinished(false)
    hasStartedRef.current = false
    messageIdRef.current = 0
  }, [clearTimers])

  useEffect(() => {
    if (!isActive || hasStartedRef.current) {
      return
    }
    hasStartedRef.current = true
    startQuestioning()
  }, [isActive, startQuestioning])

  useEffect(() => {
    return () => {
      clearTimers()
      hasStartedRef.current = false
    }
  }, [clearTimers])
  return {
    messages,
    answer,
    isWordyTyping,
    isFinished,
    latestQuestionMessageId,
    handleChangeAnswer,
    handleSubmitAnswer,
    handleSkipQuestion,
    resetQuestionChat,
  }
}
