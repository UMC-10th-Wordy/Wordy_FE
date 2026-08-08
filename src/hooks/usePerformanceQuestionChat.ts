import { useCallback, useEffect, useRef, useState } from 'react'

import type {
  PerformanceSupplementAnswer,
  PerformanceSupplementQuestion,
} from '@/types/performance'

export type PerformanceQuestionMessageRole = 'wordy' | 'user'

export interface PerformanceQuestionMessage {
  id: number
  role: PerformanceQuestionMessageRole
  content: string
  isQuestion?: boolean
}

interface UsePerformanceQuestionChatParams {
  isActive: boolean
  questions: PerformanceSupplementQuestion[]
  onFinish: (answers: PerformanceSupplementAnswer[]) => void
}

const QUESTION_TYPING_DELAY_MS = 1200
const RETURN_TO_CONVERTING_DELAY_MS = 3000

const INITIAL_WORDY_MESSAGE =
  '반가워요!\n더 의미있는 성과를 도출하기 위해 몇 가지 질문을 드리려고 해요.\n다음 질문에 대한 내용을 입력해 주세요!'

export const usePerformanceQuestionChat = ({
  isActive,
  questions,
  onFinish,
}: UsePerformanceQuestionChatParams) => {
  const [messages, setMessages] = useState<PerformanceQuestionMessage[]>([])
  const [answer, setAnswer] = useState('')
  const [submittedAnswers, setSubmittedAnswers] = useState<PerformanceSupplementAnswer[]>([])
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
    messageIdRef.current += 1

    const nextMessage: PerformanceQuestionMessage = {
      ...message,
      id: messageIdRef.current,
    }

    setMessages((previousMessages) => [...previousMessages, nextMessage])

    return nextMessage.id
  }, [])

  const finishQuestioning = useCallback(
    (answers: PerformanceSupplementAnswer[]) => {
      setIsFinished(true)
      setLatestQuestionMessageId(null)

      const finishTimer = setTimeout(() => {
        onFinish(answers)
      }, RETURN_TO_CONVERTING_DELAY_MS)

      timersRef.current.push(finishTimer)
    },
    [onFinish],
  )

  const showQuestion = useCallback(
    (questionIndex: number, answers: PerformanceSupplementAnswer[]) => {
      if (questionIndex >= questions.length) {
        finishQuestioning(answers)
        return
      }

      setIsWordyTyping(true)

      const typingTimer = setTimeout(() => {
        const currentQuestion = questions[questionIndex]

        setIsWordyTyping(false)
        setCurrentQuestionIndex(questionIndex)

        const questionMessageId = appendMessage({
          role: 'wordy',
          content: currentQuestion.question,
          isQuestion: true,
        })

        setLatestQuestionMessageId(questionMessageId)
      }, QUESTION_TYPING_DELAY_MS)

      timersRef.current.push(typingTimer)
    },
    [appendMessage, finishQuestioning, questions],
  )

  const startQuestioning = useCallback(() => {
    clearTimers()

    setMessages([])
    setAnswer('')
    setSubmittedAnswers([])
    setIsWordyTyping(false)
    setCurrentQuestionIndex(0)
    setLatestQuestionMessageId(null)
    setIsFinished(false)

    messageIdRef.current = 0

    appendMessage({
      role: 'wordy',
      content: INITIAL_WORDY_MESSAGE,
    })

    showQuestion(0, [])
  }, [appendMessage, clearTimers, showQuestion])

  const handleChangeAnswer = useCallback((value: string) => {
    setAnswer(value)
  }, [])

  const handleSubmitAnswer = useCallback(() => {
    const trimmedAnswer = answer.trim()
    const currentQuestion = questions[currentQuestionIndex]

    if (!trimmedAnswer || !currentQuestion || isWordyTyping || isFinished) {
      return
    }

    appendMessage({
      role: 'user',
      content: trimmedAnswer,
    })

    const nextAnswers: PerformanceSupplementAnswer[] = [
      ...submittedAnswers,
      {
        aiQuestionId: currentQuestion.aiQuestionId,
        question: currentQuestion.question,
        answer: trimmedAnswer,
      },
    ]

    setSubmittedAnswers(nextAnswers)
    setAnswer('')
    setLatestQuestionMessageId(null)

    showQuestion(currentQuestionIndex + 1, nextAnswers)
  }, [
    answer,
    appendMessage,
    currentQuestionIndex,
    isFinished,
    isWordyTyping,
    questions,
    showQuestion,
    submittedAnswers,
  ])

  const handleSkipQuestion = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex]

    if (!currentQuestion || isWordyTyping || isFinished) {
      return
    }

    appendMessage({
      role: 'user',
      content: '건너뛰기',
    })

    const nextAnswers: PerformanceSupplementAnswer[] = [
      ...submittedAnswers,
      {
        aiQuestionId: currentQuestion.aiQuestionId,
        question: currentQuestion.question,
        answer: '',
      },
    ]

    setSubmittedAnswers(nextAnswers)
    setAnswer('')
    setLatestQuestionMessageId(null)

    showQuestion(currentQuestionIndex + 1, nextAnswers)
  }, [
    appendMessage,
    currentQuestionIndex,
    isFinished,
    isWordyTyping,
    questions,
    showQuestion,
    submittedAnswers,
  ])

  const resetQuestionChat = useCallback(() => {
    clearTimers()

    setMessages([])
    setAnswer('')
    setSubmittedAnswers([])
    setIsWordyTyping(false)
    setCurrentQuestionIndex(0)
    setLatestQuestionMessageId(null)
    setIsFinished(false)

    hasStartedRef.current = false
    messageIdRef.current = 0
  }, [clearTimers])

  useEffect(() => {
    if (!isActive || hasStartedRef.current || questions.length === 0) {
      return
    }

    hasStartedRef.current = true
    startQuestioning()
  }, [isActive, questions.length, startQuestioning])

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
    onChangeAnswer: handleChangeAnswer,
    onSubmitAnswer: handleSubmitAnswer,
    onSkipQuestion: handleSkipQuestion,
    resetQuestionChat,
  }
}
