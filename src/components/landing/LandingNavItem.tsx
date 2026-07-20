interface LandingNavItemProps {
  children: string
  selected?: boolean
  onClick?: () => void
}

export function LandingNavItem({ children, selected = false, onClick }: LandingNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 items-center px-7 [font-size:var(--font-size-body-2)] font-medium leading-(--line-height-body) whitespace-nowrap transition-colors ${
        selected
          ? 'text-(--color-text-brand)'
          : 'text-(--color-text-tertiary) hover:text-(--color-text-secondary) active:text-(--color-text-secondary) transition-colors duration-100 ease-out'
      }`}
    >
      {children}
    </button>
  )
}
