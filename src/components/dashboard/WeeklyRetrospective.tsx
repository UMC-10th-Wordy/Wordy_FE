import { useState } from 'react'
import { Input2 } from '@/components/common/Input/Input2'
import { TextButton } from '@/components/common/Button/TextButton'
import { useToast } from '@/components/common/Toast/useToast'
import { ToastContainer } from '@/components/common/Toast/ToastContainer'
import EditIcon from '@/assets/icons/edit.svg?react'
import TrashIcon from '@/assets/icons/trash.svg?react'
import CheckIcon from '@/assets/icons/check.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'

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
    toastTempSaved: '주간 회고가 임시 저장되었어요.',
    toastSaved: '주간 회고가 저장되었어요.',
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
    toastTempSaved: '월간 회고가 임시 저장되었어요.',
    toastSaved: '월간 회고가 저장되었어요.',
  },
}

type QuestionKey = 'work' | 'resource' | 'learning'

interface WeeklyRetrospectiveProps {
  period?: RetrospectivePeriod
}

export const WeeklyRetrospective = ({ period = 'weekly' }: WeeklyRetrospectiveProps) => {
  const texts = TEXTS[period]

  const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
    work: '',
    resource: '',
    learning: '',
  })
  const [plans, setPlans] = useState<PlanRow[]>([])
  const [editing, setEditing] = useState<{ id: string; content: string; schedule: string } | null>(
    null,
  )
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const { toasts, addToast } = useToast()

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
    // TODO(#번호): API 연동 시 임시 저장 요청으로 교체
    setSavedAt(new Date().toLocaleString('ko-KR'))
    addToast(texts.toastTempSaved)
  }

  const handleSave = () => {
    // TODO(#번호): API 연동 시 회고 저장 요청으로 교체
    addToast(texts.toastSaved)
  }

  const hasContent = Object.values(answers).some((v) => v.trim()) || plans.length > 0
  const canSave = hasContent && !editing

  const editingIndex = editing
    ? plans.findIndex((p) => p.id === editing.id) === -1
      ? plans.length + 1
      : plans.findIndex((p) => p.id === editing.id) + 1
    : 0

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-(--color-border-subtle) bg-(--color-bg-default) p-7">
      <div className="flex flex-col gap-1">
        <h2 className="[font-size:var(--font-size-body-2)] font-bold text-(--color-text-default)">
          {texts.title}
        </h2>
        <p className="[font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
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
          />
        </div>
      ))}

      <div className="flex flex-col gap-3">
        <p className="[font-size:var(--font-size-body-3)] font-bold text-(--color-text-default)">
          <span className="mr-2 text-(--color-text-brand)">04</span>
          {texts.planLabel}
        </p>

        <div className="grid grid-cols-[40px_1fr_360px_80px] items-center gap-x-4 rounded-md bg-(--color-bg-brand-light) px-4 py-3 [font-size:var(--font-size-body-4)] font-medium text-(--color-text-default)">
          <span />
          <span>업무 내용</span>
          <span>예상 시점</span>
          <span />
        </div>

        {plans.map((row, i) =>
          editing?.id === row.id ? null : (
            <div
              key={row.id}
              className="group grid h-[60px] grid-cols-[40px_1fr_360px_80px] items-center gap-x-4 border-b border-(--color-border-subtle) px-4 [font-size:var(--font-size-body-4)] text-(--color-text-default)"
            >
              <span className="text-(--color-text-tertiary)">{String(i + 1).padStart(2, '0')}</span>
              <span>{row.content}</span>
              <span>{row.schedule}</span>
              <span className="flex justify-end gap-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <button type="button" aria-label="수정" onClick={() => handleEditRow(row)}>
                  <EditIcon width={18} height={18} className="text-(--color-icon-tertiary)" />
                </button>
                <button type="button" aria-label="삭제" onClick={() => handleDeleteRow(row.id)}>
                  <TrashIcon width={18} height={18} className="text-(--color-icon-tertiary)" />
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
              <div className="grid min-w-[943px] grid-cols-[40px_1fr_360px_80px] items-center gap-x-4 px-4 py-2">
                <span className="[font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
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
                  className="rounded-lg bg-(--color-bg-secondary) px-4 py-3 [font-size:var(--font-size-body-4)] outline-none placeholder:text-(--color-text-tertiary)"
                />
                <input
                  type="text"
                  value={editing.schedule}
                  onChange={(e) =>
                    setEditing((prev) => prev && { ...prev, schedule: e.target.value })
                  }
                  placeholder="언제 진행하실 예정인가요?"
                  aria-label="예상 시점"
                  className="rounded-lg bg-(--color-bg-secondary) px-4 py-3 [font-size:var(--font-size-body-4)] outline-none placeholder:text-(--color-text-tertiary)"
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

      <div className="flex items-center justify-between">
        <div
          className={[
            'transition-opacity duration-500',
            toasts.length > 0 ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          <ToastContainer toasts={toasts} />
        </div>
        <div className="flex items-center gap-4">
          {savedAt && (
            <span className="[font-size:var(--font-size-caption-1)] text-(--color-text-tertiary)">
              임시 저장됨: {savedAt}
            </span>
          )}
          <TextButton variant="stroke" size="medium" disabled={!canSave} onClick={handleTempSave}>
            임시 저장하기
          </TextButton>
          <TextButton variant="fill" size="medium" disabled={!canSave} onClick={handleSave}>
            회고 저장하기
          </TextButton>
        </div>
      </div>
    </section>
  )
}
