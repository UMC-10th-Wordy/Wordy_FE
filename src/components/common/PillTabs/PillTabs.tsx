interface PillTabsProps<T extends string> {
  tabs: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export function PillTabs<T extends string>({ tabs, value, onChange }: PillTabsProps<T>) {
  return (
    <div className="flex self-start shrink-0 items-center rounded-lg bg-(--color-bg-brand-light) p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={[
            'flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2 [font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) whitespace-nowrap transition-colors',
            value === tab.value
              ? 'bg-(--color-bg-default) text-(--color-text-default) shadow-[0px_1px_2.5px_rgba(0,0,0,0.1)]'
              : 'text-(--color-text-tertiary)',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
