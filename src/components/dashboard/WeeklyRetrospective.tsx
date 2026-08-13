import { useState, useEffect, useMemo } from 'react'
import { Input2 } from '@/components/common/Input/Input2'
import { TextButton } from '@/components/common/Button/TextButton'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/common/Toast/ToastContainer'
import EditIcon from '@/assets/icons/edit.svg?react'
import TrashIcon from '@/assets/icons/trash.svg?react'
import CheckIcon from '@/assets/icons/check-bold.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import {
  createMonthlyReflection,
  createReflection,
  updateMonthlyReflection,
  updateReflection,
} from '@/api/dashboard/dashboard'
import { saveDraft, getDraft } from '@/api/dashboard/dashboard'

interface PlanRow {
  id: string
  content: string
  schedule: string
}

type RetrospectivePeriod = 'weekly' | 'monthly'

interface RetrospectiveQuestion {
  key: 'work' | 'resource' | 'learning'
  label: string
  placeholder: string
}

interface RetrospectiveTexts {
  title: string
  description: string
  questions: RetrospectiveQuestion[]
  planLabel: string
  planPlaceholder: string
  schedulePlaceholder: string
  toastTempSaved: string
  toastSaved: string
}

const TEXTS: Record<RetrospectivePeriod, RetrospectiveTexts> = {
  weekly: {
    title: '주간 회고',
    description: '이번 주를 정리하고 다음 주를 준비해보세요!',
    questions: [
      {
        key: 'work',
        label: '이번 주의 업무 내용 정리',
        placeholder: '이번 주 진행한 주요 업무를 자유롭게 정리해 주세요',
      },
      {
        key: 'resource',
        label: '이번 주에 주로 사용한 시간 또는 리소스',
        placeholder: '어떤 일에 시간이 가장 많이 들어갔나요?',
      },
      {
        key: 'learning',
        label: '이번 주에 배우고 느낀 점',
        placeholder: '새로 배운 점, 깨달은 점, 다음에 다르게 해보고 싶은 점이 있나요?',
      },
    ],
    planLabel: '다음 주 업무 계획',
    planPlaceholder: '다음 주 진행할 업무 내용을 작성해 주세요',
    schedulePlaceholder: '예) 다음 주 월요일',
    toastTempSaved: '주간 회고가 임시 저장되었어요',
    toastSaved: '주간 회고가 저장되었어요',
  },
  monthly: {
    title: '월간 회고',
    description: '이번 달을 정리하고 다음 달을 준비해보세요!',
    questions: [
      {
        key: 'work',
        label: '이번 달의 업무 내용 정리',
        placeholder: '이번 달 진행한 주요 업무를 자유롭게 정리해 주세요',
      },
      {
        key: 'resource',
        label: '이번 달에 주로 사용한 시간 또는 리소스',
        placeholder: '어떤 일에 시간이 가장 많이 들어갔나요?',
      },
      {
        key: 'learning',
        label: '이번 달에 배우고 느낀 점',
        placeholder: '새로 배운 점, 깨달은 점, 다음에 다르게 해보고 싶은 점이 있나요?',
      },
    ],
    planLabel: '다음 달 업무 계획',
    planPlaceholder: '다음 달 진행할 업무 내용을 작성해 주세요',
    schedulePlaceholder: '예) 다음 달 중순',
    toastTempSaved: '월간 회고가 임시 저장되었어요',
    toastSaved: '월간 회고가 저장되었어요',
  },
}

type QuestionKey = 'work' | 'resource' | 'learning'

interface WeeklyRetrospectiveProps {
  period?: RetrospectivePeriod
  dashboardId?: string
  workspaceId: string
  initialReflection?: {
    reflectionId: string
    workSummary: string
    resourcesUsed: string
    learning: string
  }
  onSaved?: () => void
}

