interface LandingFeatureTabProps {
  children: string
  selected?: boolean
  onClick?: () => void
}

export function LandingFeatureTab({ children, selected = false, onClick }: LandingFeatureTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 w-32 items-center justify-center rounded-lg px-5 py-2 [font-size:var(--font-size-body-2)] font-medium leading-(--line-height-body) whitespace-nowrap transition-all duration-200 ease-out ${
        selected
          ? 'bg-(--color-icon-brand) text-(--color-text-inverse) shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]'
          : 'text-(--color-text-tertiary) hover:bg-(--color-bg-secondary)'
      }`}
    >
      {children}
    </button>
  )
}
