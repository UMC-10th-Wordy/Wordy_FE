import { useLayoutEffect, useRef, useState } from 'react'
import ChevronUpIcon from '@/assets/icons/Direction=top.svg?react'
import ChevronDownIcon from '@/assets/icons/Direction=bottom.svg?react'
import MoveIcon from '@/assets/icons/move.svg?react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import SettingIcon from '@/assets/icons/setting.svg?react'
import ProjectTag from './ProjectTag'
import TagSettingsModal from './TagSettingsModal'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { useVerticalDragReorder, type VerticalDragOverInfo } from '@/hooks/useVerticalDragReorder'
import { useFlipAnimation } from '@/hooks/useFlipAnimation'
import type { TaskTag } from '@/types/todo'

/* 더미 데이터 */
const INITIAL_TAG_OPTIONS: TaskTag[] = [
  {
    label: '온보딩 리뉴얼',
    color: 'green',
    meta: {
      projectName: '온보딩 리뉴얼',
      purpose: '신규 사용자 활성화 흐름 개선',
      expectedOutcome: '첫 주 핵심 기능 도달률 상승',
      startDate: '2026.06.01',
      endDate: '2026.07.31',
      kpis: ['온보딩 완료율', '첫 주 핵심 기능 도달률'],
    },
  },
  { label: '온보딩 A/B 테스트', color: 'blue' },
  { label: '온보딩 튜토리얼 개선', color: 'navy' },
  { label: '온보딩 이메일 캠페인', color: 'orange' },
  { label: '온보딩 인앱 가이드', color: 'yellow' },
  { label: '온보딩 분석 대시보드', color: 'brown' },
  { label: '온보딩 체크리스트 UI', color: 'red' },
  { label: '온보딩 영상 제작', color: 'pink' },
  { label: '온보딩 설문 자동화', color: 'green' },
  { label: '온보딩 FAQ 페이지', color: 'navy' },
  { label: '온보딩 성과 리포트', color: 'blue' },
  { label: '온보딩 모바일 최적화', color: 'orange' },
  { label: '디자인 시스템 V2', color: 'pink' },
  { label: '리서치', color: 'navy' },
  { label: '광고', color: 'blue' },
]

const SCROLL_THRESHOLD = 10

type TagPreviewEntry = { kind: 'tag'; tag: TaskTag } | { kind: 'placeholder' }

function buildTagPreview(
  options: TaskTag[],
  draggingLabel: string | null,
  overInfo: VerticalDragOverInfo,
): TagPreviewEntry[] {
  if (!draggingLabel) {
    return options.map((tag) => ({ kind: 'tag', tag }))
  }

  const entries: TagPreviewEntry[] = options
    .filter((tag) => tag.label !== draggingLabel)
    .map((tag) => ({ kind: 'tag', tag }))

  if (overInfo.itemId) {
    const targetIndex = entries.findIndex(
      (entry) => entry.kind === 'tag' && entry.tag.label === overInfo.itemId,
    )
    if (targetIndex === -1) {
      entries.push({ kind: 'placeholder' })
    } else {
      entries.splice(overInfo.insertAfter ? targetIndex + 1 : targetIndex, 0, {
        kind: 'placeholder',
      })
    }
  } else {
    entries.push({ kind: 'placeholder' })
  }

  return entries
}

interface TagSelectProps {
  value: TaskTag | null
  onChange: (tag: TaskTag) => void
  tags?: TaskTag[]
  onTagsChange?: (tags: TaskTag[]) => void
}

