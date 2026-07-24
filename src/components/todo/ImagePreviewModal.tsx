import { useId, useState } from 'react'
import { createPortal } from 'react-dom'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import DownloadIcon from '@/assets/icons/download.svg?react'
import ImageIcon from '@/assets/icons/image.svg?react'
import { downloadFile } from '@/utils/file'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useModalFocus } from '@/hooks/useModalFocus'
import { IconButton } from '@/components/common/Button/IconButton'

const IMAGE_MAX_SIZE = 600

interface ImagePreviewModalProps {
  name: string
  url: string
  onClose: () => void
}

export function ImagePreviewModal({ name, url, onClose }: ImagePreviewModalProps) {
  useEscapeKey(onClose)
  const containerRef = useModalFocus<HTMLDivElement>()
  const titleId = useId()
  const [displaySize, setDisplaySize] = useState<{ width: number; height: number } | null>(null)
  const [hasError, setHasError] = useState(false)

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/25 backdrop-blur-[8px]"
      />
      {/* 이미지만 가운데 정렬 -> 버튼은 absolute(영향 없음) */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative inline-block"
      >
        {hasError ? (
          <div className="flex h-[280px] w-[600px] flex-col items-center justify-center gap-4 rounded-(--scale-8) bg-black/50 pt-8 pb-7">
            <ImageIcon aria-hidden className="size-16 text-(--color-icon-inverse)" />
            <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-inverse)">
              미리보기 로딩에 실패했어요
            </p>
          </div>
        ) : (
          <img
            src={url}
            alt={name}
            onLoad={(event) => {
              const img = event.currentTarget
              const scale = Math.min(
                1,
                IMAGE_MAX_SIZE / img.naturalWidth,
                IMAGE_MAX_SIZE / img.naturalHeight,
              )
              setDisplaySize({ width: img.naturalWidth * scale, height: img.naturalHeight * scale })
            }}
            onError={() => setHasError(true)}
            style={
              displaySize ? { width: displaySize.width, height: displaySize.height } : undefined
            }
            className="block rounded-lg shadow-[0px_1px_15px_0px_rgba(0,0,0,0.1)]"
          />
        )}

        {/* 다운로드/닫기 아이콘 */}
        <div className="absolute top-0 left-full ml-5 flex flex-col gap-2">
          <IconButton
            type="button"
            variant="icon_inverse"
            size="large"
            className="!size-[52px] !rounded-md"
            aria-label="닫기"
            onClick={onClose}
            icon={<XMarkIcon aria-hidden className="size-7" />}
          />
          <IconButton
            type="button"
            variant="icon_inverse"
            size="large"
            className="!size-[52px] !rounded-md"
            aria-label="다운로드"
            onClick={() => downloadFile(url, name)}
            icon={<DownloadIcon aria-hidden className="size-7 shrink-0" />}
          />
        </div>

        {/* 파일 이름 */}
        <div className="absolute top-full left-1/2 mt-5 -translate-x-1/2">
          <p
            id={titleId}
            className="rounded-(--scale-8) bg-black/50 px-3 py-1 [font-size:var(--font-size-body-1)] leading-(--line-height-body) font-medium whitespace-nowrap text-(--color-text-inverse)"
          >
            {name}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
