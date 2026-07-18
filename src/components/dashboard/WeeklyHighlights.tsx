interface HighlightItem {
  text: string
  source: string
}

interface WeeklyHighlightsProps {
  items: HighlightItem[]
  title?: string
  description?: string
}

export const WeeklyHighlights = ({
  items,
  title = '이번 주 성과 요약',
  description = '프로젝트 태그가 없는 업무의 성과를 요약했어요',
}: WeeklyHighlightsProps) => {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-(--color-border-subtle) bg-(--color-bg-default) p-7">
      <div className="flex flex-col gap-1">
        <h2 className="[font-size:var(--font-size-body-2)] font-bold text-(--color-text-default)">
          {title}
        </h2>
        <p className="[font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
          {description}
        </p>
      </div>
      <ol className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={item.text} className="flex items-baseline gap-3">
            <span className="[font-size:var(--font-size-body-4)] font-semibold text-(--color-text-brand)">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="[font-size:var(--font-size-body-3)] text-(--color-text-default)">
              {item.text}
            </span>
            <span className="[font-size:var(--font-size-caption-1)] text-(--color-text-tertiary)">
              {item.source} &gt;
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
