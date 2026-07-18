import { useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import type { SidebarPage } from '../Sidebar/Sidebar'
import { SidebarIcon } from '@/components/sidebar/SidebarIcon/SidebarIcon'
import { IconButton } from '@/components/common/Button/IconButton'
import LogoSmallIcon from '@/assets/icons/logo-small.svg?react'
import SidebarToggleIcon from '@/assets/icons/sidebar.svg?react'

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
        <IconButton
          variant="text_neutral"
          size="small"
          icon={
            logoHovered ? (
              <SidebarToggleIcon className="size-6" />
            ) : (
              <LogoSmallIcon className="size-8" />
            )
          }
          onClick={onExpand}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          aria-label="사이드바 펼치기"
        />

        {/* 페이지 아이콘들 */}
        <div className="absolute flex flex-col gap-2 items-start top-17 -left-5 w-18">
          {pages.map(({ page, icon, badge }) => {
            const isFocused = page === activePage
            return (
              <SidebarIcon
                key={page}
                icon={icon}
                tooltip={page}
                state={isFocused ? 'focused' : 'default'}
                dot={badge != null && badge > 0}
                onClick={() => (page === '알림함' ? onNotificationClick?.() : onNavigate?.(page))}
                aria-label={page}
              />
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
