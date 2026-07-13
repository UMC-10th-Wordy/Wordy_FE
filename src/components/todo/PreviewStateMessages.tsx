import DocumentIcon from '@/assets/icons/document 2.svg?react'

export function UnsupportedPreviewContent() {
  return (
    <div className="flex w-full flex-col items-center gap-4 pt-8 pb-7">
      <DocumentIcon aria-hidden className="size-16" />
      <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary)">
        미리보기를 지원하지 않는 형식이에요
      </p>
    </div>
  )
}

export function LoadFailedPreviewContent() {
  return (
    <div className="flex w-full flex-col items-center gap-4 pt-8 pb-7">
      <DocumentIcon aria-hidden className="size-16" />
      <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-secondary)">
        미리보기를 불러올 수 없어요
      </p>
    </div>
  )
}
