import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/common/Button/IconButton'
import { TrashMoreMenu } from '@/components/sidebar/TrashMoreMenu/TrashMoreMenu'
import ArrowLeftIcon from '@/assets/icons/Direction=left.svg?react'
import MeatballIcon from '@/assets/icons/meatball.svg?react'
import ArrowDownIcon from '@/assets/icons/Direction=bottom.svg?react'
import ArrowRightIcon from '@/assets/icons/Direction=right.svg?react'
import ErrorIcon from '@/assets/icons/error.svg?react'
import SuccessIcon from '@/assets/icons/success.svg?react'
import EmptyImage from '@/assets/icons/Layer 2.svg?react'

export interface TrashItem {
  id: string
  title: string
  deletedAt: string
  expanded?: boolean
}

export interface TrashPageProps {
  items?: TrashItem[]
}

interface Toast {
  id: number
  message: string
  exiting?: boolean
}

type ConfirmState = { type: 'delete'; itemId: string } | null

export function TrashPage({ items: initialItems }: TrashPageProps) {
  const navigate = useNavigate()
  const [items, setItems] = useState<TrashItem[]>(
    initialItems ?? [
      { id: '1', title: '2026년 2월 18일의 업무 일지', deletedAt: '2026년 5월 10일에 삭제함' },
      { id: '2', title: '2026년 2월 17일의 업무 일지', deletedAt: '2026년 5월 9일에 삭제함' },
      { id: '3', title: '2026년 2월 16일의 업무 일지', deletedAt: '2026년 5월 8일에 삭제함' },
    ],
  )
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<ConfirmState>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])

  function addToast(message: string) {
    const id = ++toastIdRef.current
    setToasts((prev) => {
      const next = [...prev, { id, message }]
      return next.slice(-3)
    })
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 200)
    }, 2000)
  }

  function handleRestore(itemId: string) {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
    setOpenMenuId(null)
    addToast('업무 일지가 복원되었어요.')
  }

  function handleDeletePermanently(itemId: string) {
    setOpenMenuId(null)
    setConfirm({ type: 'delete', itemId })
  }

  function handleConfirmDelete() {
    if (!confirm) return
    setItems((prev) => prev.filter((i) => i.id !== confirm.itemId))
    setConfirm(null)
    addToast('업무 일지가 영구 삭제되었어요.')
  }

  function toggleExpand(itemId: string) {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, expanded: !i.expanded } : i)))
  }

  return (
    <div className="flex flex-col gap-10 items-start p-10 relative min-h-screen w-full bg-(--color-bg-brand-subtle)">
      {/* 뒤로 가기 */}
      <div className="flex gap-2 items-center shrink-0">
        <IconButton
          variant="text_neutral"
          size={items.length === 0 ? 'medium' : 'large'}
          icon={<ArrowLeftIcon className={items.length === 0 ? 'size-8' : 'size-10'} />}
          onClick={() => navigate('/')}
          aria-label="뒤로 가기"
        />
        <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-medium text-(--color-text-secondary) whitespace-nowrap">
          뒤로 가기
        </span>
      </div>

      {/* 컨텐츠 */}
      <div className="flex flex-col gap-10 items-start px-10 w-full max-w-230 mx-auto">
        {/* 헤더 */}
        <div className="flex flex-col gap-1 items-start shrink-0">
          <h2 className="[font-size:var(--font-size-heading-2)] leading-(--line-height-body) font-semibold text-(--color-text-default) whitespace-nowrap">
            휴지통
          </h2>
          <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary) whitespace-nowrap">
            삭제된 업무 일지를 확인하고 복원할 수 있어요
          </p>
        </div>

        {/* 카드 목록 또는 빈 상태 */}
        {items.length === 0 ? (
          <div className="flex flex-col gap-4 items-center justify-center w-full flex-1 min-h-[400px]">
            <EmptyImage className="w-[253px] h-[129px]" />
            <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-secondary) text-center whitespace-nowrap">
              휴지통이 비어있어요
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 isolate items-start w-full">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative bg-(--color-bg-default) border border-(--color-border-brand-subtle) rounded-lg shadow-[0px_1px_5px_rgba(0,0,0,0.1)] p-5 flex flex-col gap-4 items-end w-full"
              >
                {/* 더보기 버튼 — absolute 우상단 */}
                <div
                  className="absolute top-5 right-5 z-10"
                  ref={openMenuId === item.id ? menuRef : undefined}
                >
                  <IconButton
                    variant="text_neutral"
                    size="small"
                    icon={<MeatballIcon className="size-6" />}
                    onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                    aria-label="더보기"
                  />
                  {openMenuId === item.id && (
                    <div className="absolute right-0 top-8 z-10">
                      <TrashMoreMenu
                        onRestore={() => handleRestore(item.id)}
                        onDeletePermanently={() => handleDeletePermanently(item.id)}
                      />
                    </div>
                  )}
                </div>

                {/* 제목 + 날짜 행 */}
                <div className="flex gap-2 items-start w-full z-3">
                  <div className="flex flex-1 min-w-0 items-start">
                    <div className="flex flex-col items-start">
                      <div className="flex gap-2 items-center">
                        <span className="[font-size:var(--font-size-heading-4)] leading-(--line-height-body) font-semibold text-(--color-text-default) break-keep">
                          {item.title}
                        </span>
                        <IconButton
                          variant="text_neutral"
                          size="medium"
                          icon={
                            item.expanded ? (
                              <ArrowDownIcon className="size-8" />
                            ) : (
                              <ArrowRightIcon className="size-8" />
                            )
                          }
                          onClick={() => toggleExpand(item.id)}
                          aria-label={item.expanded ? '접기' : '펼치기'}
                        />
                      </div>
                      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary) whitespace-nowrap">
                        {item.deletedAt}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 영구 삭제 확인 다이얼로그 */}
      {confirm && (
        <>
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-(--color-bg-default) rounded-[var(--scale-12)] shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)] flex flex-col gap-5 items-center justify-center px-8 py-5">
              <div className="flex flex-col gap-3 items-center">
                <ErrorIcon className="size-7 text-(--color-icon-brand)" />
                <div className="flex flex-col items-center text-center">
                  <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary)">
                    {items.find((i) => i.id === confirm.itemId)?.title}를 영원히 삭제할까요?
                  </span>
                  <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary)">
                    삭제하면 되돌릴 수 없어요
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 items-center">
                <button
                  type="button"
                  className="flex items-center justify-center h-11 px-3 w-32 rounded-lg bg-(--color-bg-default) border border-(--color-border-subtle) [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-secondary)"
                  onClick={() => setConfirm(null)}
                >
                  취소하기
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center h-11 px-3 w-32 rounded-lg bg-(--color-button-default) [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-inverse)"
                  onClick={handleConfirmDelete}
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 토스트 메시지 */}
      {toasts.length > 0 && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 items-end z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={[
                'bg-(--color-bg-default) rounded-(--scale-12) shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)] flex gap-2.5 items-center px-8 py-4',
                toast.exiting
                  ? 'animate-[slideDown_0.2s_ease-in_forwards]'
                  : 'animate-[slideUp_0.2s_ease-out]',
              ].join(' ')}
            >
              <SuccessIcon className="size-8 text-(--color-icon-brand)" />
              <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary) whitespace-nowrap">
                {toast.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
