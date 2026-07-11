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
    <div className="flex min-h-screen items-center justify-center bg-(--color-bg-default)">
      <div className="flex w-full max-w-[800px] flex-col items-center gap-[60px] rounded-[32px] px-[100px] py-[80px]">
        <div className="flex flex-col items-center gap-8">
          {illustration}
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold text-(--color-text-default)">{title}</h1>
            <p className="leading-relaxed text-(--color-text-tertiary)">{description}</p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-6">
          {action}
          {footer}
        </div>
      </div>
    </div>
  )
}
