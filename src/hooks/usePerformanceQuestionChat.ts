import { useCallback, useEffect, useRef, useState } from 'react'

import {
  clearPerformanceQuestionChatSession,
  getPerformanceQuestionChatSession,
  setPerformanceQuestionChatSession,
} from '@/utils/performance-preview/performanceQuestionChatSession'

import type { PerformanceQuestionChatMessage } from '@/utils/performance-preview/performanceQuestionChatSession'
import type {
  PerformanceSupplementAnswer,
  PerformanceSupplementQuestion,
} from '@/types/performance'

export type PerformanceQuestionMessage = PerformanceQuestionChatMessage

interface UsePerformanceQuestionChatParams {
  entryDate: string
  isActive: boolean
  questions: PerformanceSupplementQuestion[]
  onFinish: (answers: PerformanceSupplementAnswer[]) => void
}

const QUESTION_TYPING_DELAY_MS = 1200
const RETURN_TO_CONVERTING_DELAY_MS = 1000

const INITIAL_WORDY_MESSAGE =
  '반가워요!\n더 의미있는 성과를 도출하기 위해 몇 가지 질문을 드리려고 해요.\n다음 질문에 대한 내용을 입력해 주세요!'

export const usePerformanceQuestionChat = ({
  entryDate,
  isActive,
  questions,
  onFinish,
}: UsePerformanceQuestionChatParams) => {
  const [initialSession] = useState(() => getPerformanceQuestionChatSession(entryDate))

  const [messages, setMessages] = useState<PerformanceQuestionMessage[]>(
    () => initialSession?.messages ?? [],
  )
  const [answer, setAnswer] = useState(() => initialSession?.answer ?? '')
  const [submittedAnswers, setSubmittedAnswers] = useState<PerformanceSupplementAnswer[]>(
    () => initialSession?.submittedAnswers ?? [],
  )
  const [isWordyTyping, setIsWordyTyping] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    () => initialSession?.currentQuestionIndex ?? 0,
  )
  const [latestQuestionMessageId, setLatestQuestionMessageId] = useState<number | null>(
    () => initialSession?.latestQuestionMessageId ?? null,
  )
  const [isFinished, setIsFinished] = useState(() => initialSession?.isFinished ?? false)

  const messageIdRef = useRef(
    initialSession?.messages.reduce((maxId, message) => Math.max(maxId, message.id), 0) ?? 0,
  )
  const hasStartedRef = useRef(Boolean(initialSession))
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const activeEntryDateRef = useRef(entryDate)
  const initialSessionRestoredRef = useRef(false)

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

      const targetEntryDate = activeEntryDateRef.current

      const finishTimer = setTimeout(() => {
        clearPerformanceQuestionChatSession(targetEntryDate)
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

        if (!currentQuestion) {
          return
        }

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
    hasStartedRef.current = true

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

    clearPerformanceQuestionChatSession(activeEntryDateRef.current)
  }, [clearTimers])

  const restoreQuestionChat = useCallback(
    (nextEntryDate: string) => {
      clearTimers()
      activeEntryDateRef.current = nextEntryDate

      const session = getPerformanceQuestionChatSession(nextEntryDate)

      if (!session) {
        initialSessionRestoredRef.current = false

        setMessages([])
        setAnswer('')
        setSubmittedAnswers([])
        setIsWordyTyping(false)
        setCurrentQuestionIndex(0)
        setLatestQuestionMessageId(null)
        setIsFinished(false)

        hasStartedRef.current = false
        messageIdRef.current = 0

        return
      }

      initialSessionRestoredRef.current = true

      setMessages(session.messages)
      setAnswer(session.answer)
      setSubmittedAnswers(session.submittedAnswers)
      setIsWordyTyping(false)
      setCurrentQuestionIndex(session.currentQuestionIndex)
      setLatestQuestionMessageId(session.latestQuestionMessageId)
      setIsFinished(session.isFinished)

      hasStartedRef.current = true

      messageIdRef.current = session.messages.reduce(
        (maxId, message) => Math.max(maxId, message.id),
        0,
      )

      if (session.isFinished) {
        finishQuestioning(session.submittedAnswers)
        return
      }

      if (session.latestQuestionMessageId === null) {
        showQuestion(session.submittedAnswers.length, session.submittedAnswers)
      }
    },
    [clearTimers, finishQuestioning, showQuestion],
  )

  useEffect(() => {
    if (!isActive) {
      return
    }

    setPerformanceQuestionChatSession(activeEntryDateRef.current, {
      messages,
      answer,
      submittedAnswers,
      currentQuestionIndex,
      latestQuestionMessageId,
      isFinished,
    })
  }, [
    answer,
    currentQuestionIndex,
    isActive,
    isFinished,
    latestQuestionMessageId,
    messages,
    submittedAnswers,
  ])

  useEffect(() => {
    if (!isActive || questions.length === 0) {
      return
    }

    const timer = setTimeout(() => {
      const currentSession = getPerformanceQuestionChatSession(entryDate)

      if (currentSession && !initialSessionRestoredRef.current) {
        initialSessionRestoredRef.current = true
        activeEntryDateRef.current = entryDate

        if (currentSession.isFinished) {
          finishQuestioning(currentSession.submittedAnswers)
          return
        }

        if (currentSession.latestQuestionMessageId === null) {
          showQuestion(currentSession.submittedAnswers.length, currentSession.submittedAnswers)
        }

        return
      }

      if (hasStartedRef.current) {
        return
      }

      startQuestioning()
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [entryDate, finishQuestioning, isActive, questions.length, showQuestion, startQuestioning])

  useEffect(() => {
    return () => {
      clearTimers()
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
    restoreQuestionChat,
  }
}
