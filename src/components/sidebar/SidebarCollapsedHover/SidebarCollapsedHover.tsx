import { useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import type { SidebarPage } from '../Sidebar/Sidebar'
import LogoSmallIcon from '@/assets/icons/logo-small.svg?react'
import SidebarIcon from '@/assets/icons/sidebar.svg?react'

export interface SidebarCollapsedHoverProps extends HTMLAttributes<HTMLDivElement> {
  activePage?: SidebarPage
  pages?: Array<{ page: SidebarPage; icon: ReactNode; badge?: number }>
  onNavigate?: (page: SidebarPage) => void
  onNotificationClick?: () => void
  onProfileClick?: () => void
  onExpand?: () => void
  avatarSrc?: string
  userName?: string
}

export function SidebarCollapsedHover({
  activePage,
  pages = [],
  onNavigate,
  onNotificationClick,
  onProfileClick,
  onExpand,
  avatarSrc,
  userName = '',
  className,
  ...rest
}: SidebarCollapsedHoverProps) {
  const [logoHovered, setLogoHovered] = useState(false)

  return (
    <div
      className={[
        'bg-(--color-bg-brand-subtle) flex flex-col items-center justify-between pb-9 pt-6 size-full w-18',
        className,
      ].join(' ')}
      {...rest}
    >
      <div className="flex flex-col gap-8 items-center shrink-0 relative">
        {/* 로고 — hover 시 사이드바 접기 아이콘으로 교체, 클릭 시 사이드바 펼치기 */}
        <button
          type="button"
          onClick={onExpand}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          className="shrink-0 size-8 flex items-center justify-center rounded-md hover:bg-(--color-bg-tertiary) focus-visible:ring-2 focus-visible:ring-(--color-border-brand) focus-visible:outline-none transition-colors duration-100"
          aria-label="사이드바 펼치기"
        >
          {logoHovered ? <SidebarIcon className="size-6" /> : <LogoSmallIcon className="size-8" />}
        </button>

        {/* 페이지 아이콘들 */}
        <div className="absolute flex flex-col gap-2 items-start top-17 -left-5 w-18">
          {pages.map(({ page, icon, badge }) => {
            const isFocused = page === activePage
            return (
              <button
                key={page}
                type="button"
                onClick={() => (page === '알림함' ? onNotificationClick?.() : onNavigate?.(page))}
                className={[
                  'group relative flex h-12 items-center justify-center w-18 transition-colors duration-100 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--color-border-brand)',
                  isFocused
                    ? 'bg-(--color-sidebar-primary-focused) border-r-2 border-(--color-border-brand)'
                    : 'hover:bg-(--color-sidebar-primary-hover)',
                ].join(' ')}
                aria-label={page}
              >
                <span className="relative shrink-0 size-6">
                  {icon}
                  {badge != null && badge > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-(--color-status-error)" />
                  )}
                </span>
                {/* 툴팁 */}
                <span className="absolute left-full ml-3 hidden group-hover:flex group-focus-visible:flex items-center z-10 pointer-events-none">
                  <span className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[7px] border-r-(--color-bg-dark)" />
                  <span className="bg-(--color-bg-dark) text-(--color-text-inverse) [font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium px-2.5 py-1 rounded-lg whitespace-nowrap">
                    {page}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 하단 아바타 */}
      <button
        type="button"
        onClick={onProfileClick}
        className="shrink-0 size-12 rounded-(--scale-1000) border border-(--color-border-opacity) overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-brand)"
        aria-label="프로필"
      >
        {avatarSrc ? (
          <img src={avatarSrc} alt="프로필" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-(--color-bg-secondary) [font-size:var(--font-size-body-3)] font-semibold text-(--color-text-secondary)">
            {userName.charAt(0)}
          </div>
        )}
      </button>
    </div>
  )
}