export const WeeklyRetrospective = ({
  period = 'weekly',
  dashboardId,
  workspaceId,
  initialReflection,
  onSaved,
}: WeeklyRetrospectiveProps) => {
  const texts = TEXTS[period]

  const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
    work: '',
    resource: '',
    learning: '',
  })

  const [plans, setPlans] = useState<PlanRow[]>([])
  const { toasts, addToast } = useToast()

  useEffect(() => {
    if (!workspaceId) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlans([])
    let cancelled = false
    getDraft(workspaceId, period === 'monthly' ? 'MONTHLY' : 'WEEKLY', dashboardId)
      .then((draft) => {
        if (cancelled || !draft) return
        if (!initialReflection) {
          setAnswers({
            work: draft.workSummary,
            resource: draft.resourcesUsed,
            learning: draft.learning,
          })
        }
        setPlans(
          draft.taskPlans.map((tp, i) => ({
            id: `draft-${i}`,
            content: tp.content,
            schedule: tp.expectedTime,
          })),
        )
      })
      .catch(() => {
        if (!cancelled) addToast('임시 저장된 내용을 불러오지 못했어요')
      })
    return () => {
      cancelled = true
    }
  }, [workspaceId, period, dashboardId, addToast])

  const [editing, setEditing] = useState<{ id: string; content: string; schedule: string } | null>(
    null,
  )
  const [reflectionId, setReflectionId] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  // dashboardId나 initialReflection이 바뀌면 화면 무조건 강제 리셋
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers({
      work: initialReflection?.workSummary ?? '',
      resource: initialReflection?.resourcesUsed ?? '',
      learning: initialReflection?.learning ?? '',
    })
    setPlans([])
    setEditing(null)
    setReflectionId(initialReflection?.reflectionId ?? null)
    setSavedAt(null)

    if (!workspaceId || !dashboardId) return

    let cancelled = false
    getDraft(workspaceId, period === 'monthly' ? 'MONTHLY' : 'WEEKLY', dashboardId)
      .then((draft) => {
        if (cancelled || !draft) return

        // draft 내용이 들어올 때만 업데이트
        if (!initialReflection && (draft.workSummary || draft.resourcesUsed || draft.learning)) {
          setAnswers({
            work: draft.workSummary ?? '',
            resource: draft.resourcesUsed ?? '',
            learning: draft.learning ?? '',
          })
        }
        if (draft.taskPlans && draft.taskPlans.length > 0) {
          setPlans(
            draft.taskPlans.map((tp, i) => ({
              id: `draft-${i}`,
              content: tp.content,
              schedule: tp.expectedTime,
            })),
          )
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [
    workspaceId,
    period,
    dashboardId,
    initialReflection?.reflectionId,
    initialReflection?.workSummary,
    initialReflection?.resourcesUsed,
    initialReflection?.learning,
  ])

  const resolvedReflectionId = useMemo(() => {
    if (initialReflection?.reflectionId) return initialReflection.reflectionId
    return reflectionId
  }, [dashboardId, initialReflection?.reflectionId, reflectionId])

  const [isSaving, setIsSaving] = useState(false)
  // 백엔드가 회고 조회/생성 응답에 id를 내려주지 않아 재저장 시 수정 대신 중복 생성되는 것을 막기 위해,
  // 이미 저장된 회고(initialReflection)이거나 이번 세션에서 저장에 성공하면 폼을 잠금
  const [locked, setLocked] = useState(Boolean(initialReflection))

  const handleAnswerChange = (key: QuestionKey, value: string) => {
    if (value.length > 800) return
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const handleAddRow = () => {
    if (editing) return
    setEditing({ id: `new-${Date.now()}`, content: '', schedule: '' })
  }

  const handleConfirmRow = () => {
    if (!editing || !editing.content.trim()) return
    setPlans((prev) => {
      const exists = prev.some((p) => p.id === editing.id)
      return exists ? prev.map((p) => (p.id === editing.id ? editing : p)) : [...prev, editing]
    })
    setEditing(null)
  }

  const handleEditRow = (row: PlanRow) => {
    if (editing) return
    setEditing({ ...row })
  }
  const handleDeleteRow = (id: string) => setPlans((prev) => prev.filter((p) => p.id !== id))

  const handleTempSave = () => {
    saveDraft(workspaceId, period === 'monthly' ? 'MONTHLY' : 'WEEKLY', dashboardId, {
      workSummary: answers.work,
      resourcesUsed: answers.resource,
      learning: answers.learning,
      taskPlans: plans.map((p) => ({ content: p.content, expectedTime: p.schedule })),
    })
      .then(() => {
        setSavedAt(new Date().toLocaleString('ko-KR'))
        addToast(texts.toastTempSaved)
      })
      .catch(() => addToast('임시 저장에 실패했어요'))
  }

  const handleSave = () => {
    if (isSaving) return
    if (!dashboardId) {
      addToast(texts.toastSaved)
      return
    }
    setIsSaving(true)
    const request =
      period === 'monthly'
        ? resolvedReflectionId
          ? updateMonthlyReflection(workspaceId, dashboardId, resolvedReflectionId, {
              workSummary: answers.work,
              resourcesUsed: answers.resource,
              learning: answers.learning,
            }).then(() => resolvedReflectionId)
          : createMonthlyReflection(workspaceId, dashboardId, {
              workSummary: answers.work,
              resourcesUsed: answers.resource,
              learning: answers.learning,
            }).then((res) => res.weeklyReflectionId)
        : resolvedReflectionId
          ? updateReflection(workspaceId, dashboardId, resolvedReflectionId, {
              workSummary: answers.work,
              resourcesUsed: answers.resource,
              learning: answers.learning,
            })
          : createReflection(workspaceId, dashboardId, {
              workSummary: answers.work,
              resourcesUsed: answers.resource,
              learning: answers.learning,
            })
    request
      .then((id) => {
        setReflectionId((prev) => prev ?? id)
        setLocked(true)
        addToast(texts.toastSaved)
        onSaved?.()
      })
      .catch((error) => {
        console.error('회고 저장 실패:', error)
        addToast('저장에 실패했어요. 다시 시도해 주세요')
      })
      .finally(() => setIsSaving(false))
  }
  const hasContent = Object.values(answers).some((v) => v.trim()) || plans.length > 0
  const canSave = hasContent && !editing && !locked

  const editingIndex = editing
    ? plans.findIndex((p) => p.id === editing.id) === -1
      ? plans.length + 1
      : plans.findIndex((p) => p.id === editing.id) + 1
    : 0

  return (
    <section className="flex flex-col gap-6 rounded-2xl border bg-(--color-bg-default) p-7 border-(--color-border-brand-subtle) shadow-[0px_1px_5px_0px_#0000001A]">
      <div className="flex flex-col gap-1">
        <h2 className="[font-size:var(--font-size-body-1)] leading-[1.6] font-semibold text-(--color-text-default)">
          {texts.title}
        </h2>
        <p className="[font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-tertiary)">
          {texts.description}
        </p>
      </div>

      {texts.questions.map((q, i) => (
        <div key={q.key} className="flex flex-col gap-3">
          <p
            id={`retro-label-${period}-${q.key}`}
            className="[font-size:var(--font-size-body-3)] font-bold text-(--color-text-default)"
          >
            <span className="mr-2 text-(--color-text-brand)">{String(i + 1).padStart(2, '0')}</span>
            {q.label}
          </p>
          <Input2
            maxCharacter={800}
            maxLength={800}
            aria-labelledby={`retro-label-${period}-${q.key}`}
            placeholder={q.placeholder}
            value={answers[q.key]}
            onChange={(e) => handleAnswerChange(q.key, e.target.value)}
            disabled={locked}
          />
        </div>
      ))}

      <div className="flex flex-col gap-3">
        <p className="[font-size:var(--font-size-body-3)] font-bold text-(--color-text-default)">
          <span className="mr-2 text-(--color-text-brand)">04</span>
          {texts.planLabel}
        </p>

        <div className="grid grid-cols-[1.4fr_1fr_92px] items-center gap-x-4 rounded-md bg-(--color-bg-brand-light) py-3 pl-5 [font-size:var(--font-size-body-4)] font-medium text-(--color-text-default)">
          <span>업무 내용</span>
          <span>예상 시점</span>
          <span />
        </div>

        {plans.map((row, i) =>
          editing?.id === row.id ? null : (
            <div
              key={row.id}
              className="group grid min-h-[60px] grid-cols-[1.4fr_1fr_92px] items-center gap-x-4 border-b border-(--color-border-subtle) pl-5 [font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-default)"
            >
              <span className="flex min-w-0 items-center gap-4">
                <span className="text-(--color-text-tertiary)">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 break-words">{row.content}</span>
              </span>
              <span className="min-w-0 break-words">{row.schedule}</span>
              <span className="flex justify-end gap-1 opacity-0 transition-opacity duration-100 ease-out group-hover:opacity-100 group-focus-within:opacity-100">
                <button
                  type="button"
                  aria-label="수정"
                  onClick={() => handleEditRow(row)}
                  className="flex size-11 items-center justify-center rounded-lg"
                >
                  <EditIcon width={24} height={24} className="text-(--color-icon-secondary)" />
                </button>
                <button
                  type="button"
                  aria-label="삭제"
                  onClick={() => handleDeleteRow(row.id)}
                  className="flex size-11 items-center justify-center rounded-lg"
                >
                  <TrashIcon width={24} height={24} className="text-(--color-icon-secondary)" />
                </button>
              </span>
            </div>
          ),
        )}
        <div
          className={[
            'grid transition-[grid-template-rows] duration-300 ease-out',
            editing ? 'grid-template-rows-[1fr]' : 'grid-template-rows-[0fr]',
          ].join(' ')}
          style={{ gridTemplateRows: editing ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            {editing && (
              <div className="grid grid-cols-[1.4fr_1fr_auto] items-center gap-x-3 py-2 pl-5">
                <span className="flex items-center gap-4">
                  <span className="[font-size:var(--font-size-body-2)] leading-[1.6] text-(--color-text-tertiary)">
                    {String(editingIndex).padStart(2, '0')}
                  </span>
                  <input
                    type="text"
                    value={editing.content}
                    onChange={(e) =>
                      setEditing((prev) => prev && { ...prev, content: e.target.value })
                    }
                    placeholder={texts.planPlaceholder}
                    aria-label="업무 내용"
                    className="h-[53px] min-w-0 flex-1 rounded-lg border-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-brand-subtle) px-5 py-3 [font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-default) outline-none transition-colors duration-100 ease-out focus:border-(--color-border-brand) placeholder:text-(--color-text-tertiary)"
                  />
                </span>
                <input
                  type="text"
                  value={editing.schedule}
                  onChange={(e) =>
                    setEditing((prev) => prev && { ...prev, schedule: e.target.value })
                  }
                  placeholder={texts.schedulePlaceholder}
                  aria-label="예상 시점"
                  className="h-[53px] w-full rounded-lg border-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-brand-subtle) px-5 py-3 [font-size:var(--font-size-body-2)] leading-[1.6] font-normal text-(--color-text-default) outline-none transition-colors duration-100 ease-out focus:border-(--color-border-brand) placeholder:text-(--color-text-tertiary)"
                />
                <span className="flex justify-end">
                  <button
                    type="button"
                    aria-label="확정"
                    onClick={handleConfirmRow}
                    disabled={!editing.content.trim()}
                    className="rounded-lg bg-(--color-button-default) p-2.5 text-(--color-text-inverse) disabled:bg-(--color-button-disabled)"
                  >
                    <CheckIcon width={16} height={16} />
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center justify-center gap-1.5 py-2 [font-size:var(--font-size-body-4)] text-(--color-text-secondary)"
        >
          <PlusIcon width={16} height={16} /> 업무 추가하기
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div
          className={[
            'transition-opacity duration-500',
            toasts.length > 0 ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          <ToastContainer toasts={toasts} align="left" />
        </div>
        <div className="flex items-end gap-4">
          {locked ? (
            <span className="[font-size:var(--font-size-body-2)] leading-[1.6] text-(--color-text-tertiary)">
              이미 저장한 회고예요. 수정 기능은 아직 지원하지 않아요
            </span>
          ) : (
            savedAt && (
              <span className="[font-size:var(--font-size-body-2)] leading-[1.6] text-(--color-text-tertiary)">
                임시 저장됨: {savedAt}
              </span>
            )
          )}
          <TextButton
            variant="stroke"
            size="large"
            className="w-[240px]"
            disabled={!canSave || isSaving}
            onClick={handleTempSave}
          >
            임시 저장하기
          </TextButton>
          <TextButton
            variant="fill"
            size="large"
            className="w-[240px]"
            disabled={!canSave || isSaving}
            onClick={handleSave}
          >
            회고 저장하기
          </TextButton>
        </div>
      </div>
    </section>
  )
}
