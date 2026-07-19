import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { PillTabs } from '@/components/todo/PillTabs'
import { useModalFocus } from '@/hooks/useModalFocus'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog'
import { TextButton } from '@/components/common/Button/TextButton'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import MagnifierIcon from '@/assets/icons/magnifier.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import GenerateIcon from '@/assets/icons/generate.svg?react'
import EditIcon from '@/assets/icons/edit.svg?react'
import TrashIcon from '@/assets/icons/trash.svg?react'
import DirectionBottomIcon from '@/assets/icons/Direction=bottom.svg?react'
import DirectionTopIcon from '@/assets/icons/Direction=top.svg?react'
import FailIcon from '@/assets/icons/fail.svg?react'
import ProjectTag from './ProjectTag'
import TagColorPicker, { COLOR_OPTIONS } from './TagColorPicker'
import TagDatePicker from './TagDatePicker'
import type { ProjectTagColor } from './ProjectTag'
import type { TaskTag } from '@/types/todo'

type Tab = 'existing' | 'new'

const TAG_LIST_LIMIT = 10

function AiLoadingDots() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive((prev) => (prev + 1) % 3), 400)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex h-15 w-full items-center justify-center rounded-lg border border-(--color-border-subtle) bg-(--color-bg-default)">
      <div className="flex items-center gap-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`size-1.5 rounded-full transition-colors duration-200 ${
              i === active ? 'bg-(--color-text-default)' : 'bg-(--color-icon-tertiary)'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="[font-size:var(--font-size-body-2)] font-medium leading-(--line-height-body) text-(--color-text-tertiary)">
      {children}
      {required && <span className="text-(--color-text-required)"> *</span>}
    </p>
  )
}

const COLOR_SWATCH_MAP = Object.fromEntries(
  COLOR_OPTIONS.map((opt) => [opt.value, opt.bg]),
) as Record<ProjectTagColor, string>

const fieldInputClass =
  'w-full h-15 rounded-lg border border-(--color-border-subtle) bg-(--color-bg-default) px-5 [font-size:var(--font-size-body-1)] leading-(--line-height-body) font-normal text-(--color-text-default) placeholder:text-(--color-text-tertiary) outline-none focus:border-(--color-border-brand) transition-colors'

interface TagSettingsModalProps {
  tags: TaskTag[]
  initialTab?: Tab
  onClose: () => void
  onApply: (tag: TaskTag) => void
  onAddTag: (tag: TaskTag) => void
  onEditTag: (oldLabel: string, updated: TaskTag) => void
  onDeleteTag: (label: string) => void
}