export default function TagSelect({ value, onChange, tags, onTagsChange }: TagSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tagOptions, setTagOptions] = useState<TaskTag[]>(INITIAL_TAG_OPTIONS)
  const [showModal, setShowModal] = useState<'existing' | 'new' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const effectiveTags = tags ?? tagOptions
  const updateTags = (updater: (prev: TaskTag[]) => TaskTag[]) => {
    if (tags !== undefined) {
      onTagsChange?.(updater(tags))
    } else {
      setTagOptions(updater)
    }
  }

  const handleSelect = (tag: TaskTag) => {
    onChange(tag)
    setIsOpen(false)
  }

  const handleTagDrop = (draggedLabel: string, over: VerticalDragOverInfo) => {
    updateTags((prev) => {
      const draggedIndex = prev.findIndex((tag) => tag.label === draggedLabel)
      if (draggedIndex === -1) return prev

      const rest = prev.filter((tag) => tag.label !== draggedLabel)
      const draggedTag = prev[draggedIndex]

      if (over.itemId) {
        const targetIndex = rest.findIndex((tag) => tag.label === over.itemId)
        if (targetIndex === -1) {
          rest.push(draggedTag)
        } else {
          rest.splice(over.insertAfter ? targetIndex + 1 : targetIndex, 0, draggedTag)
        }
        return rest
      }

      rest.push(draggedTag)
      return rest
    })
  }

  const { draggingId, dragHeight, overInfo, pointerY, startDrag } = useVerticalDragReorder({
    onDrop: handleTagDrop,
  })

  /* 드롭다운 눌러서 사라지지 않게 */
  useOutsideClick(containerRef, () => setIsOpen(false), isOpen && !draggingId)

  useFlipAnimation(listRef, [effectiveTags, draggingId, overInfo.itemId, overInfo.insertAfter])

  const previewEntries = buildTagPreview(effectiveTags, draggingId, overInfo)
  const draggingTag = draggingId
    ? (effectiveTags.find((tag) => tag.label === draggingId) ?? null)
    : null

  /* 태그 들고 움직이기 */
  const [floatingTop, setFloatingTop] = useState<number | null>(null)
  useLayoutEffect(() => {
    if (draggingTag && pointerY !== null && listRef.current) {
      const listRect = listRef.current.getBoundingClientRect()
      const rawTop = pointerY - listRect.top - dragHeight / 2
      const maxTop = Math.max(listRect.height - dragHeight, 0)
      setFloatingTop(Math.min(Math.max(rawTop, 0), maxTop))
    } else {
      setFloatingTop(null)
    }
  }, [draggingTag, pointerY, dragHeight])

  return (
    <div ref={containerRef} className="relative inline-flex shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={`flex shrink-0 items-center justify-center gap-1 rounded-lg ${
          value ? '' : 'bg-(--color-bg-tertiary) px-2 py-1'
        }`}
      >
        {value ? (
          <ProjectTag
            label={value.label}
            color={value.color}
            trailingIcon={
              isOpen ? (
                <ChevronUpIcon aria-hidden className="size-4 shrink-0 text-current" />
              ) : (
                <ChevronDownIcon aria-hidden className="size-4 shrink-0 text-current" />
              )
            }
          />
        ) : (
          <>
            <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-secondary)">
              프로젝트를 선택해 주세요
            </span>
            {isOpen ? (
              <ChevronUpIcon
                aria-hidden
                className="size-4 shrink-0 text-(--color-icon-secondary)"
              />
            ) : (
              <ChevronDownIcon
                aria-hidden
                className="size-4 shrink-0 text-(--color-icon-secondary)"
              />
            )}
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+14px)] -left-3.5 z-10 flex w-87 flex-col items-end gap-4 rounded-(--scale-12) bg-(--color-bg-default) px-4 pt-4 pb-5 shadow-[0px_1px_7.5px_0px_rgba(0,0,0,0.1)]">
          <div className="flex w-full items-center justify-between pl-1">
            <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-semibold text-(--color-text-tertiary)">
              태그 목록
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="태그 추가"
                onClick={() => {
                  setIsOpen(false)
                  setShowModal('new')
                }}
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-(--color-icon-secondary) transition-colors duration-100 ease-out hover:bg-(--color-bg-tertiary)"
              >
                <PlusIcon aria-hidden className="size-6" />
              </button>
              <button
                type="button"
                aria-label="태그 설정"
                onClick={() => {
                  setIsOpen(false)
                  setShowModal('existing')
                }}
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-(--color-icon-secondary) transition-colors duration-100 ease-out hover:bg-(--color-bg-tertiary)"
              >
                <SettingIcon aria-hidden className="size-6" />
              </button>
            </div>
          </div>

          {effectiveTags.length === 0 ? (
            <p className="flex h-14 w-full items-center justify-center text-center [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-normal text-(--color-text-secondary)">
              프로젝트 태그를 추가해 주세요
            </p>
          ) : (
            <div
              ref={listRef}
              className={`relative flex w-full flex-col gap-1 pr-1 ${
                effectiveTags.length > SCROLL_THRESHOLD ? 'max-h-104 overflow-y-auto' : ''
              }`}
            >
              {previewEntries.map((entry) => {
                if (entry.kind === 'placeholder') {
                  return (
                    <div
                      key="__placeholder__"
                      data-flip-id="__placeholder__"
                      style={{ height: dragHeight }}
                      className="w-full shrink-0 rounded-md bg-(--color-bg-tertiary)"
                      aria-hidden
                    />
                  )
                }

                const { tag } = entry
                return (
                  <div
                    key={tag.label}
                    data-flip-id={tag.label}
                    data-vdrag-row="true"
                    data-vdrag-id={tag.label}
                    className="flex h-10.5 w-full shrink-0 items-center gap-1 rounded-md p-1 transition-colors duration-100 ease-out hover:bg-(--color-bg-tertiary)"
                  >
                    <span
                      onMouseDown={startDrag(tag.label)}
                      onDragStart={(event) => event.preventDefault()}
                      draggable={false}
                      className="flex size-6 shrink-0 cursor-grab items-center justify-center [-webkit-user-drag:none] active:cursor-grabbing"
                    >
                      <MoveIcon
                        aria-hidden
                        className="size-6 shrink-0 text-(--color-icon-secondary) select-none"
                      />
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelect(tag)}
                      className="flex min-w-0 flex-1 items-center justify-start"
                    >
                      <ProjectTag label={tag.label} color={tag.color} />
                    </button>
                  </div>
                )
              })}

              {draggingTag && floatingTop !== null && (
                <div
                  style={{ position: 'absolute', top: floatingTop, left: 0, right: 0 }}
                  className="pointer-events-none z-10 flex h-10.5 w-full shrink-0 items-center gap-1 rounded-md bg-(--color-bg-default) p-1 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center">
                    <MoveIcon
                      aria-hidden
                      className="size-6 shrink-0 text-(--color-icon-secondary)"
                    />
                  </span>
                  <ProjectTag label={draggingTag.label} color={draggingTag.color} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showModal !== null && (
        <TagSettingsModal
          tags={effectiveTags}
          initialTab={showModal}
          onClose={() => setShowModal(null)}
          onApply={(tag) => {
            onChange(tag)
            setIsOpen(false)
          }}
          onAddTag={(tag) => {
            updateTags((prev) => [...prev, tag])
          }}
          onEditTag={(oldLabel, updated) => {
            updateTags((prev) => prev.map((t) => (t.label === oldLabel ? updated : t)))
          }}
          onDeleteTag={(label) => {
            updateTags((prev) => prev.filter((t) => t.label !== label))
          }}
        />
      )}
    </div>
  )
}
