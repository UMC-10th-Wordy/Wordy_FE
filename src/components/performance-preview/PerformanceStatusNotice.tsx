interface PerformanceStatusNoticeProps {
  imageSrc: string
  imageAlt?: string
  imageClassName: string
  message: string
  bottomSpacingClassName?: string
}

export const PerformanceStatusNotice = ({
  imageSrc,
  imageAlt = '',
  imageClassName,
  message,
  bottomSpacingClassName,
}: PerformanceStatusNoticeProps) => {
  const containerClassName = ['flex flex-col items-center justify-center', bottomSpacingClassName]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClassName}>
      <img src={imageSrc} alt={imageAlt} className={`shrink-0 ${imageClassName}`} />

      <p className="mt-(--scale-16) max-w-full whitespace-pre-line text-center [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-medium)] text-(--color-text-secondary)">
        {message}
      </p>
    </div>
  )
}
