interface PerformanceReadOnlySectionProps {
  title: string
  value: string
  showBullet?: boolean
}

const getContentLines = (value: string) => {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

const removeBulletPrefix = (value: string) => {
  return value.replace(/^-\s*/, '')
}

export const PerformanceReadOnlySection = ({
  title,
  value,
  showBullet = false,
}: PerformanceReadOnlySectionProps) => {
  const contentLines = getContentLines(value)

  return (
    <section className="flex w-full flex-col">
      <div className="pb-[6px]">
        <h3 className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
          {title}
        </h3>
      </div>

      {showBullet ? (
        <ul className="mt-(--scale-4) flex w-full flex-col">
          {contentLines.map((line, index) => (
            <li key={`${line}-${index}`} className="flex items-start">
              <span
                aria-hidden="true"
                className="shrink-0 [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] text-(--color-text-default)"
              >
                -&nbsp;
              </span>

              <p className="min-w-0 flex-1 [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] whitespace-pre-wrap text-(--color-text-default)">
                {removeBulletPrefix(line)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-(--scale-4) [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] whitespace-pre-wrap text-(--color-text-default)">
          {value}
        </p>
      )}
    </section>
  )
}