export default function TagSettingsModal({
  tags,
  initialTab = 'existing',
  onClose,
  onApply,
  onAddTag,
  onEditTag,
  onDeleteTag,
}: TagSettingsModalProps) {
  const [tab, setTab] = useState<Tab>(initialTab)
  const containerRef = useModalFocus<HTMLDivElement>()

  // 기존 태그 탭
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<TaskTag | null>(null)
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null)
  const [editingLabel, setEditingLabel] = useState<string | null>(null)
  const [deletingLabel, setDeletingLabel] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<{
    label: string
    color: ProjectTagColor
    projectName: string
    purpose: string
    expectedOutcome: string
    startDate: string
    endDate: string
    kpis: string[]
  }>({
    label: '',
    color: 'black',
    projectName: '',
    purpose: '',
    expectedOutcome: '',
    startDate: '',
    endDate: '',
    kpis: [''],
  })
  const [showEditColorPicker, setShowEditColorPicker] = useState(false)
  const [showEditStartDatePicker, setShowEditStartDatePicker] = useState(false)
  const [showEditEndDatePicker, setShowEditEndDatePicker] = useState(false)
  const editStartDateBtnRef = useRef<HTMLButtonElement>(null)
  const editEndDateBtnRef = useRef<HTMLButtonElement>(null)
  const [visibleCount, setVisibleCount] = useState(TAG_LIST_LIMIT)
  // API 연동 시 검색 요청 중일 때 true로 변경
  const isSearching = false

  // 새 태그 탭
  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState<ProjectTagColor>('black')
  const [newProjectName, setNewProjectName] = useState('')
  const [newPurpose, setNewPurpose] = useState('')
  const [newOutcome, setNewOutcome] = useState('')
  const [newStartDate, setNewStartDate] = useState('')
  const [newEndDate, setNewEndDate] = useState('')
  const [newKpis, setNewKpis] = useState<string[]>([''])
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tag-recent-searches') ?? '[]')
    } catch {
      return []
    }
  })
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const colorBtnRef = useRef<HTMLButtonElement>(null)
  const editColorBtnRef = useRef<HTMLButtonElement>(null)
  const startDateBtnRef = useRef<HTMLButtonElement>(null)
  const endDateBtnRef = useRef<HTMLButtonElement>(null)

  const updateRecentSearches = (next: string[]) => {
    setRecentSearches(next)
    localStorage.setItem('tag-recent-searches', JSON.stringify(next))
  }

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return
    updateRecentSearches([trimmed, ...recentSearches.filter((q) => q !== trimmed)].slice(0, 10))
  }

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  useEscapeKey(() => {
    if (showSearchDropdown) {
      setShowSearchDropdown(false)
      return
    }
    if (showColorPicker) {
      setShowColorPicker(false)
      return
    }
    if (showEditColorPicker) {
      setShowEditColorPicker(false)
      return
    }
    if (showEditStartDatePicker) {
      setShowEditStartDatePicker(false)
      return
    }
    if (showEditEndDatePicker) {
      setShowEditEndDatePicker(false)
      return
    }
    if (showStartDatePicker) {
      setShowStartDatePicker(false)
      return
    }
    if (showEndDatePicker) {
      setShowEndDatePicker(false)
      return
    }
    onClose()
  })

  const filteredTags = tags.filter((t) => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
  const visibleTags = filteredTags.slice(0, visibleCount)

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setVisibleCount(TAG_LIST_LIMIT)
  }

  const handleStartEdit = (tag: TaskTag) => {
    setEditingLabel(tag.label)
    setExpandedLabel(tag.label)
    setEditDraft({
      label: tag.label,
      color: tag.color,
      projectName: tag.meta?.projectName ?? '',
      purpose: tag.meta?.purpose ?? '',
      expectedOutcome: tag.meta?.expectedOutcome ?? '',
      startDate: tag.meta?.startDate ?? '',
      endDate: tag.meta?.endDate ?? '',
      kpis: tag.meta?.kpis.length ? [...tag.meta.kpis] : [''],
    })
    setShowEditColorPicker(false)
  }

  const getEditOriginal = () => tags.find((t) => t.label === editingLabel)

  const hasEditChanges = () => {
    const original = getEditOriginal()
    if (!original) return false
    return (
      editDraft.label !== original.label ||
      editDraft.color !== original.color ||
      editDraft.projectName !== (original.meta?.projectName ?? '') ||
      editDraft.purpose !== (original.meta?.purpose ?? '') ||
      editDraft.expectedOutcome !== (original.meta?.expectedOutcome ?? '') ||
      editDraft.startDate !== (original.meta?.startDate ?? '') ||
      editDraft.endDate !== (original.meta?.endDate ?? '') ||
      JSON.stringify(editDraft.kpis) !== JSON.stringify(original.meta?.kpis ?? [])
    )
  }

  const handleConfirmEdit = () => {
    if (!editingLabel || !hasEditChanges()) return
    const isDuplicate = tags.some(
      (t) => t.label === editDraft.label.trim() && t.label !== editingLabel,
    )
    if (isDuplicate) return
    const original = getEditOriginal()
    const updated: TaskTag = {
      label: editDraft.label,
      color: editDraft.color,
      meta: original?.meta
        ? {
            ...original.meta,
            projectName: editDraft.projectName,
            purpose: editDraft.purpose,
            expectedOutcome: editDraft.expectedOutcome,
            startDate: editDraft.startDate || undefined,
            endDate: editDraft.endDate || undefined,
            kpis: editDraft.kpis.filter((k) => k.trim() !== ''),
          }
        : undefined,
    }
    onEditTag(editingLabel, updated)
    if (selectedTag?.label === editingLabel) setSelectedTag(updated)
    setEditingLabel(null)
    setExpandedLabel(null)
  }

  const handleCancelEdit = () => {
    setEditingLabel(null)
    setExpandedLabel(null)
    setShowEditColorPicker(false)
    setShowEditStartDatePicker(false)
    setShowEditEndDatePicker(false)
  }

  // API 연동 시:
  // 1. setTimeout 대신 실제 API 호출로 교체: await apiClient.getAiKpiSuggestions({ ... })
  // 2. setNewKpis(['...']) 의 배열을 API 응답값(string[])으로 교체
  const handleAiRecommend = async () => {
    setIsAiGenerating(true)
    await new Promise((r) => setTimeout(r, 1500))
    // API 연동 시 아래 mock 배열을 응답값(string[])으로 교체 (AI는 3-4개 반환)
    setNewKpis(['온보딩 완료율', '첫 주 핵심 기능 도달률', '사용자 이탈률'])
    setIsAiGenerating(false)
  }

  const handleKpiChange = (index: number, value: string) =>
    setNewKpis((prev) => prev.map((k, i) => (i === index ? value : k)))
  const handleRemoveKpi = (index: number) =>
    setNewKpis((prev) => {
      const next = prev.filter((_, i) => i !== index)
      // KPI를 모두 지우면 초기 상태(빈 입력 1개)로 돌아감
      return next.length === 0 ? [''] : next
    })

  const canAddNewTag =
    newLabel.trim() !== '' &&
    newProjectName.trim() !== '' &&
    newPurpose.trim() !== '' &&
    newOutcome.trim() !== '' &&
    newKpis.some((k) => k.trim() !== '') &&
    !tags.some((t) => t.label === newLabel.trim())

  const handleAddTag = () => {
    if (!canAddNewTag) return
    onAddTag({
      label: newLabel.trim(),
      color: newColor,
      meta: {
        projectName: newProjectName.trim(),
        purpose: newPurpose.trim(),
        expectedOutcome: newOutcome.trim(),
        startDate: newStartDate || undefined,
        endDate: newEndDate || undefined,
        kpis: newKpis.filter((k) => k.trim() !== ''),
      },
    })
    onClose()
  }

  const modal = createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-bg-overlay) backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        className="flex w-full max-w-155 flex-col gap-7 rounded-(--scale-12) bg-(--color-bg-default) pb-7 pt-5 px-5 shadow-[0px_1px_7.5px_0px_rgba(0,0,0,0.1)] h-[90vh] overflow-hidden"
      >
        {/* 헤더 */}
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="flex flex-col items-start gap-0.5">
            <p className="[font-size:var(--font-size-body-1)] font-semibold leading-(--line-height-body) text-(--color-text-default)">
              업무에 프로젝트 태그를 설정해 주세요
            </p>
            <p className="[font-size:var(--font-size-body-3)] font-normal leading-(--line-height-body) text-(--color-text-tertiary)">
              태그는 성과 대시보드에서 프로젝트 흐름과 KPI를 추적하는 데에 활용돼요.
            </p>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-(--color-icon-secondary) transition-colors duration-100 ease-out hover:bg-(--color-bg-tertiary)"
          >
            <XMarkIcon aria-hidden className="size-6" />
          </button>
        </div>

        {/* 탭 + 컨텐츠 영역 */}
        <div className="flex min-h-0 flex-1 flex-col gap-5">
          <PillTabs
            tabs={[
              { value: 'existing' as Tab, label: '기존 태그 선택하기' },
              { value: 'new' as Tab, label: '새 태그 만들기' },
            ]}
            value={tab}
            onChange={setTab}
          />

          {/* 기존 태그 탭 */}
          {tab === 'existing' && (
            <div className="flex min-h-0 flex-1 flex-col gap-5">
              {/* 검색창 */}
              <div ref={searchRef} className="relative shrink-0 z-10">
                <div className="flex h-12 items-center gap-2.5 rounded-(--scale-12) border border-(--color-border-light) bg-(--color-bg-default) px-5">
                  <button
                    type="button"
                    aria-label="검색"
                    onClick={() => {
                      if (searchQuery) {
                        addRecentSearch(searchQuery)
                        setShowSearchDropdown(false)
                      }
                    }}
                    className="flex size-8 shrink-0 items-center justify-center text-(--color-icon-secondary)"
                  >
                    <MagnifierIcon aria-hidden className="size-8" />
                  </button>
                  <input
                    type="text"
                    placeholder="프로젝트 태그를 검색해 보세요."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setShowSearchDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addRecentSearch(searchQuery)
                        setShowSearchDropdown(false)
                      }
                    }}
                    className="min-w-0 flex-1 bg-transparent [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default) placeholder:text-(--color-text-tertiary) outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="검색어 지우기"
                      onClick={() => handleSearchChange('')}
                      className="flex size-8 shrink-0 items-center justify-center text-(--color-icon-secondary) transition-colors duration-100 ease-out hover:text-(--color-icon-default)"
                    >
                      <XMarkIcon aria-hidden className="size-6" />
                    </button>
                  )}
                </div>
                {/* 최근 검색어 드롭다운 */}
                {showSearchDropdown && !searchQuery && recentSearches.length > 0 && (
                  <div className="absolute left-[-1px] top-[calc(100%+4px)] w-[calc(100%+2px)] rounded-(--scale-12) bg-(--color-bg-default) shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)] px-4 py-5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between pl-1">
                      <p className="[font-size:var(--font-size-body-3)] font-semibold leading-(--line-height-body) text-(--color-text-tertiary)">
                        최근 검색어
                      </p>
                      <button
                        type="button"
                        onClick={() => updateRecentSearches([])}
                        className="flex h-8 items-center justify-center rounded-md px-2 [font-size:var(--font-size-body-4)] font-medium leading-(--line-height-body) text-(--color-text-brand)"
                      >
                        모두 지우기
                      </button>
                    </div>
                    <div className="flex flex-col">
                      {recentSearches.map((q) => (
                        <div key={q} className="flex h-13 items-center justify-between p-1">
                          <button
                            type="button"
                            className="min-w-0 flex-1 text-left [font-size:var(--font-size-body-2)] font-normal leading-(--line-height-body) text-(--color-text-default)"
                            onClick={() => {
                              addRecentSearch(q)
                              setSearchQuery(q)
                              setShowSearchDropdown(false)
                            }}
                          >
                            {q}
                          </button>
                          <button
                            type="button"
                            aria-label="삭제"
                            onClick={() =>
                              updateRecentSearches(recentSearches.filter((item) => item !== q))
                            }
                            className="flex size-8 shrink-0 items-center justify-center rounded-md text-(--color-icon-secondary) transition-colors duration-100 ease-out hover:bg-(--color-bg-tertiary)"
                          >
                            <XMarkIcon aria-hidden className="size-6" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 태그 목록 */}
              <div className="flex min-h-0 flex-1 flex-col gap-2">
                <div className="flex shrink-0 items-center justify-between">
                  <p className="[font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-text-tertiary)">
                    {searchQuery ? '검색된 태그' : '최근 사용한 태그'}
                  </p>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="flex h-8 items-center justify-center rounded-md px-2 [font-size:var(--font-size-body-4)] font-medium leading-(--line-height-body) text-(--color-text-brand)"
                    >
                      검색 초기화
                    </button>
                  )}
                </div>
                <Scrollbar className="min-h-0 flex-1">
                  <div className="flex flex-col gap-3 pb-1">
                    {isSearching ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-lg border-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) px-3 py-2 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="h-9.25 w-40 rounded-lg bg-(--color-bg-tertiary)" />
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-md text-(--color-icon-secondary)">
                              <EditIcon aria-hidden className="size-6" />
                            </div>
                            <div className="flex size-8 items-center justify-center rounded-md text-(--color-icon-secondary)">
                              <TrashIcon aria-hidden className="size-6" />
                            </div>
                            <div className="flex size-8 items-center justify-center rounded-md text-(--color-icon-secondary)">
                              <DirectionBottomIcon aria-hidden className="size-6" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : filteredTags.length === 0 ? (
                      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16">
                        <FailIcon aria-hidden className="size-8 text-(--color-icon-brand)" />
                        <div className="text-center">
                          <p
                            className={`[font-size:var(--font-size-body-2)] leading-(--line-height-body) ${searchQuery ? 'font-medium text-(--color-text-secondary)' : 'font-normal text-(--color-text-tertiary)'}`}
                          >
                            {searchQuery
                              ? '관련된 태그를 찾을 수 없어요'
                              : '만들어진 프로젝트 태그가 없네요'}
                          </p>
                          {!searchQuery && (
                            <p className="[font-size:var(--font-size-body-2)] font-normal leading-(--line-height-body) text-(--color-text-tertiary)">
                              새 태그를 만들어 주세요
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      visibleTags.map((tag) => (
                        <div key={tag.label} className="flex shrink-0 flex-col">
                          <div
                            className={[
                              'flex items-center gap-2 border-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) px-3 py-2 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]',
                              expandedLabel === tag.label && tag.meta
                                ? 'rounded-tl-lg rounded-tr-lg'
                                : 'rounded-lg',
                            ].join(' ')}
                          >
                            <>
                              <button
                                type="button"
                                className="flex min-w-0 flex-1 items-center"
                                onClick={() => {
                                  if (editingLabel === tag.label) return
                                  const isExpanding = expandedLabel !== tag.label
                                  setExpandedLabel(isExpanding ? tag.label : null)
                                  setSelectedTag(isExpanding ? tag : null)
                                }}
                              >
                                <ProjectTag
                                  label={editingLabel === tag.label ? editDraft.label : tag.label}
                                  color={editingLabel === tag.label ? editDraft.color : tag.color}
                                />
                              </button>
                              <div className="flex shrink-0 items-center gap-2">
                                <button
                                  type="button"
                                  aria-label="수정"
                                  onClick={() => {
                                    if (editingLabel !== tag.label) handleStartEdit(tag)
                                  }}
                                  className="flex size-8 items-center justify-center rounded-md text-(--color-icon-secondary) transition-colors duration-100 ease-out hover:bg-(--color-bg-tertiary)"
                                >
                                  <EditIcon aria-hidden className="size-6" />
                                </button>
                                <button
                                  type="button"
                                  aria-label="삭제"
                                  onClick={() => {
                                    if (editingLabel !== tag.label) setDeletingLabel(tag.label)
                                  }}
                                  className="flex size-8 items-center justify-center rounded-md text-(--color-icon-secondary) transition-colors duration-100 ease-out hover:bg-(--color-bg-tertiary)"
                                >
                                  <TrashIcon aria-hidden className="size-6" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={expandedLabel === tag.label ? '접기' : '펼치기'}
                                  onClick={() => {
                                    if (editingLabel === tag.label) {
                                      handleCancelEdit()
                                    } else {
                                      const isExpanding = expandedLabel !== tag.label
                                      setExpandedLabel(isExpanding ? tag.label : null)
                                      setSelectedTag(isExpanding ? tag : null)
                                    }
                                  }}
                                  className="flex size-8 items-center justify-center rounded-md text-(--color-icon-secondary) transition-colors duration-100 ease-out hover:bg-(--color-bg-tertiary)"
                                >
                                  {expandedLabel === tag.label ? (
                                    <DirectionTopIcon aria-hidden className="size-6" />
                                  ) : (
                                    <DirectionBottomIcon aria-hidden className="size-6" />
                                  )}
                                </button>
                              </div>
                            </>
                          </div>
                          {expandedLabel === tag.label && tag.meta && (
                            <div
                              className={`flex flex-col rounded-bl-lg rounded-br-lg border-[0.5px] border-t-0 border-(--color-border-brand-subtle) bg-(--color-bg-brand-subtle) p-4 ${editingLabel === tag.label ? 'gap-5' : 'gap-3'}`}
                            >
                              {editingLabel === tag.label ? (
                                <>
                                  {/* 태그명 + 색상 */}
                                  <div className="flex items-start gap-5">
                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                      <FieldLabel required>태그명</FieldLabel>
                                      <input
                                        type="text"
                                        value={editDraft.label}
                                        onChange={(e) =>
                                          setEditDraft((d) => ({ ...d, label: e.target.value }))
                                        }
                                        className={fieldInputClass}
                                        autoFocus
                                      />
                                    </div>
                                    <div className="flex shrink-0 flex-col gap-1">
                                      <FieldLabel required>색상</FieldLabel>
                                      <div className="relative">
                                        <button
                                          ref={editColorBtnRef}
                                          type="button"
                                          onClick={() => setShowEditColorPicker((v) => !v)}
                                          className={`size-15 rounded-(--scale-8) ${COLOR_SWATCH_MAP[editDraft.color]}`}
                                          aria-label="색상 선택"
                                        />
                                        {showEditColorPicker && (
                                          <TagColorPicker
                                            anchorRef={editColorBtnRef}
                                            value={editDraft.color}
                                            onChange={(c) =>
                                              setEditDraft((d) => ({ ...d, color: c }))
                                            }
                                            onClose={() => setShowEditColorPicker(false)}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {/* 프로젝트 혹은 업무명 */}
                                  <div className="flex flex-col gap-1">
                                    <FieldLabel required>프로젝트 혹은 업무명</FieldLabel>
                                    <input
                                      type="text"
                                      placeholder="프로젝트 혹은 업무명을 입력해 주세요"
                                      value={editDraft.projectName}
                                      onChange={(e) =>
                                        setEditDraft((d) => ({ ...d, projectName: e.target.value }))
                                      }
                                      className={fieldInputClass}
                                    />
                                  </div>
                                  {/* 프로젝트 목적 */}
                                  <div className="flex flex-col gap-1">
                                    <FieldLabel required>프로젝트 목적</FieldLabel>
                                    <input
                                      type="text"
                                      placeholder="프로젝트 목적을 입력해 주세요"
                                      value={editDraft.purpose}
                                      onChange={(e) =>
                                        setEditDraft((d) => ({ ...d, purpose: e.target.value }))
                                      }
                                      className={fieldInputClass}
                                    />
                                  </div>
                                  {/* 기대하는 성과 */}
                                  <div className="flex flex-col gap-1">
                                    <FieldLabel required>기대하는 성과</FieldLabel>
                                    <input
                                      type="text"
                                      placeholder="기대하는 성과를 입력해 주세요"
                                      value={editDraft.expectedOutcome}
                                      onChange={(e) =>
                                        setEditDraft((d) => ({
                                          ...d,
                                          expectedOutcome: e.target.value,
                                        }))
                                      }
                                      className={fieldInputClass}
                                    />
                                  </div>
                                  {/* 예상 기간 */}
                                  <div className="flex flex-col gap-1">
                                    <FieldLabel>예상 기간</FieldLabel>
                                    <div className="flex items-center gap-3">
                                      <div className="relative flex-1">
                                        <button
                                          ref={editStartDateBtnRef}
                                          type="button"
                                          onClick={() => setShowEditStartDatePicker((v) => !v)}
                                          className={[
                                            fieldInputClass,
                                            'flex h-15 w-full items-center justify-between text-left',
                                            !editDraft.startDate && 'text-(--color-text-tertiary)',
                                          ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        >
                                          <span>{editDraft.startDate || '시작일'}</span>
                                          <CalendarIcon
                                            aria-hidden
                                            className="size-6 shrink-0 text-(--color-icon-tertiary)"
                                          />
                                        </button>
                                        {showEditStartDatePicker && (
                                          <TagDatePicker
                                            anchorRef={
                                              editStartDateBtnRef as React.RefObject<HTMLElement>
                                            }
                                            value={editDraft.startDate}
                                            onChange={(v) =>
                                              setEditDraft((d) => ({ ...d, startDate: v }))
                                            }
                                            onClose={() => setShowEditStartDatePicker(false)}
                                          />
                                        )}
                                      </div>
                                      <span className="shrink-0 [font-size:var(--font-size-body-1)] text-(--color-text-tertiary)">
                                        -
                                      </span>
                                      <div className="relative flex-1">
                                        <button
                                          ref={editEndDateBtnRef}
                                          type="button"
                                          onClick={() => setShowEditEndDatePicker((v) => !v)}
                                          className={[
                                            fieldInputClass,
                                            'flex h-15 w-full items-center justify-between text-left',
                                            !editDraft.endDate && 'text-(--color-text-tertiary)',
                                          ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        >
                                          <span>{editDraft.endDate || '종료일'}</span>
                                          <CalendarIcon
                                            aria-hidden
                                            className="size-6 shrink-0 text-(--color-icon-tertiary)"
                                          />
                                        </button>
                                        {showEditEndDatePicker && (
                                          <TagDatePicker
                                            anchorRef={
                                              editEndDateBtnRef as React.RefObject<HTMLElement>
                                            }
                                            value={editDraft.endDate}
                                            onChange={(v) =>
                                              setEditDraft((d) => ({ ...d, endDate: v }))
                                            }
                                            onClose={() => setShowEditEndDatePicker(false)}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {/* 핵심 평가 지표 */}
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-start justify-between">
                                      <FieldLabel required>핵심 평가 지표</FieldLabel>
                                      <TextButton
                                        variant="stroke"
                                        size="small"
                                        className="w-26.75 shrink-0 [font-size:var(--font-size-body-4)]"
                                        iconLeft={<GenerateIcon aria-hidden className="size-5" />}
                                      >
                                        AI 추천 받기
                                      </TextButton>
                                    </div>
                                    {editDraft.kpis.map((kpi, i) => (
                                      <div
                                        key={i}
                                        className="flex h-15 items-center justify-between rounded-lg border border-(--color-border-subtle) bg-(--color-bg-default) px-5 transition-colors focus-within:border-(--color-border-brand)"
                                      >
                                        <input
                                          type="text"
                                          placeholder="핵심 평가 지표를 입력해 주세요"
                                          value={kpi}
                                          onChange={(e) =>
                                            setEditDraft((d) => ({
                                              ...d,
                                              kpis: d.kpis.map((k, ki) =>
                                                ki === i ? e.target.value : k,
                                              ),
                                            }))
                                          }
                                          className="min-w-0 flex-1 bg-transparent [font-size:var(--font-size-body-1)] leading-(--line-height-body) font-normal text-(--color-text-default) placeholder:text-(--color-text-tertiary) outline-none"
                                        />
                                        <button
                                          type="button"
                                          aria-label="KPI 삭제"
                                          onClick={() =>
                                            setEditDraft((d) => ({
                                              ...d,
                                              kpis: d.kpis.filter((_, ki) => ki !== i),
                                            }))
                                          }
                                          className="flex size-6 shrink-0 items-center justify-center text-(--color-icon-tertiary) transition-colors duration-100 ease-out hover:text-(--color-icon-secondary)"
                                        >
                                          <TrashIcon aria-hidden className="size-6" />
                                        </button>
                                      </div>
                                    ))}
                                    <TextButton
                                      variant="stroke"
                                      size="small"
                                      fullWidth
                                      className="[font-size:var(--font-size-body-4)]"
                                      onClick={() =>
                                        setEditDraft((d) => ({ ...d, kpis: [...d.kpis, ''] }))
                                      }
                                      iconLeft={<PlusIcon aria-hidden className="size-5" />}
                                    >
                                      KPI 추가하기
                                    </TextButton>
                                  </div>
                                  {/* 취소 / 수정하기 버튼 */}
                                  <div className="flex w-full items-center justify-center gap-3">
                                    <TextButton
                                      variant="stroke_neutral"
                                      size="medium"
                                      className="w-35 [font-size:var(--font-size-body-3)]"
                                      onClick={handleCancelEdit}
                                    >
                                      취소하기
                                    </TextButton>
                                    <TextButton
                                      variant="fill"
                                      size="medium"
                                      className="w-35 [font-size:var(--font-size-body-3)]"
                                      onClick={handleConfirmEdit}
                                      disabled={!hasEditChanges()}
                                    >
                                      수정하기
                                    </TextButton>
                                  </div>
                                </>
                              ) : (
                                <>
                                  {[
                                    { label: '목적', value: tag.meta.purpose },
                                    { label: '기대 성과', value: tag.meta.expectedOutcome },
                                    {
                                      label: '기간',
                                      value:
                                        tag.meta.startDate && tag.meta.endDate
                                          ? `${tag.meta.startDate} - ${tag.meta.endDate}`
                                          : tag.meta.startDate || tag.meta.endDate || null,
                                    },
                                  ]
                                    .filter((row) => row.value)
                                    .map((row) => (
                                      <div key={row.label} className="flex items-center gap-2">
                                        <span className="w-25 shrink-0 [font-size:var(--font-size-body-3)] leading-(--line-height-body) text-(--color-text-tertiary)">
                                          {row.label}
                                        </span>
                                        <span className="min-w-0 flex-1 [font-size:var(--font-size-body-3)] leading-(--line-height-body) text-(--color-text-secondary)">
                                          {row.value}
                                        </span>
                                      </div>
                                    ))}
                                  {tag.meta.kpis.length > 0 && (
                                    <div className="flex items-start gap-2">
                                      <span className="w-25 shrink-0 [font-size:var(--font-size-body-3)] leading-(--line-height-body) text-(--color-text-tertiary)">
                                        핵심 평가 지표
                                      </span>
                                      <ul className="min-w-0 flex-1 flex flex-col gap-2">
                                        {tag.meta.kpis.map((kpi, i) => (
                                          <li
                                            key={i}
                                            className="flex items-center gap-2 [font-size:var(--font-size-body-3)] leading-(--line-height-body) text-(--color-text-secondary)"
                                          >
                                            <span className="size-0.75 shrink-0 rounded-full bg-(--color-text-tertiary)" />
                                            {kpi}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    {filteredTags.length > visibleCount && (
                      <TextButton
                        variant="stroke"
                        size="medium"
                        fullWidth
                        className="[font-size:var(--font-size-body-3)]"
                        onClick={() => setVisibleCount((n) => n + TAG_LIST_LIMIT)}
                      >
                        태그 더보기
                      </TextButton>
                    )}
                  </div>
                </Scrollbar>
              </div>
            </div>
          )}

          {/* 새 태그 탭 */}
          {tab === 'new' && (
            <Scrollbar className="min-h-0 flex-1">
              <div className="flex flex-col gap-4 pb-1">
                {/* 태그명 + 색상 */}
                <div className="flex items-start gap-5">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <FieldLabel required>태그명</FieldLabel>
                    <input
                      type="text"
                      placeholder="태그명을 입력해 주세요"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className={fieldInputClass}
                    />
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <FieldLabel required>색상</FieldLabel>
                    <div className="relative">
                      <button
                        ref={colorBtnRef}
                        type="button"
                        onClick={() => setShowColorPicker((v) => !v)}
                        className={`size-15 rounded-(--scale-8) ${COLOR_SWATCH_MAP[newColor]}`}
                        aria-label="색상 선택"
                      />
                      {showColorPicker && (
                        <TagColorPicker
                          anchorRef={colorBtnRef}
                          value={newColor}
                          onChange={setNewColor}
                          onClose={() => setShowColorPicker(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 프로젝트 혹은 업무명 */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>프로젝트 혹은 업무명</FieldLabel>
                  <input
                    type="text"
                    placeholder="예) 온보딩 리뉴얼"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className={fieldInputClass}
                  />
                </div>

                {/* 프로젝트 목적 */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>프로젝트 목적</FieldLabel>
                  <input
                    type="text"
                    placeholder="예) 신규 사용자 활성화 흐름 개선"
                    value={newPurpose}
                    onChange={(e) => setNewPurpose(e.target.value)}
                    className={fieldInputClass}
                  />
                </div>

                {/* 기대하는 성과 */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>기대하는 성과</FieldLabel>
                  <input
                    type="text"
                    placeholder="예) 첫 주 핵심 기능 도달률 상승"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    className={fieldInputClass}
                  />
                </div>

                {/* 예상 기간 */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>예상 기간</FieldLabel>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <button
                        ref={startDateBtnRef}
                        type="button"
                        onClick={() => {
                          setShowStartDatePicker((v) => !v)
                          setShowEndDatePicker(false)
                        }}
                        className={`${fieldInputClass} flex items-center justify-between cursor-pointer`}
                      >
                        <span
                          className={
                            newStartDate
                              ? 'text-(--color-text-default)'
                              : 'text-(--color-text-tertiary)'
                          }
                        >
                          {newStartDate || '날짜를 선택해 주세요'}
                        </span>
                        <CalendarIcon
                          aria-hidden
                          className="size-6 shrink-0 text-(--color-icon-tertiary)"
                        />
                      </button>
                      {showStartDatePicker && (
                        <TagDatePicker
                          anchorRef={startDateBtnRef}
                          value={newStartDate}
                          onChange={setNewStartDate}
                          onClose={() => setShowStartDatePicker(false)}
                        />
                      )}
                    </div>
                    <span className="shrink-0 [font-size:var(--font-size-body-1)] leading-(--line-height-body) text-(--color-text-tertiary)">
                      -
                    </span>
                    <div className="relative flex-1">
                      <button
                        ref={endDateBtnRef}
                        type="button"
                        onClick={() => {
                          setShowEndDatePicker((v) => !v)
                          setShowStartDatePicker(false)
                        }}
                        className={`${fieldInputClass} flex items-center justify-between cursor-pointer`}
                      >
                        <span
                          className={
                            newEndDate
                              ? 'text-(--color-text-default)'
                              : 'text-(--color-text-tertiary)'
                          }
                        >
                          {newEndDate || '날짜를 선택해 주세요'}
                        </span>
                        <CalendarIcon
                          aria-hidden
                          className="size-6 shrink-0 text-(--color-icon-tertiary)"
                        />
                      </button>
                      {showEndDatePicker && (
                        <TagDatePicker
                          anchorRef={endDateBtnRef}
                          value={newEndDate}
                          onChange={setNewEndDate}
                          onClose={() => setShowEndDatePicker(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 핵심 평가 지표 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <FieldLabel required>핵심 평가 지표</FieldLabel>
                    <TextButton
                      variant="stroke"
                      size="small"
                      className="w-26.75 [font-size:var(--font-size-body-4)]"
                      iconLeft={<GenerateIcon aria-hidden className="size-5" />}
                      disabled={isAiGenerating}
                      onClick={handleAiRecommend}
                    >
                      AI 추천 받기
                    </TextButton>
                  </div>
                  {isAiGenerating ? (
                    <AiLoadingDots />
                  ) : (
                    newKpis.map((kpi, i) => (
                      <div
                        key={i}
                        className="flex h-15 items-center justify-between rounded-lg border border-(--color-border-subtle) bg-(--color-bg-default) px-5 transition-colors focus-within:border-(--color-border-brand)"
                      >
                        <input
                          type="text"
                          placeholder="예) 온보딩 완료율"
                          value={kpi}
                          onChange={(e) => handleKpiChange(i, e.target.value)}
                          className="min-w-0 flex-1 bg-transparent [font-size:var(--font-size-body-1)] leading-(--line-height-body) font-normal text-(--color-text-default) placeholder:text-(--color-text-tertiary) outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveKpi(i)}
                          aria-label="KPI 삭제"
                          className="flex size-6 shrink-0 items-center justify-center text-(--color-icon-tertiary) transition-colors duration-100 ease-out hover:text-(--color-status-error)"
                        >
                          <TrashIcon aria-hidden className="size-6" />
                        </button>
                      </div>
                    ))
                  )}
                  <TextButton
                    variant="stroke"
                    size="small"
                    fullWidth
                    className="[font-size:var(--font-size-body-4)]"
                    onClick={() => setNewKpis((prev) => [...prev, ''])}
                    iconLeft={<PlusIcon aria-hidden className="size-5" />}
                  >
                    KPI 추가하기
                  </TextButton>
                </div>
              </div>
            </Scrollbar>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex shrink-0 w-full items-center justify-end">
          {tab === 'existing' ? (
            <TextButton
              variant="fill"
              size="medium"
              className="w-35 [font-size:var(--font-size-body-3)]"
              disabled={selectedTag === null}
              onClick={() => {
                if (selectedTag) {
                  onApply(selectedTag)
                  onClose()
                }
              }}
            >
              적용하기
            </TextButton>
          ) : (
            <TextButton
              variant="fill"
              size="medium"
              className="w-35 [font-size:var(--font-size-body-3)]"
              disabled={!canAddNewTag}
              onClick={handleAddTag}
            >
              태그 추가하기
            </TextButton>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )

  return (
    <>
      {modal}
      {deletingLabel && (
        <ConfirmDialog
          message={
            <>
              이 태그를 삭제할까요?
              <br />
              삭제하면 되돌릴 수 없어요
              <br />
              <span className="[font-size:var(--font-size-body-4)] font-medium text-(--color-text-tertiary)">
                * 태그가 삭제되어도 기존 업무에 적용된 태그 기록은 남아요
              </span>
            </>
          }
          onCancel={() => setDeletingLabel(null)}
          onConfirm={() => {
            onDeleteTag(deletingLabel)
            if (selectedTag?.label === deletingLabel) setSelectedTag(null)
            if (expandedLabel === deletingLabel) setExpandedLabel(null)
            setDeletingLabel(null)
          }}
        />
      )}
    </>
  )
}
