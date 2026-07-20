import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import PlusIcon from '@/assets/icons/plus.svg?react'
import ClipIcon from '@/assets/icons/clip.svg?react'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import type { TaskResultFile, TaskResultImage } from '@/types/todo'
import {
  ResultPreviewModal,
  isImageAttachment,
  type ResultPreviewTarget,
} from './ResultPreviewModal'

/* 첨부 캡션 문구 */
const ATTACHMENT_NOTICE = '* 첨부된 파일과 이미지의 내용은 성과에 반영되지 않아요'

interface ResultAttachmentsProps {
  files: TaskResultFile[]
  images: TaskResultImage[]
  editable?: boolean
  onRemoveFile?: (id: string) => void
  onRemoveImage?: (id: string) => void
  onAddFiles?: (files: File[]) => void
  onAddImages?: (files: File[]) => void
}

/* 업무 결과에 첨부된 파일/이미지 - (보기 전용 + 편집 가능) 모드 공용 */
export function ResultAttachments({
  files,
  images,
  editable,
  onRemoveFile,
  onRemoveImage,
  onAddFiles,
  onAddImages,
}: ResultAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [previewTarget, setPreviewTarget] = useState<ResultPreviewTarget | null>(null)

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const selectedFiles = input.files ? Array.from(input.files) : []
    input.value = ''
    if (selectedFiles.length > 0) onAddFiles?.(selectedFiles)
  }

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const selectedFiles = input.files ? Array.from(input.files) : []
    input.value = ''
    if (selectedFiles.length > 0) onAddImages?.(selectedFiles)
  }

  if (!editable && files.length === 0 && images.length === 0) return null

  /* 실제 확장자 기준
     jpeg/jpg/png/gif/webp면 첨부 방식과 무관하게 사진형 UI, 그 외는 텍스트형 UI */
  const chipFiles = files.filter((file) => !isImageAttachment(file.name))
  const thumbnailItems = [
    ...images.map((image) => ({ ...image, origin: 'image' as const })),
    ...files
      .filter((file) => isImageAttachment(file.name))
      .map((file) => ({ ...file, origin: 'file' as const })),
  ]

  return (
    <div className="flex w-full flex-col items-start gap-3">
      {chipFiles.length > 0 && (
        <div className="flex w-full flex-wrap items-start gap-2">
          {chipFiles.map((file) => (
            <div
              key={file.id}
              className="flex h-8 shrink-0 items-center justify-center gap-1 rounded-md border border-(--color-border-subtle) bg-(--color-bg-default) px-2"
            >
              <button
                type="button"
                onClick={() => setPreviewTarget({ kind: 'file', name: file.name, url: file.url })}
                className="flex items-center gap-1"
              >
                <ClipIcon aria-hidden className="size-5 shrink-0 text-(--color-icon-secondary)" />
                <span className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-medium whitespace-nowrap text-(--color-text-secondary)">
                  {file.name}
                </span>
              </button>
              {editable && (
                <button
                  type="button"
                  aria-label={`${file.name} 삭제`}
                  onClick={() => onRemoveFile?.(file.id)}
                  className="flex size-5 shrink-0 items-center justify-center"
                >
                  <XMarkIcon
                    aria-hidden
                    className="size-5 shrink-0 text-(--color-icon-secondary)"
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {thumbnailItems.length > 0 && (
        <div className="flex w-full flex-wrap items-center gap-2">
          {thumbnailItems.map((item) => (
            <div
              key={item.id}
              className="relative size-16 shrink-0 rounded-lg border border-(--color-border-default)"
            >
              <button
                type="button"
                aria-label={`${item.name} 미리보기`}
                onClick={() => setPreviewTarget({ kind: 'image', name: item.name, url: item.url })}
                className="block size-full"
              >
                <img src={item.url} alt="" className="size-full rounded-lg object-cover" />
              </button>
              {editable && (
                <button
                  type="button"
                  aria-label="이미지 삭제"
                  onClick={() =>
                    item.origin === 'image' ? onRemoveImage?.(item.id) : onRemoveFile?.(item.id)
                  }
                  className="absolute top-1 right-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-black/30"
                >
                  <XMarkIcon aria-hidden className="size-full text-(--color-icon-inverse)" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {editable && (
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 shrink-0 items-center justify-center gap-1 rounded-md px-2 text-(--color-button-default) transition-colors duration-100 ease-out hover:bg-(--color-bg-brand-light)"
            >
              <PlusIcon aria-hidden className="size-5 shrink-0" />
              <span className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-medium">
                파일
              </span>
            </button>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex h-8 shrink-0 items-center justify-center gap-1 rounded-md px-2 text-(--color-button-default) transition-colors duration-100 ease-out hover:bg-(--color-bg-brand-light)"
            >
              <PlusIcon aria-hidden className="size-5 shrink-0" />
              <span className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-medium">
                이미지
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageInputChange}
            />
          </div>
          <span className="[font-size:var(--font-size-caption-1)] leading-(--line-height-body) font-medium whitespace-nowrap text-(--color-text-tertiary)">
            {ATTACHMENT_NOTICE}
          </span>
        </div>
      )}

      {previewTarget && (
        <ResultPreviewModal target={previewTarget} onClose={() => setPreviewTarget(null)} />
      )}
    </div>
  )
}
