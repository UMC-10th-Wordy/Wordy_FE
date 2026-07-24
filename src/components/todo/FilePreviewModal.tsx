import { useId } from 'react'
import { createPortal } from 'react-dom'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import DownloadIcon from '@/assets/icons/download.svg?react'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'
import { downloadFile, getExtension } from '@/utils/file'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useModalFocus } from '@/hooks/useModalFocus'
import { UnsupportedPreviewContent } from './PreviewStateMessages'
import { PdfPreviewContent } from './PdfPreviewContent'

interface FilePreviewModalProps {
  name: string
  url: string
  onClose: () => void
}

export function FilePreviewModal({ name, url, onClose }: FilePreviewModalProps) {
  useEscapeKey(onClose)
  const containerRef = useModalFocus<HTMLDivElement>()
  const titleId = useId()
  const isPdf = getExtension(name) === 'pdf'

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/25 backdrop-blur-[8px]"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex w-[min(800px,calc(100vw-2.5rem))] max-h-[90vh] flex-col rounded-(--scale-12) bg-(--color-bg-default) shadow-[0px_1px_7.5px_0px_rgba(0,0,0,0.1)]"
      >
        <Scrollbar>
          <div className="flex w-full flex-col items-center gap-7 px-5 pt-5 pb-7">
            <div className="flex w-full items-start justify-between">
              <p
                id={titleId}
                className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)"
              >
                {name}
              </p>
              <IconButton
                type="button"
                variant="text_neutral"
                size="small"
                aria-label="닫기"
                onClick={onClose}
                icon={<XMarkIcon aria-hidden className="size-6" />}
              />
            </div>

            {isPdf ? <PdfPreviewContent key={url} url={url} /> : <UnsupportedPreviewContent />}

            <TextButton
              type="button"
              variant="stroke"
              size="medium"
              className="w-[140px] !pr-5" /*피그마와 다르게 오른쪽 여백 추가함*/
              iconLeft={<DownloadIcon aria-hidden className="size-7 shrink-0" />}
              onClick={() => downloadFile(url, name)}
            >
              다운로드 하기
            </TextButton>
          </div>
        </Scrollbar>
      </div>
    </div>,
    document.body,
  )
}
