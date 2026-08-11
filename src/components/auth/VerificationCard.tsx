import type { ReactNode } from 'react'

interface VerificationCardProps {
  illustration: ReactNode
  title: string
  description: ReactNode
  action: ReactNode
  footer?: ReactNode
}

export const VerificationCard = ({
  illustration,
  title,
  description,
  action,
  footer,
}: VerificationCardProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-bg-secondary) px-6 py-16">
      <div className="flex w-full max-w-[800px] flex-col items-center gap-[60px] rounded-[32px] bg-(--color-bg-default) px-[100px] py-[80px] shadow-xl shadow-black/5">
        {illustration}
        <div className="flex flex-col items-center gap-5 text-center">
          <h1 className="[font-size:var(--font-size-heading-1)] font-semibold leading-(--line-height-heading) text-(--color-text-default)">
            {title}
          </h1>
          <p className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) text-(--color-text-tertiary)">
            {description}
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-5">
          {action}
          {footer}
        </div>
      </div>
    </div>
  )
}
