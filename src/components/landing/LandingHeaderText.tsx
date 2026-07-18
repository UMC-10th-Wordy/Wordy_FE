interface LandingHeaderTextProps {
  children: string
  style?: '1' | '2'
  state?: 'default' | 'hover' | 'pressed'
  onClick?: () => void
}

export function LandingHeaderText({
  children,
  style = '1',
  state = 'default',
  onClick,
}: LandingHeaderTextProps) {
  const textColor =
    style === '1' && (state === 'hover' || state === 'pressed')
      ? 'text-(--color-text-default)'
      : style === '2' && state === 'default'
        ? 'text-(--color-text-tertiary)'
        : 'text-(--color-text-secondary)'

  return (
    <div
      onClick={onClick}
      className={`flex items-center ${state === 'hover' ? 'cursor-pointer' : ''}`}
    >
      <span
        className={`[font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) whitespace-nowrap ${textColor}`}
      >
        {children}
      </span>
    </div>
  )
}
