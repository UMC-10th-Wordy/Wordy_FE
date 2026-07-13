interface PerformanceStatusNoticeProps {
  imageSrc: string
  imageAlt?: string
  message: string
}

export const PerformanceStatusNotice = ({
  imageSrc,
  imageAlt = '',
  message,
}: PerformanceStatusNoticeProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-(--scale-16)">
      <img src={imageSrc} alt={imageAlt} className="h-[129px] w-[253px] shrink-0" />

      <p className="max-w-full whitespace-pre-line text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-medium)] text-(--color-text-secondary)">
        {message}
      </p>
    </div>
  )
}
