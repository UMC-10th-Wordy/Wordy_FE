interface DiaryRetrospectiveProps {
  content: string
}

export const DiaryRetrospective = ({ content }: DiaryRetrospectiveProps) => {
  return (
    <section className="flex w-full flex-col gap-(--scale-12) pb-[60px]">
      <p className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-[var(--font-weight-semibold)] text-(--color-text-default)">
        오늘의 회고
      </p>

      <div className="h-[120px] w-full overflow-y-auto rounded-(--scale-8) border-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-brand-subtle) px-(--scale-20) py-(--scale-12)">
        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-[var(--font-weight-regular)] whitespace-pre-wrap text-(--color-text-default)">
          {content}
        </p>
      </div>
    </section>
  )
}
