import LogoIcon from '@/assets/icons/logo.svg?react'
import headerBg from '@/assets/images/landing-header-bg.png'
import { LandingNavItem } from './LandingNavItem'

type LandingPage = '홈' | '기능 소개' | '요금제 안내'

interface LandingHeaderProps {
  currentPage?: LandingPage
  isLoggedIn?: boolean
  onNavigate?: (page: LandingPage) => void
  onSignup?: () => void
  onLogin?: () => void
}

export function LandingHeader({
  currentPage = '홈',
  isLoggedIn = false,
  onNavigate,
  onSignup,
  onLogin,
}: LandingHeaderProps) {
  const pages: LandingPage[] = ['홈', '기능 소개', '요금제 안내']

  return (
    <header className="relative flex h-20 w-full items-center justify-between px-10">
      <img
        src={headerBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* 로고 + 네비 */}
      <div className="relative flex items-center gap-10">
        <LogoIcon className="h-8 w-[110.857px] shrink-0" />
        <nav className="flex items-center gap-3">
          {pages.map((page) => (
            <LandingNavItem
              key={page}
              selected={currentPage === page}
              onClick={() => onNavigate?.(page)}
            >
              {page}
            </LandingNavItem>
          ))}
        </nav>
      </div>

      {/* 로그인/회원가입 */}
      {!isLoggedIn && (
        <div className="relative flex items-center gap-3.5">
          <button
            type="button"
            onClick={onSignup}
            className="flex h-11 w-25 items-center justify-center rounded-lg [font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-button-default) transition-colors hover:bg-(--color-bg-tertiary)"
          >
            회원가입
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="flex h-11 w-25 items-center justify-center rounded-lg bg-(--color-button-default) [font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-text-inverse) transition-opacity hover:opacity-90"
          >
            로그인
          </button>
        </div>
      )}
    </header>
  )
}
