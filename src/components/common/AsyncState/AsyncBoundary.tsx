import { Suspense, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from './ErrorBoundary'
import { LoadingState, ErrorState } from './AsyncState'

interface AsyncBoundaryProps {
  children: ReactNode
  loadingMessage?: string
  errorMessage?: string
}

export function AsyncBoundary({
  children,
  loadingMessage = '불러오는 중입니다',
  errorMessage = '문제가 발생했습니다',
}: AsyncBoundaryProps) {
  const { pathname } = useLocation()

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          resetKey={pathname}
          fallback={(_error, retry) => (
            <ErrorState message={errorMessage} onRetry={retry} className="h-full w-full" />
          )}
        >
          <Suspense fallback={<LoadingState message={loadingMessage} className="h-full w-full" />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
